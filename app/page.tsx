import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Star, ChevronRight, CheckCircle, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            🚚 <span>MudaFácil</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
          ✨ 14 dias grátis — sem cartão
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
          Arraste seus móveis,<br />
          <span className="text-primary">escolha o caminhão</span><br />
          e mude sem estresse
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Monte visualmente a carga da sua mudança com drag & drop, compare tamanhos de caminhão em tempo real e receba cotações instantâneas de transportadoras avaliadas.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14">
              Planejar minha mudança <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8 h-14">
              Ver como funciona
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">14 dias grátis · Sem cartão de crédito · Cancele quando quiser</p>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Tudo que você precisa para uma mudança tranquila</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">Do planejamento à contratação, em minutos.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🖱️", title: "Canvas interativo drag & drop", desc: "Arraste ícones de móveis para dentro do container virtual. Cada item tem dimensão proporcional real." },
              { icon: "🚛", title: "Comparador de caminhões", desc: "Compare Fiorino, HR, 3/4 e Baú com barra de ocupação em tempo real conforme você adiciona itens." },
              { icon: "💰", title: "Cotações instantâneas", desc: "Filtre transportadoras por preço, nota, data, seguro e tipo de veículo. Compare lado a lado." },
              { icon: "📦", title: "Catálogo com 40+ itens", desc: "Biblioteca categorizada com quarto, cozinha, sala, escritório e caixas com peso e volume pré-estimados." },
              { icon: "📊", title: "Resumo inteligente", desc: "Painel com volume total (m³), peso estimado, % de ocupação e alerta se estiver acima da capacidade." },
              { icon: "⭐", title: "Transportadoras avaliadas", desc: "Escolha com confiança: veja nota média, total de avaliações e histórico antes de contratar." },
            ].map((f) => (
              <Card key={f.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Preço simples e justo</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">Comece grátis, faça upgrade quando precisar.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-border">
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">GRÁTIS</div>
                <div className="text-4xl font-bold mb-1">R$ 0</div>
                <p className="text-muted-foreground mb-6">Para experimentar</p>
                <ul className="space-y-3 mb-8">
                  {["1 mudança ativa", "Até 15 itens no canvas", "3 cotações por mudança", "Catálogo básico"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Começar grátis</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent text-accent-foreground">Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-sm font-medium text-primary mb-2">PRO</div>
                <div className="text-4xl font-bold mb-1">R$ 29,90<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
                <p className="text-muted-foreground mb-6">14 dias grátis para testar</p>
                <ul className="space-y-3 mb-8">
                  {["Mudanças ilimitadas", "Itens ilimitados no canvas", "Cotações ilimitadas", "Filtros avançados", "Suporte prioritário"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-primary hover:bg-primary/90">Começar trial grátis</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-lg text-primary">🚚 MudaFácil</div>
          <p className="text-sm text-muted-foreground">© 2025 MudaFácil. Todos os direitos reservados.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacidade</a>
            <a href="#" className="hover:text-foreground">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
