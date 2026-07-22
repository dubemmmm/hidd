"use client";

import { useState } from "react";

import { comprehensiveReport, services } from "@/lib/data/services";

type ContactFormProps = {
  initialService?: string;
  initialArea?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ initialService = "", initialArea = "" }: ContactFormProps) {
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
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
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
              </option>
            ))}
            <option value="comprehensive-report">
              {comprehensiveReport.name} — {comprehensiveReport.fee}
            </option>
            <option value="area-comparison-breakdown">Area Comparison Breakdown</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>

      <label className="field field--hidden" aria-hidden="true">
        <span>Leave this field empty</span>
        <input
          type="text"
          name="formConfirmation"
          tabIndex={-1}
          autoComplete="new-password"
          data-1p-ignore
          data-lpignore="true"
        />
      </label>

      <div className="contact-form__footer">
        <button type="submit" className="button button--primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending enquiry..." : "Send enquiry"}
        </button>
        {(status === "success" || status === "error") && (
          <p className={`form-message form-message--${status}`}>
            {status === "success" &&
              "Enquiry sent. HIDD will review the brief and respond within 48 hours."}
            {status === "error" &&
              "Something went wrong while sending your enquiry. Please try again or use the floating WhatsApp widget."}
          </p>
        )}
      </div>
    </form>
  );
}
