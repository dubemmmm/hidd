import { siteConfig } from "@/lib/site";

export function MobileWhatsAppBar() {
  return (
    <div className="mobile-whatsapp-bar">
      <a href={siteConfig.whatsappHref} className="button button--whatsapp button--block" target="_blank" rel="noreferrer">
        Chat on WhatsApp
      </a>
    </div>
  );
}
