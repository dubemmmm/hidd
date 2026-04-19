import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getReportAsset } from "@/lib/data/reports";

export const runtime = "nodejs";

const emailPattern = /\S+@\S+\.\S+/;
const storagePath = path.join("/tmp", "hidd-report-access.ndjson");

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const payload = await request.json();

  const name = asString(payload.name);
  const email = asString(payload.email);
  const assetSlug = asString(payload.assetSlug);
  const website = asString(payload.website);
  const submittedAt = asString(payload.submittedAt);

  if (website) {
    return NextResponse.json({ ok: false, error: "Spam rejected." }, { status: 400 });
  }

  if (!name || !emailPattern.test(email) || !assetSlug) {
    return NextResponse.json(
      { ok: false, error: "Name, valid email, and asset selection are required." },
      { status: 400 }
    );
  }

  const asset = getReportAsset(assetSlug);

  if (!asset) {
    return NextResponse.json({ ok: false, error: "Asset not found." }, { status: 404 });
  }

  await fs.appendFile(
    storagePath,
    `${JSON.stringify({
      name,
      email,
      assetSlug,
      submittedAt
    })}\n`
  );

  return NextResponse.json({
    ok: true,
    assetUrl: asset.status === "live" ? asset.assetUrl : "",
    message:
      asset.status === "live"
        ? "Access recorded. You can download the current release below."
        : "Interest recorded. HIDD will notify you when this asset is released."
  });
}
