import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { isSubscribed, isTrialActive, daysLeftInTrial } from "@/lib/subscription";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { UpgradeButton } from "@/components/forms/UpgradeButton";
import { ManageSubscriptionButton } from "@/components/forms/ManageSubscriptionButton";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const subscribed = isSubscribed(user);
  const trialActive = isTrialActive(user);
  const daysLeft = daysLeftInTrial(user);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assinatura</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu plano e pagamento.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plano atual</CardTitle>
            <Badge className={subscribed ? "bg-primary" : trialActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}>
              {subscribed ? "PRO" : trialActive ? `TRIAL — ${daysLeft} dias` : "GRATUITO"}
            </Badge>
          </div>
          <CardDescription>
            {subscribed && user.stripeCurrentPeriodEnd
              ? `Próxima cobrança em ${new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("pt-BR")}`
              : trialActive
              ? `Trial expira em ${user.trialEndsAt?.toLocaleDateString("pt-BR")}`
              : "Faça upgrade para desbloquear todos os recursos."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribed ? (
            <ManageSubscriptionButton />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-primary p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">R$ 29,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2">
                  {["Mudanças ilimitadas", "Itens ilimitados no canvas", "Cotações ilimitadas", "Filtros avançados"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <UpgradeButton />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
