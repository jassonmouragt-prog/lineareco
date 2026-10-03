"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminPhoto, AdminProject } from "@/lib/admin/types";

const TIPOS = ["Casamento", "Bodas", "Formatura", "Aniversário", "Celebração", "Corporativo"];

function tamanhoLegivel(bytes: number): string {
  if (bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface Falha {
  projetos: AdminProject[];
  erro: string;
}

/**
 * Busca a lista. Fica fora do componente para que o carregamento inicial (que
 * roda num efeito) e a recarga depois de salvar usem exatamente o mesmo código.
 */
async function buscarProjetos(): Promise<Falha> {
  try {
    const response = await fetch("/admin/api/portfolio", { cache: "no-store" });
    const data = (await response.json()) as { projects?: AdminProject[]; erro?: string };

    if (!response.ok) {
      return { projetos: [], erro: data.erro ?? "Não consegui carregar os projetos." };
    }

    return { projetos: data.projects ?? [], erro: "" };
  } catch {
    return { projetos: [], erro: "Sem conexão com o servidor." };
  }
}

/** Botão de reordenar. Setas funcionam melhor que arrastar em tela pequena. */
function Seta({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "cima" | "baixo";
  onClick: () => void;
  disabled: boolean;
  label: string;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border border-neutral-300 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-30"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direction === "cima" ? "M12 19V5M12 5l-6 6M12 5l6 6" : "M12 5v14M12 19l-6-6M12 19l6-6"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function Foto({
  photo,
  position,
  total,
  onMove,
  onDelete,
  busy,
}: {
  photo: AdminPhoto;
  position: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onDelete: () => void;
  busy: boolean;
}): React.ReactElement {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <li className="relative bg-white">
      {/* next/image funciona aqui porque src e um caminho relativo do proprio
          site (/public/...): nao exige configurar host remoto. O dobro dos
          pixels cobre telas de alta densidade sem aumentar o arquivo. */}
      <Image
        src={photo.src}
        alt={photo.alt || photo.file}
        width={280}
        height={280}
        loading="lazy"
        unoptimized
        className="h-36 w-full object-cover"
      />

      {position === 0 && (
        <span className="absolute left-0 top-0 bg-neutral-900 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-widest text-white">
          Capa
        </span>
      )}

      <div className="flex items-center justify-between gap-1 p-1.5">
        <span className="truncate text-[0.65rem] text-neutral-500">
          {photo.file}
          {tamanhoLegivel(photo.bytes) !== "" && ` · ${tamanhoLegivel(photo.bytes)}`}
        </span>

        <span className="flex shrink-0 gap-1">
          <Seta
            direction="cima"
            label="Mover para cima"
            disabled={busy || position === 0}
            onClick={() => onMove(position, position - 1)}
          />
          <Seta
            direction="baixo"
            label="Mover para baixo"
            disabled={busy || position === total - 1}
            onClick={() => onMove(position, position + 1)}
          />
        </span>
      </div>

      {confirmando ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 p-2">
          <p className="text-center text-xs text-neutral-700">Apagar esta foto do site?</p>
          <span className="flex gap-1">
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="border border-red-700 px-3 py-1.5 text-xs text-red-800 disabled:opacity-50"
            >
              Apagar
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600"
            >
              Cancelar
            </button>
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          disabled={busy}
          aria-label={`Apagar ${photo.file}`}
          className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center bg-white/85 text-neutral-600 disabled:opacity-40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 7h12M10 7V5h4v2m-7 0 .8 12h8.4L17 7M10.5 10.5v5m3-5v5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </li>
  );
}

function Projeto({
  projeto,
  busy,
  onSalvar,
  onMover,
  onApagarFoto,
  onEnviarFoto,
  onApagarProjeto,
}: {
  projeto: AdminProject;
  busy: boolean;
  onSalvar: (id: string, nome: string, tipo: string, order: string[]) => Promise<void>;
  onMover: (id: string, from: number, to: number) => void;
  onApagarFoto: (id: string, file: string) => Promise<void>;
  onEnviarFoto: (id: string, form: FormData) => Promise<void>;
  onApagarProjeto: (id: string, nome: string) => Promise<void>;
}): React.ReactElement {
  const [nome, setNome] = useState(projeto.nome);
  const [tipo, setTipo] = useState(projeto.tipo);
  const [ordem, setOrdem] = useState(() => projeto.photos.map((photo) => photo.file));
  const [enviando, setEnviando] = useState(false);
  const [confirmarProjeto, setConfirmarProjeto] = useState(false);
  const inputArquivo = useRef<HTMLInputElement>(null);

  // O estado local acima é inicializado a partir das props. Para sincronizar de
  // novo depois de gravar, o painel remonta o componente via key (ver `versao`),
  // em vez de um efeito que sobrescreveria o que a pessoa está digitando.
  const porArquivo = new Map(projeto.photos.map((photo) => [photo.file, photo]));
  const ordenadas: AdminPhoto[] = ordem.flatMap((file) => {
    const photo = porArquivo.get(file);
    return photo ? [photo] : [];
  });

  const mudou =
    nome !== projeto.nome ||
    tipo !== projeto.tipo ||
    ordem.join("|") !== projeto.photos.map((photo) => photo.file).join("|");

  function mover(from: number, to: number): void {
    const nova = [...ordenadas.map((photo) => photo.file)];
    const [trocada] = nova.splice(from, 1);
    nova.splice(to, 0, trocada);
    setOrdem(nova);
    onMover(projeto.id, from, to);
  }

  async function escolherArquivo(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setEnviando(true);
    try {
      const form = new FormData();
      form.append("foto", file);
      await onEnviarFoto(projeto.id, form);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 p-4">
        <p className="text-[0.65rem] uppercase tracking-widest text-neutral-400">{projeto.id}</p>

        <label className="mt-3 block">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">Nome do projeto</span>
          <input
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            maxLength={80}
            className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-base outline-none focus:border-neutral-900"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">Tipo</span>
          <select
            value={tipo}
            onChange={(event) => setTipo(event.target.value)}
            className="mt-1.5 w-full border border-neutral-300 bg-white px-3 py-2.5 text-base outline-none focus:border-neutral-900"
          >
            {[...new Set([tipo, ...TIPOS])].map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void onSalvar(projeto.id, nome, tipo, ordem)}
          disabled={!mudou || busy || nome.trim() === ""}
          className="mt-4 w-full bg-neutral-900 px-4 py-3 text-sm font-medium uppercase tracking-widest text-white disabled:opacity-35"
        >
          {busy ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs leading-relaxed text-neutral-500">
          A primeira foto é a capa e aparece primeiro no site. Use as setas para trocar a ordem.
        </p>

        {ordenadas.length === 0 ? (
          <p className="mt-3 border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-400">
            Nenhuma foto neste projeto ainda.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {ordenadas.map((photo, index) => (
              <Foto
                key={photo.file}
                photo={photo}
                position={index}
                total={ordenadas.length}
                busy={busy || enviando}
                onMove={mover}
                onDelete={() => void onApagarFoto(projeto.id, photo.file)}
              />
            ))}
          </ul>
        )}

        <input
          ref={inputArquivo}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => void escolherArquivo(event)}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputArquivo.current?.click()}
          disabled={busy || enviando}
          className="mt-3 w-full border border-neutral-900 px-4 py-3 text-sm font-medium uppercase tracking-widest text-neutral-900 disabled:opacity-35"
        >
          {enviando ? "Enviando…" : "+ Enviar foto"}
        </button>

        <p className="mt-2 text-center text-[0.65rem] text-neutral-400">
          JPG, PNG ou WebP até 3 MB. Foto HEIC do iPhone precisa ser salva como JPG.
        </p>

        {confirmarProjeto ? (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void onApagarProjeto(projeto.id, projeto.nome)}
              disabled={busy}
              className="flex-1 border border-red-700 px-3 py-2.5 text-xs uppercase tracking-widest text-red-800 disabled:opacity-50"
            >
              Apagar &ldquo;{projeto.nome}&rdquo; de vez
            </button>
            <button
              type="button"
              onClick={() => setConfirmarProjeto(false)}
              className="border border-neutral-300 px-3 py-2.5 text-xs uppercase tracking-widest text-neutral-600"
            >
              Voltar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmarProjeto(true)}
            className="mt-3 w-full text-xs uppercase tracking-widest text-neutral-400 underline underline-offset-4"
          >
            Apagar projeto inteiro
          </button>
        )}
      </div>
    </section>
  );
}

