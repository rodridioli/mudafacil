"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Truck, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PaywallGate } from "@/components/paywall/PaywallGate";
import Link from "next/link";

interface Mudanca {
  id: string;
  enderecoOrigem: string;
  enderecoDestino: string;
  status: string;
  dataDesejada: Date | null;
  itens: any[];
  cotacoes: any[];
}

interface Props {
  mudancas: Mudanca[];
  canCreate: boolean;
  plan: string;
}

export function MudancasClient({ mudancas: initial, canCreate, plan }: Props) {
  const [mudancas, setMudancas] = useState(initial);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ enderecoOrigem: "", enderecoDestino: "", dataDesejada: "" });
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/mudancas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 403) {
        toast.error("Limite atingido. Faça upgrade para criar mais mudanças.");
        return;
      }
      const data = await res.json();
      setMudancas((prev) => [data, ...prev]);
      setOpen(false);
      setForm({ enderecoOrigem: "", enderecoDestino: "", dataDesejada: "" });
      toast.success("Mudança criada!");
      router.push(`/app/mudancas/${data.id}`);
    } catch {
      toast.error("Erro ao criar mudança.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/mudancas/${id}`, { method: "DELETE" });
    setMudancas((prev) => prev.filter((m) => m.id !== id));
    toast.success("Mudança removida.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Mudanças</h1>
          <p className="text-muted-foreground mt-1">{mudancas.length} mudança{mudancas.length !== 1 ? "s" : ""} criada{mudancas.length !== 1 ? "s" : ""}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" disabled={!canCreate}>
              <Plus className="mr-2 h-4 w-4" /> Nova mudança
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova mudança</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <Label>Endereço de origem</Label>
                <Input value={form.enderecoOrigem} onChange={(e) => setForm({ ...form, enderecoOrigem: e.target.value })} placeholder="Rua das Flores, 123 — São Paulo/SP" required />
              </div>
              <div className="space-y-1">
                <Label>Endereço de destino</Label>
                <Input value={form.enderecoDestino} onChange={(e) => setForm({ ...form, enderecoDestino: e.target.value })} placeholder="Av. Paulista, 456 — São Paulo/SP" required />
              </div>
              <div className="space-y-1">
                <Label>Data desejada (opcional)</Label>
                <Input type="date" value={form.dataDesejada} onChange={(e) => setForm({ ...form, dataDesejada: e.target.value })} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                {loading ? "Criando..." : "Criar mudança"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!canCreate && (
        <PaywallGate blocked={true} title="Limite de mudanças atingido" description={`O plano gratuito permite apenas 1 mudança ativa. Faça upgrade para criar mudanças ilimitadas.`}>
          <></>
        </PaywallGate>
      )}

      {mudancas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="font-semibold text-lg mb-2">Nenhuma mudança ainda</h3>
            <p className="text-muted-foreground mb-6">Crie sua primeira mudança para começar a planejar a carga e comparar cotações.</p>
            <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Criar primeira mudança
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mudancas.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.enderecoOrigem}</p>
                  <p className="text-sm text-muted-foreground truncate">→ {m.enderecoDestino}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">{m.status}</Badge>
                    <Badge variant="outline" className="text-xs">{m.itens.length} itens</Badge>
                    <Badge variant="outline" className="text-xs">{m.cotacoes.length} cotações</Badge>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/app/mudancas/${m.id}`}>
                    <Button variant="outline" size="sm">
                      Abrir <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
