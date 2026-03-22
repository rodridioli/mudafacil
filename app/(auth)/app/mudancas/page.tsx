import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MudancasClient } from "./MudancasClient";
import { PLAN_LIMITS } from "@/lib/constants";

export default async function MudancasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const mudancas = await db.mudanca.findMany({
    where: { userId: user.id },
    include: { caminhao: true, itens: true, cotacoes: true },
    orderBy: { createdAt: "desc" },
  });

  const limits = PLAN_LIMITS[user.plan];
  const canCreate = limits.mudancas === Infinity || mudancas.length < limits.mudancas;

  return <MudancasClient mudancas={mudancas} canCreate={canCreate} plan={user.plan} />;
}
