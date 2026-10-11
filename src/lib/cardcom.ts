// Cardcom LowProfile API (v11). ApiPassword isn't wired in yet — it's only
// needed for refunds and document/invoice creation, not for a normal charge
// or for checking a charge's result, so Create + GetLpResult work without it.
const BASE_URL = "https://secure.cardcom.solutions/api/v11";

function credentials() {
  const terminalNumber = Number(process.env.CARDCOM_TERMINAL_NUMBER);
  const apiName = process.env.CARDCOM_API_NAME;
  if (!terminalNumber || !apiName) {
    throw new Error("Cardcom is not configured: missing CARDCOM_TERMINAL_NUMBER or CARDCOM_API_NAME");
  }
  return { TerminalNumber: terminalNumber, ApiName: apiName };
}

type CreateLowProfileResult = {
  ResponseCode: number;
  Description: string;
  LowProfileId: string;
  Url: string;
};

export async function createLowProfile(params: {
  returnValue: string;
  amountIls: number;
  successRedirectUrl: string;
  failedRedirectUrl: string;
  webHookUrl: string;
}): Promise<CreateLowProfileResult> {
  const res = await fetch(`${BASE_URL}/LowProfile/Create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...credentials(),
      Operation: "ChargeOnly",
      ReturnValue: params.returnValue,
      Amount: params.amountIls,
      ISOCoinId: 1, // ILS
      Language: "he",
      SuccessRedirectUrl: params.successRedirectUrl,
      FailedRedirectUrl: params.failedRedirectUrl,
      WebHookUrl: params.webHookUrl,
    }),
  });
  const data = (await res.json()) as CreateLowProfileResult;
  if (data.ResponseCode !== 0) {
    throw new Error(`Cardcom LowProfile/Create failed: ${data.Description}`);
  }
  return data;
}

type LowProfileResult = {
  ResponseCode: number;
  Description: string;
  TranzactionId?: number;
  ReturnValue?: string;
  Amount?: number;
  LowProfileId: string;
};

export async function getLpResult(lowProfileId: string): Promise<LowProfileResult> {
  const res = await fetch(`${BASE_URL}/LowProfile/GetLpResult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...credentials(), LowProfileId: lowProfileId }),
  });
  return (await res.json()) as LowProfileResult;
}
