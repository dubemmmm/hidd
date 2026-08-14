"use client";

import { useState } from "react";
import Link from "next/link";

import { CurrencySelector, useCurrency } from "@/components/currency";
import { comprehensiveReport, services } from "@/lib/data/services";
import { formatCurrencyAmount } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics-client";

type ContactFormProps = {
  initialService?: string;
  initialArea?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ initialService = "", initialArea = "" }: ContactFormProps) {
  const { currency, rates } = useCurrency();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState(
    initialArea
      ? initialService === "area-comparison-breakdown"
        ? `I would like to request the full Area Compare breakdown for ${initialArea}.`
        : `I would like a risk report for ${initialArea}.`
      : ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          service: formData.get("service"),
          message: formData.get("message"),
          formConfirmation: formData.get("formConfirmation"),
          displayCurrency: currency,
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      trackEvent("enquiry_form_submit", {
        service: String(formData.get("service") || "not_selected"),
        has_phone: Boolean(formData.get("phone")),
        has_message: Boolean(formData.get("message"))
      });
      form.reset();
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <CurrencySelector className="currency-tools--contact" />
      <div className="form-grid">
        <label className="field">
          <span>Full Name</span>
          <input type="text" name="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" required />
        </label>
        <label className="field">
          <span>Phone</span>
          <input type="tel" name="phone" />
        </label>
        <label className="field">
          <span>Service of Interest</span>
          <select name="service" defaultValue={initialService}>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name} — {service.fee}
                {currency !== "NGN" && rates?.[currency]
                  ? ` (≈ ${formatCurrencyAmount(service.feeAmount * rates[currency], currency)} ${currency})`
                  : ""}
              </option>
            ))}
            <option value="comprehensive-report">
              {comprehensiveReport.name} — {comprehensiveReport.fee}
            </option>
            <option value="area-comparison-breakdown">Area Comparison Breakdown</option>
          </select>
        </label>
      </div>

      <input type="hidden" name="displayCurrency" value={currency} />

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>

      <div className="field--hidden" aria-hidden="true">
        <input
          type="text"
          name="formConfirmation"
          tabIndex={-1}
          autoComplete="new-password"
          data-1p-ignore
          data-lpignore="true"
        />
      </div>

      <p className="form-privacy">
        We use your details to review your enquiry, recommend the relevant service, and respond to
        you. We aim to respond within one working day. By submitting this form, you acknowledge our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <div className="contact-form__footer">
        <button type="submit" className="button button--primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending enquiry..." : "Send enquiry"}
        </button>
        {(status === "success" || status === "error") && (
          <p className={`form-message form-message--${status}`}>
            {status === "success" &&
              "Enquiry sent. HIDD will review the brief and respond within one working day."}
            {status === "error" &&
              "Something went wrong while sending your enquiry. Please try again or use the floating WhatsApp widget."}
          </p>
        )}
      </div>
    </form>
  );
}
