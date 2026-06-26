import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getInsightBySlug } from "@/lib/insights";

export const runtime = "nodejs";

const emailPattern = /\S+@\S+\.\S+/;
const storagePath = path.join("/tmp", "hidd-insight-access.ndjson");

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const payload = await request.json();

  const name = asString(payload.name);
  const email = asString(payload.email);
  const slug = asString(payload.slug);
  const website = asString(payload.website);
  const submittedAt = asString(payload.submittedAt);

  if (website) {
    return NextResponse.json({ ok: false, error: "Spam rejected." }, { status: 400 });
  }

  if (!name || !emailPattern.test(email) || !slug) {
    return NextResponse.json(
      { ok: false, error: "Name, valid email, and article are required." },
      { status: 400 }
    );
  }

  try {
    const post = await getInsightBySlug(slug);
    if (!post) {
      return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }

  await fs.appendFile(
    storagePath,
    `${JSON.stringify({
      name,
      email,
      slug,
      submittedAt
    })}\n`
  );

  return NextResponse.json({
    ok: true,
    message: "Thanks. Enjoy the full article."
  });
}
