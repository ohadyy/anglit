export type ActionResult = { ok: true } | { ok: false; error: string };

export const BAD_REQUEST = { ok: false, error: "משהו השתבש. כדאי לרענן את הדף ולנסות שוב." } as const satisfies ActionResult;
