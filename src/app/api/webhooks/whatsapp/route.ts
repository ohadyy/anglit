import { NextResponse } from "next/server";

// Meta WhatsApp Cloud API webhook.
// GET: Meta sends a verification request with a token we chose; we echo the challenge when it matches.
// POST: delivery and status events. For now they are only acknowledged, so Meta does not retry them.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST() {
  return NextResponse.json({ received: true });
}
