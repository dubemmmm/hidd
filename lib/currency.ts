export const supportedCurrencies = ["NGN", "USD", "GBP", "EUR"] as const;

export type CurrencyCode = (typeof supportedCurrencies)[number];

export type ExchangeRateSnapshot = {
  base: "NGN";
  rates: Record<CurrencyCode, number>;
  updatedAt: string;
};

type ExchangeRateApiResponse = {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_utc?: string;
  time_last_update_unix?: number;
};

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && supportedCurrencies.includes(value as CurrencyCode);
}

export function formatCurrencyAmount(amount: number, currency: CurrencyCode) {
  const locales: Record<CurrencyCode, string> = {
    NGN: "en-NG",
    USD: "en-US",
    GBP: "en-GB",
    EUR: "en-IE"
  };

  return new Intl.NumberFormat(locales[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export async function getExchangeRateSnapshot(): Promise<ExchangeRateSnapshot> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY?.trim();
  const endpoint = apiKey
    ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/NGN`
    : "https://open.er-api.com/v6/latest/NGN";

  const response = await fetch(endpoint, {
    next: { revalidate: 43_200 },
    signal: AbortSignal.timeout(5_000)
  });

  if (!response.ok) {
    throw new Error(`Exchange-rate request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ExchangeRateApiResponse;
  if (payload.result !== "success" || !payload.rates) {
    throw new Error("Exchange-rate provider returned an invalid response.");
  }

  const rates = {
    NGN: 1,
    USD: payload.rates.USD,
    GBP: payload.rates.GBP,
    EUR: payload.rates.EUR
  };

  if (Object.values(rates).some((rate) => !Number.isFinite(rate) || rate <= 0)) {
    throw new Error("Exchange-rate provider omitted a supported currency.");
  }

  const updatedAt = payload.time_last_update_utc
    ? new Date(payload.time_last_update_utc).toISOString()
    : payload.time_last_update_unix
      ? new Date(payload.time_last_update_unix * 1_000).toISOString()
      : new Date().toISOString();

  return { base: "NGN", rates, updatedAt };
}
