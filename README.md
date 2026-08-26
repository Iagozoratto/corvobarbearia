# CORVO Barbearia

Site institucional de barbearia — HTML, CSS e JavaScript puros, sem build e sem dependências.

## Rodar

Qualquer servidor estático na raiz do projeto:

```
python -m http.server 8131
```

Depois abra http://localhost:8131

Também funciona abrindo `index.html` direto no navegador.

### Testar no celular

O servidor aceita conexões da rede local. Com o computador e o celular no
mesmo Wi-Fi, abra no navegador do celular:

```
http://192.168.15.11:8131
```

O IP muda se a rede mudar. Para descobrir o atual:
`ipconfig` e procure o IPv4 do adaptador Wi-Fi.

## Mobile

O site é responsivo, com três faixas de ajuste: até 860px (celular e tablet
em pé), até 420px (celulares estreitos) e uma regra extra para tela deitada
e baixa.

O que muda no celular:

- Barra de ação fixa no rodapé com **Agendar** e **WhatsApp**, que entra em
  cena depois que o hero sai da tela
- O botão flutuante do WhatsApp é escondido, já que a barra cobre a função
- Menu em tela cheia pelo ícone de três traços
- Lista de serviços sem a seta, com o preço alinhado à direita
- Cartões de equipe com nome e função empilhados
- Campos do formulário em 16px, o que evita o zoom automático do iOS
- Alvos de toque com no mínimo 44px
- Arrastar os depoimentos só responde ao mouse, para não competir com o
  scroll vertical do dedo

## Estrutura

```
corvobarbearia/
├── index.html          estrutura e conteúdo
├── css/style.css       paleta, tipografia e todas as seções
├── js/main.js          loader, reveal, lightbox, formulário
└── assets/
    ├── favicon.svg
    └── img/            21 fotos
```

## Onde editar

| O que | Onde |
|---|---|
| Nome da marca | `index.html` — buscar por `CORVO` |
| Cores | `css/style.css` — bloco `:root` no topo |
| Logo (símbolo do corvo) | `index.html` — `<symbol id="i-corvo">` |
| Serviços e preços | `index.html` — seção `SERVIÇOS` |
| Planos de assinatura | `index.html` — seção `PLANOS` |
| Equipe | `index.html` — seção `EQUIPE` |
| Número do WhatsApp | `js/main.js` — constante `WA` (e os links `wa.me` no HTML) |
| Endereço e horários | `index.html` — seção `CONTATO` e rodapé |

## Formulário de agendamento

Não há backend. O formulário monta uma mensagem e abre o WhatsApp com o texto
pronto — nenhum dado é armazenado.

## Antes de publicar

- [ ] Trocar o número do WhatsApp (`5511988774321`) pelo real
- [ ] Trocar endereço, horários, e-mail e CNPJ
- [ ] Trocar os links do Instagram
- [ ] Substituir as fotos por fotos reais da barbearia
- [ ] Refinar o símbolo do corvo (ainda em ajuste)

## Fotos

As imagens em `assets/img/` são do Unsplash (uso livre, sem atribuição
obrigatória) e servem como referência visual. Devem ser trocadas por fotos
reais antes de ir ao ar.

## Marca

Nome, textos, preços, endereço e depoimentos são fictícios, criados para a
demonstração.
