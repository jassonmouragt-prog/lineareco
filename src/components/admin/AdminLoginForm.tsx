"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm(): React.ReactElement {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (enviando) return;

    setEnviando(true);
    setErro("");

    try {
      const response = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: senha }),
      });

      const data = (await response.json()) as { erro?: string };

      if (!response.ok) {
        setErro(data.erro ?? "Não consegui entrar.");
        setEnviando(false);
        return;
      }

      setSenha("");
      router.replace("/admin");
      router.refresh();
    } catch {
      setErro("Sem conexão com o servidor. Tente de novo.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={entrar} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">Senha</span>
        <input
          type="password"
          name="senha"
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          className="mt-2 w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 outline-none focus:border-neutral-900"
        />
      </label>

      {erro !== "" && (
        <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-neutral-900 px-4 py-3 text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
