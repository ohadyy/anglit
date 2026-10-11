// Instant push notification via ntfy.sh — no account, no API key (see
// .env.local). HTTP headers aren't reliably UTF-8-safe, so the Title stays
// plain ASCII and every Hebrew detail goes in the body instead. The phone's
// "sound" setting lives in the ntfy app itself, per-topic, not in this
// request: open the app → the topic → notification settings, and pick a
// distinct sound there.
export async function notify(title: string, lines: string[], tags = "rotating_light") {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        Title: title,
        Priority: "urgent",
        Tags: tags,
      },
      body: lines.join("\n"),
    });
  } catch (err) {
    console.error("[ntfy] notification failed:", err);
  }
}
