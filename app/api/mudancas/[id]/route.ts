import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const mudanca = await db.mudanca.findFirst({
    where: { id, userId: session.user.id },
    include: {
      caminhao: true,
      itens: { include: { item: true } },
      cotacoes: { include: { transportadora: true } },
      cargaLayouts: { include: { itensPosicionados: { include: { item: true } } } },
    },
  });

  if (!mudanca) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mudanca);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.mudanca.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
