import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { hasAccess, daysLeftInTrial, isTrialActive } from "@/lib/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package, Star, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { mudancas: { orderBy: { createdAt: "desc" }, take: 3 } },
  });
  if (!user) redirect("/login");

  const mudancasCount = await db.mudanca.count({ where: { userId: user.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user.name?.split(" ")[0] || "bem-vindo"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {isTrialActive(user)
            ? `Você tem ${daysLeftInTrial(user)} dias de trial restantes.`
            : user.plan === "PRO"
            ? "Plano PRO ativo."
            : "Plano gratuito."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mudancasCount}</p>
              <p className="text-sm text-muted-foreground">Mudanças criadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">40+</p>
              <p className="text-sm text-muted-foreground">Itens no catálogo</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground">Nota média transportadoras</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mudanças recentes</h2>
        <Link href="/app/mudancas">
          <Button variant="ghost" size="sm">
            Ver todas <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {user.mudancas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="font-semibold text-lg mb-2">Nenhuma mudança ainda</h3>
            <p className="text-muted-foreground mb-6">Crie sua primeira mudança e comece a planejar!</p>
            <Link href="/app/mudancas">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Criar mudança
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {user.mudancas.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{m.enderecoOrigem} → {m.enderecoDestino}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{m.status}</p>
                </div>
                <Link href={`/app/mudancas/${m.id}`}>
                  <Button variant="ghost" size="sm">
                    Abrir <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
