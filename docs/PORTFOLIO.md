# Como mexer nos projetos do portfólio

Este guia é para quem **não é da área técnica**. Não precisa instalar nada,
não precisa rodar comando nenhum. Você só mexe com pastas e fotos.

---

## Antes de tudo: acesso

O repositório é **privado**. Só quem está como colaborador consegue abrir e
alterar. Se você abriu o link e pediu senha, é porque ainda não tem acesso —
peça para ser adicionado (o dono do projeto faz isso em 1 minuto).

Depois de adicionado, entre em https://github.com/jassonmouragt-prog/lineareco

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

## Onde mexer

### Opção A — GitHub Desktop (recomendada)

Baixe o [GitHub Desktop](https://desktop.github.com) (grátis, Windows e Mac).
Com ele você mexe em pasta de verdade, no seu computador, e **consegue renomear
arquivo** — que é o que permite trocar a capa de um projeto.

O fluxo de sempre:

1. Abra o GitHub Desktop e clone o repositório (uma vez só).
2. Sempre que for mexer, clique em **Fetch origin** para baixar as novidades.
3. Altere os arquivos na pasta.
4. Escreva o que você fez no campo de mensagem.
5. Clique em **Commit to main** e depois em **Push origin**.

O site publica sozinho em uns 2 minutos.

### Opção B — direto no navegador

Funciona pelo site do GitHub, inclusive pelo celular. Serve para **adicionar,
remover e trocar fotos**. Commit: clique em **Commit changes** (botão verde).

**Limitação importante:** o navegador do GitHub **não sabe renomear arquivo**.
Então tudo que depender de renomear — principalmente *trocar qual foto é a
capa* e *mudar a ordem* — só dá para fazer pela Opção A.

| Ação | Navegador | GitHub Desktop |
|---|---|---|
| Adicionar fotos | sim | sim |
| Remover foto | sim | sim |
| Trocar foto por outra | sim | sim |
| Criar projeto novo | sim | sim |
| Apagar projeto | sim | sim |
| **Trocar a capa** | **não** | sim |
| **Mudar a ordem** | **não** | sim |

No navegador, para trocar a capa: apague as fotos da pasta, baixe-as, renomeie
no seu computador e suba de novo com os nomes na ordem desejada.

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

É só mudar o **número** no nome do arquivo. Exemplo: você quer que a mesa de
flores (`03.webp`) seja a capa.

1. Renomeie `03.webp` para `01.webp`.
2. Renomeie o antigo `01.webp` para `03.webp`.

Funciona com qualquer troca. **Só dá para fazer no GitHub Desktop** (Opção A) —
o navegador não renomeia arquivo. Se preferir evitar conflito de nomes: renomeie
o `03` para `01-temp`, o `01` para `03`, e o `01-temp` para `01`.

Pelo navegador (Opção B), apague as fotos, renomeie no seu computador e suba de
novo com os nomes na ordem certa.

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
