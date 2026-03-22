"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Erro ao abrir portal.");
    } catch {
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handle} disabled={loading} variant="outline" className="h-11">
      {loading ? "Abrindo portal..." : "Gerenciar assinatura"}
    </Button>
  );
}
