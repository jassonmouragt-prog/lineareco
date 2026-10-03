# Como mexer nos projetos do portfólio

Este guia é para quem **não é da área técnica**. Não precisa instalar nada,
não precisa rodar comando nenhum. Você só mexe com pastas e fotos.

---

## A regra inteira é uma

> **Uma pasta = um projeto. As fotos dentro da pasta são as fotos desse projeto.**

Tudo que você precisa está em `public/images/portfolio/`. Hoje são 7 pastas,
`projeto-01` até `projeto-07`.

Cada pasta tem este formato:

```
public/images/portfolio/projeto-01/
├── 01.webp          ← capa do projeto (a foto grande)
├── 02.webp
├── 03.webp
└── projeto.json     ← opcional: nome, tipo e descrição das fotos
```

Assim que você termina, **o site se atualiza sozinho** em uns 2 minutos.
Não precisa avisar ninguém.

---

## Onde mexer no GitHub

1. Abra o repositório no GitHub (pode fazer pelo celular).
2. Toque na pasta `public` → `images` → `portfolio`.
3. Entre na pasta do projeto que você quer mexer.
4. Faça a alteração.
5. Clique em **Commit changes** (o botão verde).

Pronto. O site publica sozinho.

> **Dica:** a opção mais fácil de arrastar several fotos de uma vez é usar o
> [GitHub Desktop](https://desktop.github.com) — é um programa gratuito que
> mostra as pastas como pasta de verdade no seu computador. Se preferir o
> navegador mesmo, funciona igual, só que precisa arrastar uma por vez.

---

## Colocar mais fotos num projeto que já existe

1. Entre na pasta do projeto (ex.: `projeto-03`).
2. **Add file** → **Upload files**.
3. Arraste as fotos novas.
4. Renomeie cada foto para o próximo número:
   - o projeto tem `01`, `02`, `03` → a nova se chama **`04`**
   - o projeto tem `01` a `09` → a nova se chama **`10`**
5. Commite.

**A ordem das fotos é a ordem do nome.** `01` é sempre a capa.

---

## Trocar a ordem das fotos

É só mudar o **número** no nome do arquivo.

Desejo: a capa é a mesa de flores (`03.webp`).

1. Renomeie `03.webp` para `01.webp`.
2. Renomeie o antigo `01.webp` para `03.webp`.

Funciona com qualquer troca. O GitHub não deixa dois arquivos com o mesmo
nome na mesma pasta, então **troque um de cada vez** (renomeie o `03` para
`01-temp`, depois o `01` para `03`, depois o `01-temp` para `01`).

---

## Tirar uma foto

Selecione o arquivo e clique no **lixeira** que aparece. Commite.

---

## Criar um projeto novo

1. Na pasta `portfolio`, clique em **Add file** → **Create new file**.
2. Escreva o nome da pasta, por exemplo: `projeto-08`
3. Crie o arquivo `projeto-08/nao-apague-este-arquivo.txt` com qualquer
   texto dentro (o GitHub só cria arquivos, não pastas vazias).
4. Commite.
5. Entre na pasta `projeto-08` que acabou de ser criada e **Upload files**
   com as suas fotos (`01.webp`, `02.webp`, ...).
6. Commite de novo.

O novo projeto entra no site **no fim da lista**, com a numeração
recalculada sozinha. Se você quiser ele em outra posição, me avise que eu
reordeno (a ordem das pastas é o que decide).

---

## Apagar um projeto inteiro

1. Entre na pasta do projeto.
2. Apague as fotos e o `projeto.json`.
3. Saia da pasta e apague a pasta.
4. Commite.

Pode apagar sem medo: as fotos do Hero, do Sobre e do Rodapé são cópias
independentes e **não quebram**.

---

## Mudar o nome e a descrição do projeto

Abra o `projeto.json` de dentro da pasta do projeto e edite o texto:

```json
{
  "title": "Casamento Ana e Bruno",
  "category": "Casamento",
  "alts": {
    "01.webp": "Mesa do casamento com arranjos dourados",
    "02.webp": "Mesa de doces do casamento"
  }
}
```

- `title` — o nome que aparece no site.
- `category` — o tipo (Casamento, Aniversário, Chá, Formatura...).
- `alts` — a descrição de cada foto. Começa com o nome do arquivo **sem a
  extensão** e dois pontos, e o texto é o que o Google lê para acessibilidade.
  Se você apagar uma foto do `alts`, o site escreve uma descrição automática
  e continua funcionando.

Cuidado ao editar JSON: **vírgula sobrando no fim** quebra o arquivo. Se
acontecer, o site avisa o erro exato no GitHub e nada é publicado — é só
arrumar e commitar de novo.

Se você não mexer no `projeto.json`, tudo funciona do mesmo jeito: o site usa
o nome da pasta como título e cria as descrições sozinho.

---

## Sobre os arquivos de foto

| | |
|---|---|
| Formatos aceitos | `.webp`, `.jpg`, `.jpeg`, `.png` |
| Formatos que **não** funcionam | `.heic` (iPhone), `.avif` |
| Tamanho recomendado | até 300 KB por foto |
| Lado maior | até 2000 px |

**Foto de iPhone (`.heic`)?** Abra no iPhone, toque na foto → Compartilhar →
Salvar imagem. Isso já salva como `.jpg`, que funciona.

---

## O que **não** mexer

Não edite nada nesta lista — é gerado ou controlado por código:

- `src/data/gallery.generated.ts` — é gerado automaticamente
- `src/data/images.ts` — imagens do Hero, Sobre e Rodapé
- `src/components/` e `src/app/`
- `package.json`

Se você editou a pasta de projeto e o site não mudou, veja
[Resolvendo problemas](#resolvendo-problemas).

---

## Resolvendo problemas

**O site não mudou depois do commit.**
Espere 2 minutos e recarregue com `Ctrl + Shift + R` (ignora o cache).
Se persistir, veja a aba **Actions** no GitHub, na aba **Sincronizar
portfólio**: se aparecer um losango vermelho, ele explica o que está errado.

**Apareceu um erro vermelho após mexer no `projeto.json`.**
Quase sempre é vírgula sobrando ou faltando. Abra o arquivo, confira que só
tem vírgula **entre** os itens, e nunca depois do último.

**Mandei a foto e ela não aparece.**
Confira o formato (tem que ser `.jpg`/`.webp`/`.png`) e o nome (tem que
começar com número, como `05.webp`).

**A foto ficou cortada feia.**
Isso acontece quando a foto é muito horizontal e o quadro é vertical.
Me chame que eu ajusto o enquadramento daquela foto.

---

## Resumo rápido

| Quero... | O que faço |
|---|---|
| Trocar as fotos de um projeto | Substituo os arquivos dentro da pasta |
| Adicionar fotos | Subo com o próximo número (`05`, `06`...) |
| Mudar qual foto é a capa | Mudo o número do nome do arquivo |
| Adicionar um projeto | Crio a pasta nova e subo as fotos |
| Remover um projeto | Apago a pasta |
| Mudar nome/tipo do projeto | Edito o `projeto.json` |

Em todos os casos: **é só dar commit no GitHub.**
