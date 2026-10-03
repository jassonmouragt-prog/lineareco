# Linear & Co.

Site da Linear & Co. — Next.js 16 (App Router) + Tailwind 4, deploy na Vercel
via GitHub (push em `master` publica sozinho).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
```

## Portfólio: o cliente edita sem tocar em código

O portfólio **não** é código editado à mão. A fonte da verdade é o sistema de
pastas:

```
public/images/portfolio/projeto-01/
├── 01.webp          <- capa do projeto
├── 02.webp
└── projeto.json     <- opcional: título, categoria e textos das fotos
```

Uma pasta = um projeto. As fotos dentro da pasta são as fotos daquele projeto.
A ordem é a ordem alfabética dos arquivos.

`src/data/gallery.generated.ts` é **gerado** por:

```bash
npm run portfolio
```

O script não usa nenhuma dependência externa: as dimensões das imagens são lidas
direto do cabeçalho do arquivo (WebP, JPEG, PNG), então roda em qualquer máquina
e no CI sem módulo nativo. Ele falha com mensagem em português quando encontra
`projeto.json` inválido, pasta sem fotos ou formato não suportado (`.heic`,
`.avif`) — em vez de descartar uma foto silenciosamente.

### Automação

`.github/workflows/portfolio.yml` roda o script a cada push que mexe em
`public/images/portfolio/**` e commata o resultado sozinho. Ou seja: **quem
edita o portfólio não precisa de terminal** — só soltar as fotos na pasta
certa e dar commit no GitHub.

O filtro `paths` é o que evita ciclo: o commit automático só mexe em
`src/data/gallery.generated.ts`, que está fora do filtro.

### Por que as imagens do Hero/Sobre/Rodapé são cópias

`public/images/sobre-*.webp` e `public/images/rodape.webp` são cópias
independentes das fotos do portfólio. Assim, apagar ou reorganizar qualquer
pasta de projeto **não quebra** o Hero, o Sobre ou o Rodapé.

### Guia do cliente

[`docs/PORTFOLIO.md`](docs/PORTFOLIO.md) — passo a passo, sem jargão, para
adicionar/trocar/remover fotos, criar e apagar projetos e editar textos.

## Onde mexer no código

| Arquivo | Responsabilidade |
|---|---|
| `src/app/layout.tsx` | metadata, SEO, Open Graph, Twitter, Schema.org |
| `src/app/page.tsx` | ordem das seções e transições |
| `src/components/Portfolio.tsx` | layout editorial e carrossel mobile |
| `src/components/Lightbox.tsx` | lightbox por projeto |
| `src/components/Testimonials.tsx` | cards e carrossel de depoimentos |
| `src/data/site.ts` | marca, contato, navegação |
| `src/data/images.ts` | imagens do Hero, Sobre e Rodapé |
| `src/data/testimonials.ts` | textos de depoimentos |
| `scripts/build-portfolio.mjs` | gerador do portfólio (não editar resultado) |

**Nunca editar:** `src/data/gallery.generated.ts` (gerado).

## Stack

`next@16.3.4` · `react@19.2.8` · `tailwindcss@4` · `lucide-react` · `typescript@5`
· `eslint@9`

## Deploy

Vercel, conectado a `origin/master`. Não há passo manual: build e preview rodam
no push.
