import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mudancaSchema } from "@/lib/validations";
import { PLAN_LIMITS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mudancas = await db.mudanca.findMany({
    where: { userId: session.user.id },
    include: { caminhao: true, itens: { include: { item: true } }, cotacoes: { include: { transportadora: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(mudancas);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const limits = PLAN_LIMITS[user.plan];
  if (limits.mudancas !== Infinity) {
    const count = await db.mudanca.count({ where: { userId: user.id } });
    if (count >= limits.mudancas) {
      return NextResponse.json({ error: "LIMIT_REACHED", resource: "mudancas" }, { status: 403 });
    }
  }

  const body = await req.json();
  const parsed = mudancaSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const mudanca = await db.mudanca.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json(mudanca, { status: 201 });
}
