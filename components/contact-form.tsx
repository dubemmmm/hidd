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
    initialArea ? `I would like a risk report for ${initialArea}.` : ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const formData = new FormData(event.currentTarget);

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
          website: formData.get("website"),
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      event.currentTarget.reset();
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
          <input type="text" name="name" placeholder="Adewale Okonkwo" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label className="field">
          <span>Phone</span>
          <input type="tel" name="phone" placeholder="+234 704 819 4242" />
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
          </select>
        </label>
      </div>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about the property, the area, and the transaction timeline."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>

      <label className="field field--hidden" aria-hidden="true">
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="contact-form__footer">
        <button type="submit" className="button button--primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending enquiry..." : "Send enquiry"}
        </button>
        <p className={`form-message form-message--${status}`}>
          {status === "success" &&
            "Enquiry sent. HIDD will review the brief and respond within 24 hours."}
          {status === "error" &&
            "Something went wrong while sending your enquiry. Please try again or use the floating WhatsApp widget."}
          {status === "idle" &&
            "Your enquiry will route through a deployment-ready endpoint that can be wired to the final email provider later."}
        </p>
      </div>
    </form>
  );
}
