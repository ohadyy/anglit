import type { Question } from "./questions";

// Shared by the topic banks (connectors, affixes). In every row the correct option is written
// FIRST; place() moves it by item number so the answer key is spread evenly.

export type Opts = [string, string, string, string];

function place(id: string, correctFirst: Opts): { options: Opts; answer: 0 | 1 | 2 | 3 } {
  const answer = (Number(id.replace(/\D/g, "")) * 3 + 1) % 4;
  const rest = correctFirst.slice(1);
  const options = [...rest.slice(0, answer), correctFirst[0], ...rest.slice(answer)] as Opts;
  return { options, answer: answer as 0 | 1 | 2 | 3 };
}

const row = (type: "sentence" | "restatement", id: string, stem: string, o: Opts, explanation: string, trick: string, keywords?: string[]): Question => ({
  id,
  type,
  stem,
  ...place(id, o),
  explanation,
  trick,
  ...(keywords && { keywords }),
  status: "approved",
});

export const sc = (id: string, stem: string, o: Opts, explanation: string, trick: string, keywords?: string[]) =>
  row("sentence", id, stem, o, explanation, trick, keywords);
export const rs = (id: string, stem: string, o: Opts, explanation: string, trick: string) =>
  row("restatement", id, stem, o, explanation, trick);
