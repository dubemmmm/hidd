"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsPresentationTool } from "next-sanity/hooks";

type SanityPreviewBannerProps = {
  gateOpen?: boolean;
};

export function SanityPreviewBanner({ gateOpen = false }: SanityPreviewBannerProps) {
  const router = useRouter();
  const isPresentationTool = useIsPresentationTool();

  useEffect(() => {
    if (!isPresentationTool) return;

    const refreshInterval = window.setInterval(() => {
      router.refresh();
    }, 2000);

    return () => window.clearInterval(refreshInterval);
  }, [isPresentationTool, router]);

  if (!isPresentationTool) return null;

  return (
    <div className="preview-banner" role="status">
      <span>
        <strong>Sanity preview:</strong> unpublished district changes are visible
        {gateOpen ? " and the comparison gate is open" : ""}.
      </span>
      <a href="/api/draft-mode/disable">Exit preview</a>
    </div>
  );
}
