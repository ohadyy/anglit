// Keeps English words in a Hebrew sentence in their own direction so punctuation does not jump around them
export function LtrWords({ text }: { text: string }) {
  const parts = text.split(/([A-Za-z](?:[A-Za-z' ]*[A-Za-z])?)/);
  return <>{parts.map((p, i) => (i % 2 ? <bdi key={i} dir="ltr">{p}</bdi> : p))}</>;
}
