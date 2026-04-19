import type { NavItem } from "@/lib/types";

export const siteConfig = {
  name: "HIDD Advisory",
  shortName: "HIDD",
  description:
    "Premium property risk intelligence, due diligence, valuation, and inspection services for Lagos buyers.",
  url: "https://hiddadvisory.com",
  phoneDisplay: "+234 704 819 4242",
  phoneHref: "tel:+2347048194242",
  whatsappHref: "https://wa.me/2347048194242",
  email: "info@hiddadvisory.com",
  address: "3/5 Ikoyi Crescent, Off Modupe Alakija Street, Osborne, Ikoyi, Lagos State",
  socialLinks: {
    linkedin: "https://www.linkedin.com/company/hidd-advisory",
    x: "https://x.com/hiddadvisory",
    instagram: "https://www.instagram.com/hiddadvisory"
  }
} as const;

export const navItems: NavItem[] = [
  { href: "/risk-map", label: "Risk Map" },
  { href: "/reports", label: "Reports / Library" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" }
];

export const serviceFee = "₦1,000,000";
export const comprehensiveReportFee = "Pricing confirmed at engagement";
