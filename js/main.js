/* =========================================================
   CORVO BARBEARIA — interações
   Vanilla JS, sem dependências.
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WA = '5511988774321';

  /* ---------------------------------------------------------
     LOADER — barra fake curta, depois libera a animação do hero
     --------------------------------------------------------- */
  (function loader() {
    var el = $('#loader'), fill = $('#loaderFill'), pct = $('#loaderPct');
    if (!el) return;

    if (reduce) {
      el.classList.add('is-done');
      document.body.classList.add('is-ready');
      return;
    }

    var v = 0;
    var t = setInterval(function () {
      v = Math.min(100, v + Math.random() * 18 + 6);
      fill.style.width = v + '%';
      pct.textContent = Math.round(v);
      if (v >= 100) {
        clearInterval(t);
        setTimeout(function () {
          el.classList.add('is-done');
          document.body.classList.add('is-ready');
        }, 260);
      }
    }, 110);

    // rede de segurança: nunca deixa o loader preso
    setTimeout(function () {
      clearInterval(t);
      el.classList.add('is-done');
      document.body.classList.add('is-ready');
    }, 3500);
  })();

  /* ---------------------------------------------------------
     HEADER — encolhe no scroll e some ao descer
     --------------------------------------------------------- */
  (function header() {
    var hdr = $('#hdr'), last = 0;
    var onScroll = function () {
      var y = window.scrollY;
      hdr.classList.toggle('is-stuck', y > 40);
      var menuOpen = $('#menu').classList.contains('is-open');
      hdr.classList.toggle('is-hidden', y > 420 && y > last && !menuOpen);
      last = y;
      $('#totop').classList.toggle('is-on', y > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------------------------------------------------------
     MENU MOBILE
     --------------------------------------------------------- */
  (function menu() {
    var burger = $('#burger'), menu = $('#menu');
    var toggle = function (open) {
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    };
    burger.addEventListener('click', function () {
      toggle(!menu.classList.contains('is-open'));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) toggle(false);
    });
  })();

  /* ---------------------------------------------------------
     REVEAL ao entrar na viewport
     --------------------------------------------------------- */
  (function reveal() {
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduce) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------------------------------------------------
     CONTADORES do hero
     --------------------------------------------------------- */
  (function counters() {
    var els = $$('[data-count]');
    var run = function (el) {
      var target = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.dec || '0', 10);
      var suf = el.dataset.suffix || '';
      if (reduce) { el.textContent = target.toFixed(dec) + suf; return; }
      var dur = 1600, t0 = null;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------------------------------------------------
     SERVIÇOS — miniatura que segue o cursor
     --------------------------------------------------------- */
  (function srvHover() {
    var box = $('#srv'), float = $('#srvFloat');
    if (!box || !float || window.matchMedia('(pointer: coarse)').matches) return;
    var img = $('img', float);
    var raf = null, tx = 0, ty = 0, cx = 0, cy = 0;

    var loop = function () {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      float.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%) ' +
        (float.classList.contains('is-on') ? 'scale(1) rotate(-3deg)' : 'scale(.85) rotate(-5deg)');
      raf = requestAnimationFrame(loop);
    };

    $$('.srv__row', box).forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var src = row.dataset.img;
        if (src && img.getAttribute('src') !== src) img.src = src;
        float.classList.add('is-on');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      row.addEventListener('mouseleave', function () { float.classList.remove('is-on'); });
    });

    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    });

    box.addEventListener('mouseleave', function () {
      float.classList.remove('is-on');
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    });
  })();

  /* ---------------------------------------------------------
     GALERIA — lightbox
     --------------------------------------------------------- */
  (function lightbox() {
    var items = $$('.gal__it');
    var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
    var i = 0;

    var show = function (n) {
      i = (n + items.length) % items.length;
      var img = $('img', items[i]);
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = ($('figcaption', items[i]) || {}).textContent || '';
    };
    var open = function (n) { show(n); lb.classList.add('is-on'); document.body.classList.add('is-locked'); };
    var close = function () { lb.classList.remove('is-on'); document.body.classList.remove('is-locked'); };

    items.forEach(function (el, n) { el.addEventListener('click', function () { open(n); }); });
    $('#lbX').addEventListener('click', close);
    $('#lbP').addEventListener('click', function () { show(i - 1); });
    $('#lbN').addEventListener('click', function () { show(i + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'ArrowLeft') show(i - 1);
    });
  })();

  /* ---------------------------------------------------------
     DEPOIMENTOS — setas + arrastar
     --------------------------------------------------------- */
  (function depo() {
    var rail = $('#depoRail');
    if (!rail) return;
    var card = $('.depo__c', rail);
    var step = function () { return card ? card.offsetWidth + 20 : 380; };

    $('#depoPrev').addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    $('#depoNext').addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });

    var down = false, x0 = 0, s0 = 0;
    rail.addEventListener('pointerdown', function (e) {
      down = true; x0 = e.clientX; s0 = rail.scrollLeft;
      rail.classList.add('is-drag');
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; rail.classList.remove('is-drag');
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      e.preventDefault();
      rail.scrollLeft = s0 - (e.clientX - x0);
    });
  })();

  /* ---------------------------------------------------------
     FAQ — acordeão (um aberto por vez)
     --------------------------------------------------------- */
  (function faq() {
    var acs = $$('.ac');
    acs.forEach(function (ac) {
      var q = $('.ac__q', ac), a = $('.ac__a', ac);
      q.addEventListener('click', function () {
        var open = ac.classList.contains('is-open');
        acs.forEach(function (o) {
          o.classList.remove('is-open');
          $('.ac__a', o).style.height = '0px';
          $('.ac__q', o).setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          ac.classList.add('is-open');
          a.style.height = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
    window.addEventListener('resize', function () {
      var open = $('.ac.is-open');
      if (open) $('.ac__a', open).style.height = $('.ac__a', open).scrollHeight + 'px';
    });
  })();

  /* ---------------------------------------------------------
     FORMULÁRIO — monta a mensagem e abre o WhatsApp
     --------------------------------------------------------- */
  (function form() {
    var f = $('#form');
    if (!f) return;

    // turno preferido
    $$('#chips .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        $$('#chips .chip').forEach(function (o) { o.classList.remove('is-on'); });
        c.classList.add('is-on');
        $('#f-hora').value = c.textContent.trim();
      });
    });

    // máscara simples de telefone
    var tel = $('#f-tel');
    tel.addEventListener('input', function () {
      var v = tel.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4);
      else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      else if (v.length) v = '(' + v;
      tel.value = v;
    });

    // data mínima = hoje
    var d = $('#f-data');
    d.min = new Date().toISOString().split('T')[0];

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var req = ['#f-nome', '#f-tel', '#f-serv', '#f-data'];
      var ok = true;
      req.forEach(function (sel) {
        var el = $(sel);
        var bad = !el.value.trim();
        el.classList.toggle('err', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;

      var data = $('#f-data').value.split('-');
      var dataBR = data.length === 3 ? data[2] + '/' + data[1] + '/' + data[0] : $('#f-data').value;

      var msg =
        'Olá, CORVO! Quero agendar um horário.\n\n' +
        '• Nome: ' + $('#f-nome').value.trim() + '\n' +
        '• WhatsApp: ' + $('#f-tel').value.trim() + '\n' +
        '• Serviço: ' + $('#f-serv').value + '\n' +
        '• Barbeiro: ' + $('#f-barb').value + '\n' +
        '• Dia: ' + dataBR + '\n' +
        '• Período: ' + ($('#f-hora').value || 'sem preferência');

      var obs = $('#f-obs').value.trim();
      if (obs) msg += '\n• Observação: ' + obs;

      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });

    $$('#form input, #form select').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('err'); });
    });
  })();

  /* ---------------------------------------------------------
     NAV ativa conforme a seção visível
     --------------------------------------------------------- */
  (function activeNav() {
    var links = $$('.nav a');
    var secs = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if (!secs.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  })();

  /* ---------------------------------------------------------
     MISC
     --------------------------------------------------------- */
  $('#totop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  $('#yr').textContent = new Date().getFullYear();

})();
