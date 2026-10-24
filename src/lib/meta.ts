import { createHash } from "node:crypto";
import { normalizePhone } from "@/lib/phoneAuth";

const hash = (v: string) => createHash("sha256").update(v).digest("hex");

// Israeli local number (05x...) to the international digits Meta expects (9725x...)
const phoneForMeta = (raw: string) => "972" + normalizePhone(raw).replace(/^0/, "");

// Meta Conversions API, server side. Sent with the same event_id as the browser pixel so Meta
// counts one event, not two. Does nothing until META_PIXEL_ID and META_CAPI_TOKEN are set.
export async function sendCapi(opts: {
  name: "Lead" | "Purchase";
  eventId: string;
  phone?: string;
  request?: Request;
  value?: number;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return;

  const cookies = opts.request?.headers.get("cookie") ?? "";
  const cookie = (n: string) => cookies.match(new RegExp(`(?:^|; )${n}=([^;]+)`))?.[1];
  const h = opts.request?.headers;
  // A browser request carries the visitor's answer to the consent banner. No answer or "no" means no event.
  if (opts.request && cookie("anglit-consent") !== "yes") return;
  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: opts.name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: opts.eventId,
            action_source: "website",
            event_source_url: h?.get("referer") ?? undefined,
            user_data: {
              ph: opts.phone ? [hash(phoneForMeta(opts.phone))] : undefined,
              fbp: cookie("_fbp"),
              fbc: cookie("_fbc"),
              client_ip_address: h?.get("x-forwarded-for")?.split(",")[0].trim(),
              client_user_agent: h?.get("user-agent") ?? undefined,
            },
            custom_data: opts.value !== undefined ? { value: opts.value, currency: "ILS" } : undefined,
          },
        ],
      }),
    });
  } catch (err) {
    console.error("[meta capi] failed:", err);
  }
}
