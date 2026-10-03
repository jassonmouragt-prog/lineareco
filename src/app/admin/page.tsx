import type { Metadata } from "next";

import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Portfólio",
  robots: { index: false, follow: false, nocache: true },
};

/** /admin — o proxy já redireciona para /admin/login quando não há sessão. */

export default function AdminPage(): React.ReactElement {
  return <AdminPanel />;
}
