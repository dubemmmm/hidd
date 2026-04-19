"use client";

import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/lib/site";

const AUTO_CLOSE_MS = 6000;

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;

    timeoutRef.current = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);

    function handlePointerDown(event: MouseEvent) {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [open]);

  function refreshTimeout() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (open) {
      timeoutRef.current = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    }
  }

  return (
    <div
      ref={shellRef}
      className={`floating-whatsapp ${open ? "is-open" : ""}`}
      onMouseEnter={refreshTimeout}
    >
      <button
        type="button"
        className="floating-whatsapp__toggle"
        aria-label="Open WhatsApp chat"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.76.46 3.47 1.34 4.97L2 22l5.25-1.37a9.9 9.9 0 0 0 4.79 1.22h.01c5.48 0 9.93-4.45 9.93-9.94A9.93 9.93 0 0 0 12.04 2m5.8 14.1c-.24.69-1.4 1.31-1.93 1.39-.5.08-1.13.12-1.82-.1-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.32-4.95-4.53-.15-.2-1.18-1.56-1.18-2.97s.74-2.1 1-2.39c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18 0 .41-.07.64.48.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.77 1.27 1.64 2.06 1.13 1.01 2.08 1.32 2.37 1.47.29.14.46.12.63-.07.17-.19.74-.86.94-1.16.2-.29.39-.24.66-.14.27.1 1.69.8 1.98.95.29.14.48.22.55.34.07.12.07.72-.17 1.41"
          />
        </svg>
      </button>

      <div className="floating-whatsapp__panel" aria-hidden={!open}>
        <span className="floating-whatsapp__eyebrow">WhatsApp</span>
        <strong>Chat with HIDD</strong>
        <p>Use WhatsApp for quick clarification while the main enquiry continues through the site.</p>
        <a href={siteConfig.whatsappHref} className="button button--primary" target="_blank" rel="noreferrer">
          Start conversation
        </a>
      </div>
    </div>
  );
}
