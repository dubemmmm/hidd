import type { NavItem } from "@/lib/types";

export const siteConfig = {
  name: "HIDD Advisory",
  shortName: "HIDD",
  description:
    "Premium property risk intelligence, due diligence, valuation, and inspection services for Lagos buyers.",
  url: "https://www.hiddadvisory.com",
  phoneDisplay: "+234 704 819 4242",
  phoneHref: "tel:+2347048194242",
  whatsappHref: "https://wa.me/2347048194242",
  email: "info@hiddadvisory.com",
  address: "3/5 Ikoyi Crescent, Off Modupe Alakija Street, Osborne, Ikoyi, Lagos State",
  socialLinks: {
    linkedin: "https://www.linkedin.com/company/hidd-advisory",
    instagram: "https://www.instagram.com/hiddadvisory"
  }
} as const;

export const navItems: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/risk-map", label: "Area Compare" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export const serviceFeeAmount = 1_000_000;
export const serviceFee = "₦1,000,000";
export const comprehensiveReportFee = "Package fee confirmed after scope review";
