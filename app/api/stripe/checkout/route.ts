import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const checkout = await createCheckoutSession({
    userId: session.user.id,
    email: session.user.email!,
    priceId: priceId || process.env.STRIPE_PRICE_ID_PRO!,
    successUrl: `${appUrl}/settings/billing?success=true`,
    cancelUrl: `${appUrl}/settings/billing`,
  });

  return NextResponse.json({ url: checkout.url });
}
