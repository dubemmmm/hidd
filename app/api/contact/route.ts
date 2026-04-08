import { NextResponse } from "next/server";

const emailPattern = /\S+@\S+\.\S+/;

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
  const website = asString(payload.website);
  const submittedAt = asString(payload.submittedAt);

  if (website) {
    return NextResponse.json({ ok: false, error: "Spam rejected" }, { status: 400 });
  }

  if (!name || !emailPattern.test(email) || !service) {
    return NextResponse.json(
      { ok: false, error: "Name, valid email, and service are required." },
      { status: 400 }
    );
  }

  const providerConfigured = Boolean(
    process.env.CONTACT_PROVIDER_URL || process.env.CONTACT_PROVIDER_TOKEN
  );

  console.info("HIDD enquiry received", {
    name,
    email,
    phone,
    service,
    message,
    submittedAt,
    mode: providerConfigured ? "provider-configured" : "simulated"
  });

  return NextResponse.json({
    ok: true,
    mode: providerConfigured ? "provider-configured" : "simulated"
  });
}
