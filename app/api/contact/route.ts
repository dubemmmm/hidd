import { NextResponse } from "next/server";

const emailPattern = /\S+@\S+\.\S+/;
const contactEmail = process.env.CONTACT_TO_EMAIL || "dapodpscwre@gmail.com";
const serviceLabels: Record<string, string> = {
  "area-comparison-breakdown": "Area Comparison Breakdown"
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json();

  const name = asString(payload.name);
  const email = asString(payload.email);
  const phone = asString(payload.phone);
  const service = asString(payload.service);
  const message = asString(payload.message);
  const formConfirmation = asString(payload.formConfirmation);
  const submittedAt = asString(payload.submittedAt);
  const serviceLabel = serviceLabels[service] ?? service;

  if (formConfirmation) {
    return NextResponse.json({ ok: false, error: "Spam rejected" }, { status: 400 });
  }

  if (!name || !emailPattern.test(email) || !service) {
    return NextResponse.json(
      { ok: false, error: "Name, valid email, and service are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.error("Contact email delivery is not configured.");
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured." },
      { status: 503 }
    );
  }

  const emailBody = [
    "A new enquiry was submitted through the HIDD Advisory website.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Service: ${serviceLabel}`,
    `Submitted: ${submittedAt || new Date().toISOString()}`,
    "",
    "Message:",
    message || "No message provided"
  ].join("\n");

  try {
    const providerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactEmail],
        reply_to: email,
        subject: `New HIDD enquiry: ${serviceLabel} — ${name}`,
        text: emailBody
      })
    });

    if (!providerResponse.ok) {
      const providerError = await providerResponse.text();
      console.error("Contact email delivery failed", providerResponse.status, providerError);
      return NextResponse.json(
        { ok: false, error: "Email delivery failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "Email delivery failed." },
      { status: 502 }
    );
  }
}
