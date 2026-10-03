# Como mexer nos projetos do portfólio

Guia para quem **não é da área técnica** e vai fazer isso **pelo celular**.
Não precisa instalar programa nenhum, não precisa rodar comando.

---

## Antes de tudo: acesso

O repositório é **privado**. Só quem está como colaborador consegue abrir. Se
você abriu o link e pediu senha, ainda não tem acesso — peça para ser adicionado.

Depois de adicionado, entre em:
**https://github.com/jassonmouragt-prog/lineareco**

---

## A regra inteira é uma

> **Uma pasta = um projeto. As fotos dentro da pasta são as fotos desse projeto.**

Tudo que você mexe está em `public/images/portfolio/`. Hoje são 7 pastas,
`projeto-01` até `projeto-07`.

Cada pasta tem este formato:

```
public/images/portfolio/projeto-01/
├── 01.webp          ← a capa do projeto
├── 02.webp
├── 03.webp
├── projeto.txt      ← o nome e o tipo do projeto
└── fotos.txt        ← a ordem das fotos
```

Quando você terminar, **o site se atualiza sozinho** em uns 2 minutos.

---

## Os dois arquivos de texto

Eles existem para serem fáceis de editar no celular. **Não têm chaves, vírgula,
aspa nem colchete** — não existe erro de digitação que estrague o site.

**`projeto.txt`** — nome e tipo:

```
nome: Casamento Ana e Bruno
tipo: Casamento
```

**`fotos.txt`** — a ordem das fotos, **uma por linha**:

```
03.webp | Mesa de flores da entrada
01.webp | Salão decorado
02.webp | Mesa de doces
```

- A **primeira linha** é a capa do projeto.
- O texto depois do `|` é a descrição da foto (o que o Google lê para
  acessibilidade). Se deixar em branco, o site escreve uma descrição sozinho.
- Para trocar a capa, **só mude a ordem das linhas**. Não precisa renomear nada.

> Linhas que começam com `#` são ignoradas — pode usar para anotar.

---

## As 5 coisas que você vai fazer

### 1. Trocar as fotos de um projeto

1. Abra a pasta do projeto no GitHub (no celular funciona normal).
2. **Add file** → **Upload files**.
3. Escolha as fotos do seu celular.
4. Renomeie cada uma para o próximo número: se já tem `01` a `03`, a nova é
   **`04`**.
5. Toque em **Commit changes** (botão verde).

Pronto. A foto entra no site sozinha.

### 2. Tirar uma foto

Toque no arquivo e depois no **lixeira** que aparece. Commit.

### 3. Trocar qual foto é a capa

Abra o `fotos.txt` e **mude a ordem das linhas**. Só isso.

Quer a `03.webp` como capa? Mova a linha dela para o topo:

```
03.webp | Mesa de flores da entrada
01.webp | Salão decorado
02.webp | Mesa de doces
```

Toque no lápis de edição, mude, e faça o commit.

### 4. Mudar o nome do projeto

Abra o `projeto.txt` e mude a palavra depois de `nome:`:

```
nome: Casamento Ana e Bruno
tipo: Casamento
```

Commit.

### 5. Criar um projeto novo

1. Em `public/images/portfolio`, toque **Add file** → **Create new file**.
2. No nome, escreva o caminho: `projeto-08/placeholder.txt`
3. Escreva qualquer coisa no conteúdo e faça o commit. Isso cria a pasta.
4. Entre na pasta `projeto-08` que acabou de aparecer e faça **Upload files**
   com as fotos (`01.webp`, `02.webp`...).
5. Crie o `projeto.txt` da mesma forma, com `nome:` e `tipo:`.
6. Commit.

O novo projeto entra no site **no fim da lista** e a numeração
(`PROJETO 01`, `PROJETO 02`...) se recalcula sozinha.

### 6. Apagar um projeto

Entre na pasta, apague as fotos e os dois `.txt`, depois apague a pasta.
Commit. Pode apagar sem medo: as fotos do Hero, do Sobre e do Rodapé são cópias
independentes e **não quebram**.

---

## Foto de iPhone dá problema

`.heic` **não funciona** e o site avisa que não conseguiu publicar (ele não
arrisca colocar uma foto quebrada no ar).

Como converter, no próprio iPhone:

> Abrir a foto → **Compartilhar** → **Salvar imagem**. Isso salva como `.jpg`,
> que funciona.

Formatos que funcionam: `.jpg`, `.jpeg`, `.webp`, `.png`.
Tamanho: até 300 KB por foto, lado maior até 2000 px.

---

## Se algo der errado

**O site não mudou depois do commit.** Espere 2 minutos e recarregue inclinando
o celular para baixo (isso ignora o cache). Se persistir, veja no GitHub a aba
**Actions** → **Sincronizar portfólio**: se aparecer um losango vermelho, ele
escreve o que deu errado.

**Apareceu um losango vermelho.** Abra o arquivo que ele apontou e confira:

| O que ele disse | O que fazer |
|---|---|
| `não é uma imagem suportada` | A foto está em `.heic`. Salve como `.jpg` no iPhone e suba de novo. |
| `não tem nenhuma foto` | A pasta ficou sem imagens. Suba ao menos uma. |
| `cita "09.webp", que não está na pasta` | O nome em `fotos.txt` está errado ou a foto não foi upada. Apague a linha, ou suba a foto. **O site publicou assim mesmo.** |
| `não está em fotos.txt` | Foto nova fora da lista. Ela entrou no fim do projeto. Abra o `fotos.txt` e acrescente a linha dela no lugar certo. |
| `caiu no nome da pasta` | O `projeto.txt` está vazio ou sem `nome:`. Reescreva a linha. |

Os dois últimos são **avisos, não erros**: o site publicou normalmente.

**A foto ficou cortada feia.** É quando a foto é muito horizontal e o quadro é
vertical. Me chame que eu ajusto o enquadramento.

---

## O que **não** mexer

- `src/data/gallery.generated.ts` — gerado automaticamente
- `src/data/images.ts` — imagens do Hero, Sobre e Rodapé
- `src/components/`, `src/app/`, `package.json`

Você nunca precisa abrir nada nessa lista.

---

## Resumo

| Quero... | Como faço |
|---|---|
| Trocar as fotos de um projeto | Substituo os arquivos na pasta |
| Adicionar fotos | Subo com o próximo número (`04`, `05`...) |
| Tirar uma foto | Apago o arquivo |
| **Trocar a capa** | **Mudo a ordem das linhas do `fotos.txt`** |
| **Mudar o nome do projeto** | **Edito a linha `nome:` do `projeto.txt`** |
| Criar um projeto | Crio a pasta e subo as fotos |
| Apagar um projeto | Apago a pasta |

Em todos os casos: **é só tocar em commit no GitHub.**
