import { GRAPH_API } from "@/lib/graph";
import { toInternational } from "@/lib/phoneAuth";

// WhatsApp Business Cloud API. Business-initiated messages must use a template
// that Meta has approved. Until WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID are
// set, sends are skipped and logged, so the rest of the site keeps working.

function whatsappConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export async function sendTemplate(to: string, template: string, params: string[]) {
  if (!whatsappConfigured()) {
    console.log(`[whatsapp] not configured, skipped "${template}"`);
    return;
  }

  const res = await fetch(
    `${GRAPH_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toInternational(to),
        type: "template",
        template: {
          name: template,
          language: { code: "he" },
          components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text })) }],
        },
      }),
    },
  );

  if (!res.ok) console.error(`[whatsapp] "${template}" failed`, res.status, await res.text());
}