export function AdminPanel(): React.ReactElement {
  const router = useRouter();
  const [projetos, setProjetos] = useState<AdminProject[]>([]);
  const [versao, setVersao] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState(TIPOS[0] ?? "Casamento");

  // Recarrega quando as props mudarem de verdade; o guard evita gravar estado
  // de um componente já desmontado.
  useEffect(() => {
    let ativo = true;

    void buscarProjetos().then((resultado) => {
      if (!ativo) return;
      setProjetos(resultado.projetos);
      setErro(resultado.erro);
      setCarregando(false);
    });

    return () => {
      ativo = false;
    };
  }, []);

  const aplicarResultado = useCallback((resultado: Falha): void => {
    setProjetos(resultado.projetos);
    setErro(resultado.erro);
  }, []);

  async function chamar(url: string, init: RequestInit, sucesso: string): Promise<void> {
    setOcupado(true);
    setErro("");
    setMensagem("");

    try {
      const response = await fetch(url, init);
      const data = (await response.json()) as { erro?: string };

      if (!response.ok) {
        setErro(data.erro ?? "A operação não deu certo.");
        return;
      }

      setMensagem(sucesso);
      aplicarResultado(await buscarProjetos());
      // Remonta os cartões: cada campo volta com o que foi realmente gravado.
      setVersao(atual => atual + 1);
    } catch {
      setErro("Sem conexão com o servidor.");
    } finally {
      setOcupado(false);
    }
  }

  function mover(id: string, from: number, to: number): void {
    setProjetos((atuais) =>
      atuais.map((item) => {
        if (item.id !== id) return item;
        const arquivos = item.photos.map((photo) => photo.file);
        const [trocada] = arquivos.splice(from, 1);
        arquivos.splice(to, 0, trocada);
        return { ...item, photos: arquivos.flatMap((file) => item.photos.filter((photo) => photo.file === file)) };
      }),
    );
  }

  async function salvar(id: string, nome: string, tipo: string, order: string[]): Promise<void> {
    await chamar(
      `/admin/api/portfolio/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tipo, order }),
      },
      "Alterações salvas. O site atualiza em instantes.",
    );
  }

  async function apagarFoto(id: string, file: string): Promise<void> {
    await chamar(
      `/admin/api/portfolio/${id}/photos?arquivo=${encodeURIComponent(file)}`,
      { method: "DELETE" },
      "Foto removida.",
    );
  }

  async function enviarFoto(id: string, form: FormData): Promise<void> {
    await chamar(
      `/admin/api/portfolio/${id}/photos`,
      { method: "POST", body: form },
      "Foto enviada. O site atualiza em instantes.",
    );
  }

  async function apagarProjeto(id: string, nome: string): Promise<void> {
    if (!window.confirm(`Apagar "${nome}" e todas as fotos do site? Não dá para desfazer.`)) return;
    await chamar(`/admin/api/portfolio/${id}`, { method: "DELETE" }, "Projeto apagado.");
  }

  async function criarProjeto(): Promise<void> {
    const nome = novoNome.trim();
    if (nome === "") return;

    // A pasta precisa ser um nome de arquivo seguro e estável; o titulo que a
    // pessoa digitou vira o campo nome: dentro de projeto.txt.
    const base = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24);
    const id = /^[a-z0-9][a-z0-9-]*$/.test(base) ? base : `projeto-${Date.now().toString().slice(-4)}`;

    await chamar(
      "/admin/api/portfolio",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nome, tipo: novoTipo }),
      },
      "Projeto criado. Agora envie as fotos.",
    );
    setNovoNome("");
  }

  async function sair(): Promise<void> {
    await fetch("/admin/api/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-dvh bg-neutral-50 pb-24">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-neutral-400">Linear &amp; Co.</p>
            <h1 className="text-lg font-light tracking-tight text-neutral-900">Portfólio</h1>
          </div>
          <button
            type="button"
            onClick={() => void sair()}
            className="text-xs uppercase tracking-widest text-neutral-500 underline underline-offset-4"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-4 px-5 pt-5">
        {mensagem !== "" && (
          <p className="border-l-2 border-emerald-700 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {mensagem}
          </p>
        )}
        {erro !== "" && (
          <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="py-16 text-center text-sm text-neutral-400">Carregando projetos…</p>
        ) : projetos.length === 0 ? (
          <p className="border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">
            Nenhum projeto encontrado no repositório.
          </p>
        ) : (
          projetos.map((projeto) => (
            <Projeto
              key={`${projeto.id}-${versao}`}
              projeto={projeto}
              busy={ocupado}
              onSalvar={salvar}
              onMover={mover}
              onApagarFoto={apagarFoto}
              onEnviarFoto={enviarFoto}
              onApagarProjeto={apagarProjeto}
            />
          ))
        )}

        <section className="border border-dashed border-neutral-300 p-4">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Novo projeto</p>
          <input
            value={novoNome}
            onChange={(event) => setNovoNome(event.target.value)}
            placeholder="Ex.: Casamento Ana e João"
            maxLength={80}
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2.5 text-base outline-none focus:border-neutral-900"
          />
          <select
            value={novoTipo}
            onChange={(event) => setNovoTipo(event.target.value)}
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2.5 text-base outline-none focus:border-neutral-900"
          >
            {TIPOS.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void criarProjeto()}
            disabled={ocupado || novoNome.trim() === ""}
            className="mt-3 w-full border border-neutral-900 px-4 py-3 text-sm font-medium uppercase tracking-widest text-neutral-900 disabled:opacity-35"
          >
            Criar projeto
          </button>
        </section>
      </div>
    </main>
  );
}
