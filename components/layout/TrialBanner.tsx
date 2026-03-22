"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TrialBannerProps {
  daysLeft: number;
}

export function TrialBanner({ daysLeft }: TrialBannerProps) {
  const router = useRouter();

  return (
    <div className="bg-accent text-accent-foreground px-4 py-2 flex items-center justify-between text-sm font-medium">
      <span>
        ⏳ Seu trial gratuito expira em <strong>{daysLeft} {daysLeft === 1 ? "dia" : "dias"}</strong>. Aproveite todos os recursos!
      </span>
      <Button
        size="sm"
        variant="outline"
        className="border-accent-foreground/40 text-accent-foreground hover:bg-accent-foreground/10 h-7 px-3"
        onClick={() => router.push("/settings/billing")}
      >
        Fazer upgrade
      </Button>
    </div>
  );
}
