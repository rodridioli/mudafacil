import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { daysLeftInTrial, isTrialActive, hasAccess } from "@/lib/subscription";
import { TrialBanner } from "@/components/layout/TrialBanner";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const trialActive = isTrialActive(user);
  const daysLeft = daysLeftInTrial(user);
  const access = hasAccess(user);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={{ name: user.name, email: user.email, image: user.image, plan: user.plan }} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {trialActive && <TrialBanner daysLeft={daysLeft} />}
        <main className="flex-1 overflow-auto bg-[#F8FAFC] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
