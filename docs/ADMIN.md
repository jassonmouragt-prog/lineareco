# Painel de edição do portfólio

O painel fica em `/admin` e serve para editar nome, tipo e fotos dos projetos
sem usar GitHub, terminal ou computador. Foi pensado para uso no celular.

Quem entra vê a senha; quem não entra não consegue nem chegar na tela.

## Como funciona

O painel não guarda nada. Ele escreve direto no repositório pelo GitHub:

1. Você toca em salvar no celular.
2. O painel grava `projeto.txt` e `fotos.txt` no repositório.
3. A Action `portfolio.yml` percebe o push, gera `gallery.generated.ts` e grava
   de volta.
4. A Vercel recompila e publica.

Cada alteração leva de 1 a 3 minutos para aparecer no site. Não dá para
desfazer depois de gravar.

## Configuração (uma vez só)

### 1. Senha

Rode no terminal:

```bash
npm run admin:senha -- "a senha que voce quiser"
```

Ele imprime uma linha que começa com `scrypt:`. Esse é o valor de
`ADMIN_PASSWORD_HASH`. A senha em texto puro não é gravada em lugar nenhum.

### 2. Chave de sessão

```bash
openssl rand -base64 48
```

O resultado (64 caracteres) é o `ADMIN_SESSION_SECRET`. Ele assina o cookie de
sessão. Se trocar esse valor, toda sessão aberta é invalidada.

### 3. Permissão no GitHub

Crie um token em <https://github.com/settings/personal-access-tokens/new>:

| Campo | Valor |
| --- | --- |
| Resource owner | `jassonmouragt-prog` |
| Repository access | Only select: `lineareco` |
| Contents | Read and write |

Use o **fine-grained token**, não o classic. E não use o `GITHUB_TOKEN` do
próprio repositório: push feito com ele pode não disparar a Action, e aí o site
recebe o nome novo mas continua mostrando a foto antiga.

### 4. Variáveis na Vercel

Em <https://vercel.com> → projeto `lineareco` → Settings → Environment Variables,
adicione em Production, Preview e Development:

| Nome | Valor |
| --- | --- |
| `ADMIN_PASSWORD_HASH` | saída do passo 1 |
| `ADMIN_SESSION_SECRET` | saída do passo 2 |
| `GITHUB_TOKEN` | token do passo 3 |
| `GITHUB_REPO` | `jassonmouragt-prog/lineareco` |
| `GITHUB_BRANCH` | `master` |

Depois de salvar as variáveis, reinicie o deploy em Deployments → ⋯ → Redeploy.

Nada disso vai para o Git: o repositório é público e as variáveis vivem só na
Vercel. O arquivo `.env.example` no repositório tem só os nomes, sem valores.

## O que dá para fazer

- **Renomear projeto** e mudar o tipo (Casamento, Bodas, Formatura, etc.).
- **Enviar foto** do próprio celular.
- **Trocar a capa**: a primeira foto da lista é a capa. Use as setas.
- **Apagar foto** e **apagar projeto inteiro**.
- **Criar projeto** novo.

## O que não é aceito

| Situação | O que fazer |
| --- | --- |
| Foto `.heic` do iPhone | Compartilhar → Salvar imagem → envie o `.jpg` que o iPhone cria |
| `.avif` | Converta para `.jpg` |
| Arquivo acima de 3 MB | Diminua a resolução nas configurações da câmera |
| Foto deitada muito grande | A miniatura recorta; a foto original continua íntegra |

## Manutenção

```bash
npm run portfolio       # regenera o TS localmente
npm run portfolio:test  # 22 testes do gerador
```

## Arquivos

| Caminho | Papel |
| --- | --- |
| `src/proxy.ts` | barra `/admin`; libera só login e quem tem sessão |
| `src/lib/admin/auth.ts` | senha (scrypt), cookie assinado, limite de tentativas |
| `src/lib/admin/github.ts` | leitura e escrita via API do GitHub |
| `src/lib/admin/portfolio.ts` | lê e escreve `projeto.txt` e `fotos.txt` |
| `src/app/admin/` | tela de login, painel e rotas da API |
| `scripts/admin-password.mjs` | gera o `ADMIN_PASSWORD_HASH` |

## Detalhes que valem saber

- Sessão dura 7 dias. Cookie `HttpOnly`, `Secure`, `SameSite=strict`, restrito a
  `/admin`. Encerrar a sessão é só o botão Sair.
- Comparações de senha usam `timingSafeEqual`.
- 6 tentativas erradas por IP bloqueiam por 15 minutos.
- O limite é por instância de servidor, então em horário de pico pode deixar
  passar uma ou outra tentativa a mais. É trava de segurança, não autenticação
  forte: quem souber a senha entra.
- `/admin` pede `noindex` e `robots.txt` bloqueia o caminho.
- O upload confere o cabeçalho do arquivo (JPEG/PNG/WebP) e as dimensões antes
  de gravar, para não quebrar o gerador do site depois.
