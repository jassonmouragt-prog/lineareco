import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false, nocache: true },
};

/** /admin/login — única rota pública dentro de /admin (o proxy deixa passar só esta). */

export default function AdminLoginPage(): React.ReactElement {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-neutral-400">
          Linear &amp; Co.
        </p>
        <h1 className="mt-3 text-2xl font-light tracking-tight text-neutral-900">Área restrita</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Entre para editar os projetos e as fotos do portfólio.
        </p>

        <AdminLoginForm />
      </div>
    </main>
  );
}
