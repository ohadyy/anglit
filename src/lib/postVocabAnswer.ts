/** Tells the server a word was known or missed, so it comes back sooner or later. Best-effort:
 * signed-out visitors get a refusal and nothing is lost, since progress is only saved for signed-in students. */
export function postVocabAnswer(wordId: string, knew: boolean) {
  fetch("/api/vocab/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wordId, knew }),
    keepalive: true,
  }).catch(() => {});
}
