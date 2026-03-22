"use client";

import { useState, useCallback } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, RotateCcw, Package, Truck } from "lucide-react";
import { PaywallGate } from "@/components/paywall/PaywallGate";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types ---
interface ItemCatalog {
  nome: string; categoria: string; iconeUrl: string;
  larguraCm: number; alturaCm: number; profundidadeCm: number;
  pesoKg: number; volumeM3: number;
}

interface CaminhaoInfo {
  id: string; nome: string; tipo: string; capacidadeM3: number;
  capacidadeKg: number; comprimentoCm: number; larguraCm: number;
  alturaCm: number; emoji: string; cor: string;
}

interface CanvasItem extends ItemCatalog {
  uid: string; x: number; y: number;
}

interface Props {
  mudanca: { id: string; enderecoOrigem: string; enderecoDestino: string; };
  itensCatalog: ItemCatalog[];
  caminhoesCatalog: CaminhaoInfo[];
  limits: { itensPorCanvas: number | typeof Infinity; filtrosAvancados: boolean; };
  plan: string;
}

// --- Draggable catalog item ---
function CatalogItem({ item, disabled }: { item: ItemCatalog; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog:${item.nome}`,
    data: { type: "catalog", item },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border cursor-grab active:cursor-grabbing text-sm transition-colors hover:bg-accent/10 hover:border-accent/30",
        isDragging && "opacity-50",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <span className="text-xl">{item.iconeUrl}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-xs">{item.nome}</p>
        <p className="text-[10px] text-muted-foreground">{item.volumeM3.toFixed(2)}m³ · {item.pesoKg}kg</p>
      </div>
    </div>
  );
}

// --- Item on canvas ---
function CanvasItemEl({ item, onRemove }: { item: CanvasItem; onRemove: (uid: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: item.uid,
    data: { type: "canvas", item },
  });

  const SCALE = 1.2;
  const w = Math.max(40, item.larguraCm * SCALE * 0.18);
  const h = Math.max(35, item.alturaCm * SCALE * 0.18);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => { e.stopPropagation(); onRemove(item.uid); }}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: w,
        height: h,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 50 : 1,
      }}
      title={`${item.nome} — clique para remover`}
      className={cn(
        "flex items-center justify-center rounded border-2 border-primary/30 bg-primary/10 cursor-grab active:cursor-grabbing text-center select-none hover:border-destructive/50 hover:bg-destructive/10 transition-colors",
        isDragging && "opacity-70 shadow-xl"
      )}
    >
      <div>
        <div className="text-sm">{item.iconeUrl}</div>
        <div className="text-[8px] leading-tight text-primary font-medium px-0.5 truncate" style={{ maxWidth: w - 4 }}>{item.nome.split(" ")[0]}</div>
      </div>
    </div>
  );
}

// --- Drop zone (canvas) ---
function CanvasDropZone({ children, caminhao }: { children: React.ReactNode; caminhao: CaminhaoInfo | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const CANVAS_W = 560;
  const CANVAS_H = caminhao ? Math.max(180, caminhao.alturaCm * 0.4) : 300;

  return (
    <div
      ref={setNodeRef}
      style={{ width: CANVAS_W, height: CANVAS_H, backgroundColor: caminhao?.cor ?? "#F1F5F9" }}
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-colors overflow-hidden shrink-0",
        isOver ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      {!caminhao && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          ← Selecione um caminhão para começar
        </div>
      )}
      {caminhao && (
        <div className="absolute top-2 left-2 text-[10px] font-medium text-muted-foreground bg-white/70 rounded px-1.5 py-0.5">
          {caminhao.nome} — {caminhao.comprimentoCm}×{caminhao.larguraCm}cm
        </div>
      )}
      {children}
    </div>
  );
}

// --- Main ---
export function MudancaCanvas({ mudanca, itensCatalog, caminhoesCatalog, limits, plan }: Props) {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedCaminhao, setSelectedCaminhao] = useState<CaminhaoInfo | null>(null);

  const totalVolumeM3 = canvasItems.reduce((s, i) => s + i.volumeM3, 0);
  const totalPesoKg = canvasItems.reduce((s, i) => s + i.pesoKg, 0);
  const ocupacaoPercent = selectedCaminhao
    ? Math.min(100, (totalVolumeM3 / selectedCaminhao.capacidadeM3) * 100)
    : 0;
  const overCapacity = selectedCaminhao
    ? totalVolumeM3 > selectedCaminhao.capacidadeM3 || totalPesoKg > selectedCaminhao.capacidadeKg
    : false;

  const atLimit =
    limits.itensPorCanvas !== Infinity && canvasItems.length >= (limits.itensPorCanvas as number);

  const categories = [...new Set(itensCatalog.map((i) => i.categoria))];

  function handleDragEnd(event: DragEndEvent) {
    const { over, active, delta } = event;
    const data = active.data.current as { type: string; item: ItemCatalog };

    if (over?.id === "canvas") {
      if (data.type === "catalog") {
        if (atLimit) {
          toast.error(`Limite de ${limits.itensPorCanvas} itens atingido. Faça upgrade!`);
          return;
        }
        const newItem: CanvasItem = {
          ...data.item,
          uid: `${data.item.nome}-${Date.now()}`,
          x: Math.random() * 400 + 20,
          y: Math.random() * 150 + 20,
        };
        setCanvasItems((prev) => [...prev, newItem]);
      } else if (data.type === "canvas") {
        setCanvasItems((prev) =>
          prev.map((it) =>
            it.uid === active.id
              ? { ...it, x: Math.max(0, it.x + delta.x), y: Math.max(0, it.y + delta.y) }
              : it
          )
        );
      }
    }
  }

  function removeItem(uid: string) {
    setCanvasItems((prev) => prev.filter((i) => i.uid !== uid));
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold truncate">{mudanca.enderecoOrigem} → {mudanca.enderecoDestino}</h1>
          <p className="text-sm text-muted-foreground">Monte a carga arrastando os itens para o container</p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Left: Catalog */}
          <Card className="w-64 shrink-0">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" /> Catálogo de itens
                {atLimit && <Badge variant="destructive" className="text-[10px]">Limite</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {atLimit && (
                <PaywallGate blocked={true} title={`Limite de ${limits.itensPorCanvas} itens`} description="Faça upgrade para adicionar itens ilimitados.">
                  <></>
                </PaywallGate>
              )}
              <Tabs defaultValue={categories[0]}>
                <TabsList className="w-full h-7 text-xs mb-2 flex-wrap gap-1 bg-muted p-0.5">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="capitalize text-[10px] px-2 h-6">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((cat) => (
                  <TabsContent key={cat} value={cat} className="mt-0">
                    <ScrollArea className="h-64">
                      <div className="space-y-1 pr-2">
                        {itensCatalog.filter((i) => i.categoria === cat).map((item) => (
                          <CatalogItem key={item.nome} item={item} disabled={atLimit} />
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Center: Canvas */}
          <div className="flex-1 space-y-3">
            <CanvasDropZone caminhao={selectedCaminhao}>
              {canvasItems.map((item) => (
                <CanvasItemEl key={item.uid} item={item} onRemove={removeItem} />
              ))}
            </CanvasDropZone>
            <p className="text-xs text-muted-foreground text-center">
              Arraste itens do catálogo → Clique num item para remover
            </p>
          </div>

          {/* Right: Summary + Truck selector */}
          <div className="w-56 shrink-0 space-y-4">
            {/* Summary */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Resumo da carga</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Itens</span>
                  <span className="font-medium">{canvasItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-medium">{totalVolumeM3.toFixed(2)} m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Peso est.</span>
                  <span className="font-medium">{totalPesoKg.toFixed(0)} kg</span>
                </div>
                {selectedCaminhao && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Ocupação</span>
                        <span className={cn("font-bold", overCapacity ? "text-destructive" : "text-primary")}>
                          {ocupacaoPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", overCapacity ? "bg-destructive" : "bg-primary")}
                          style={{ width: `${Math.min(100, ocupacaoPercent)}%` }}
                        />
                      </div>
                    </div>
                    {overCapacity && (
                      <div className="flex items-center gap-1.5 text-destructive text-xs bg-destructive/10 rounded p-2">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Acima da capacidade!
                      </div>
                    )}
                  </>
                )}
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setCanvasItems([])}>
                  <RotateCcw className="mr-1 h-3 w-3" /> Limpar canvas
                </Button>
              </CardContent>
            </Card>

            {/* Truck selector */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-1">
                  <Truck className="h-4 w-4" /> Caminhão
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                {caminhoesCatalog.map((c) => {
                  const cap = selectedCaminhao?.id === c.id
                    ? Math.min(100, (totalVolumeM3 / c.capacidadeM3) * 100)
                    : 0;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaminhao(c)}
                      className={cn(
                        "w-full text-left rounded-lg border p-2.5 transition-colors text-sm",
                        selectedCaminhao?.id === c.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs">{c.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{c.capacidadeM3}m³ · {c.capacidadeKg}kg</p>
                        </div>
                      </div>
                      {selectedCaminhao?.id === c.id && cap > 0 && (
                        <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", cap > 100 ? "bg-destructive" : "bg-primary")}
                            style={{ width: `${Math.min(100, cap)}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
