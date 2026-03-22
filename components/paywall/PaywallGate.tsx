"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaywallGateProps {
  children: React.ReactNode;
  blocked: boolean;
  title?: string;
  description?: string;
}

export function PaywallGate({
  children,
  blocked,
  title = "Recurso PRO",
  description = "Faça upgrade para acessar este recurso sem limites.",
}: PaywallGateProps) {
  const router = useRouter();

  if (!blocked) return <>{children}</>;

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button
          onClick={() => router.push("/settings/billing")}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          Fazer upgrade para PRO — R$ 29,90/mês
        </Button>
      </CardContent>
    </Card>
  );
}
