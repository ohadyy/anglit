// Instant push notification via ntfy.sh — no account, no API key (see
// .env.local). HTTP headers aren't reliably UTF-8-safe, so the Title stays
// plain ASCII and every Hebrew detail goes in the body instead. The phone's
// "sound" setting lives in the ntfy app itself, per-topic, not in this
// request: open the app → the topic → notification settings, and pick a
// distinct sound there.
const ATTEMPTS = 3;

// ntfy.sh answers rate limits and outages with an error status instead of throwing,
// so the status is checked and the send retried; a lead must never go unannounced silently.
export async function notify(title: string, lines: string[], tags = "rotating_light") {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`https://ntfy.sh/${topic}`, {
        method: "POST",
        headers: {
          Title: title,
          Priority: "urgent",
          Tags: tags,
        },
        body: lines.join("\n"),
      });
      if (res.ok) return;
      console.error(`[ntfy] attempt ${attempt} got HTTP ${res.status}`);
    } catch (err) {
      console.error(`[ntfy] attempt ${attempt} failed:`, err);
    }
    if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, attempt * 1000));
  }
}

export const contactLines = (name: string | null | undefined, phone: string | null | undefined) => [
  `שם: ${name ?? "לא ידוע"}`,
  `טלפון: ${phone ?? "לא ידוע"}`,
];
