import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { MudancaCanvas } from "./MudancaCanvas";
import { CAMINHOES_CATALOG, ITENS_CATALOG, PLAN_LIMITS } from "@/lib/constants";

export default async function MudancaDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const mudanca = await db.mudanca.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      itens: { include: { item: true } },
      caminhao: true,
    },
  });

  if (!mudanca) notFound();

  const limits = PLAN_LIMITS[user.plan];

  return (
    <MudancaCanvas
      mudanca={mudanca as any}
      itensCatalog={ITENS_CATALOG}
      caminhoesCatalog={CAMINHOES_CATALOG}
      limits={limits}
      plan={user.plan}
    />
  );
}
