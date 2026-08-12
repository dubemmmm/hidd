import { NextResponse } from "next/server";

import { getReportAssetForAccess } from "@/lib/reports";
import { sanityHasWriteToken, sanityWriteClient } from "@/lib/sanity.server";

export const runtime = "nodejs";

const emailPattern = /\S+@\S+\.\S+/;
function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const payload = await request.json();

  const name = asString(payload.name);
  const email = asString(payload.email);
  const assetSlug = asString(payload.assetSlug);
  const formConfirmation = asString(payload.formConfirmation);
  const submittedAt = asString(payload.submittedAt);

  if (formConfirmation) {
    return NextResponse.json({ ok: false, error: "Spam rejected." }, { status: 400 });
  }

  if (!name || !emailPattern.test(email) || !assetSlug) {
    return NextResponse.json(
      { ok: false, error: "Name, valid email, and resource selection are required." },
      { status: 400 }
    );
  }

  const asset = await getReportAssetForAccess(assetSlug);

  if (!asset) {
    return NextResponse.json({ ok: false, error: "Resource not found." }, { status: 404 });
  }

  if (asset.status === "live" && !asset.assetUrl) {
    return NextResponse.json(
      { ok: false, error: "This resource does not have a download file available yet." },
      { status: 409 }
    );
  }

  if (!sanityHasWriteToken) {
    console.error("Resource lead storage is not configured.");
    return NextResponse.json(
      { ok: false, error: "Resource access is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    await sanityWriteClient.create({
      _type: "resourceAccess",
      name,
      email,
      assetSlug,
      assetTitle: asset.title,
      requestType: asset.status === "live" ? "download" : "waitlist",
      submittedAt: submittedAt || new Date().toISOString(),
      privacyNoticeVersion: "2026-08-11"
    });
  } catch (error) {
    console.error("Unable to store resource access request.", error);
    return NextResponse.json(
      { ok: false, error: "We could not record your request. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    assetUrl: asset.status === "live" ? asset.assetUrl : "",
    message:
      asset.status === "live"
        ? "Access recorded. You can download the current release below."
        : "Interest recorded. HIDD will notify you when this resource is released."
  });
}
