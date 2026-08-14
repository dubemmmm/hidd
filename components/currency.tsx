"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import {
  formatCurrencyAmount,
  isCurrencyCode,
  supportedCurrencies,
  type CurrencyCode,
  type ExchangeRateSnapshot
} from "@/lib/currency";

type RatesStatus = "idle" | "loading" | "ready" | "error";

type CurrencyContextValue = {
  currency: CurrencyCode;
  rates: ExchangeRateSnapshot["rates"] | null;
  updatedAt: string | null;
  status: RatesStatus;
  setCurrency: (currency: CurrencyCode) => void;
  loadRates: () => Promise<void>;
};

const storageKey = "hidd-display-currency-v1";
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");
  const [snapshot, setSnapshot] = useState<ExchangeRateSnapshot | null>(null);
  const [status, setStatus] = useState<RatesStatus>("idle");
  const requestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const savedCurrency = window.localStorage.getItem(storageKey);
    if (isCurrencyCode(savedCurrency)) setCurrencyState(savedCurrency);
  }, []);

  const setCurrency = useCallback((nextCurrency: CurrencyCode) => {
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(storageKey, nextCurrency);
  }, []);

  const loadRates = useCallback(async () => {
    if (snapshot || requestRef.current) return requestRef.current ?? Promise.resolve();

    setStatus("loading");
    const request = fetch("/api/exchange-rates")
      .then(async (response) => {
        if (!response.ok) throw new Error("Exchange rates unavailable");
        const nextSnapshot = (await response.json()) as ExchangeRateSnapshot;
        setSnapshot(nextSnapshot);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      })
      .finally(() => {
        requestRef.current = null;
      });

    requestRef.current = request;
    return request;
  }, [snapshot]);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      rates: snapshot?.rates ?? null,
      updatedAt: snapshot?.updatedAt ?? null,
      status,
      setCurrency,
      loadRates
    }),
    [currency, loadRates, setCurrency, snapshot, status]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider.");
  return context;
}

export function CurrencyPrice({ amountNgn }: { amountNgn: number }) {
  const { currency, rates, status } = useCurrency();
  const rate = rates?.[currency];

  return (
    <span className="currency-price">
      <span className="currency-price__base">{formatCurrencyAmount(amountNgn, "NGN")}</span>
      {currency !== "NGN" && rate ? (
        <span className="currency-price__estimate">
          ≈ {formatCurrencyAmount(amountNgn * rate, currency)} {currency}
        </span>
      ) : null}
      {currency !== "NGN" && status === "error" ? (
        <span className="currency-price__unavailable">Conversion temporarily unavailable</span>
      ) : null}
    </span>
  );
}

export function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrency, loadRates, updatedAt } = useCurrency();

  useEffect(() => {
    void loadRates();
  }, [loadRates]);

  const updatedLabel = updatedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(new Date(updatedAt))
    : null;

  return (
    <div className={`currency-tools ${className}`.trim()}>
      <label className="currency-selector">
        <span>Currency</span>
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
          aria-label="Display service fees in"
        >
          {supportedCurrencies.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>
      {currency !== "NGN" ? (
        <p className="currency-tools__note">
          Estimate only · invoiced in NGN{updatedLabel ? ` · rate ${updatedLabel}` : ""}
        </p>
      ) : null}
    </div>
  );
}
