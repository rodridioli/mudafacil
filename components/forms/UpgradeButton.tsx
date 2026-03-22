"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Erro ao criar sessão de pagamento.");
    } catch {
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-11">
      {loading ? "Redirecionando..." : "Assinar agora — R$ 29,90/mês"}
    </Button>
  );
}
