// WhatsApp Business Cloud API. Business-initiated messages must use a template
// that Meta has approved. Until WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID are
// set, sends are skipped and logged, so the rest of the site keeps working.

const GRAPH_VERSION = "v21.0";

export function whatsappConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

// Israeli local numbers (05x-xxxxxxx) to international format without the plus sign.
export function toInternational(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
}

export async function sendTemplate(to: string, template: string, params: string[]) {
  if (!whatsappConfigured()) {
    console.log(`[whatsapp] not configured, skipped "${template}"`);
    return;
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
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
