export const siteConfig = {
  name: "HIDD Advisory",
  shortName: "HIDD",
  description:
    "Premium property risk intelligence, due diligence, valuation, and inspection services for Lagos buyers.",
  url: "https://hiddadvisory.com",
  phoneDisplay: "+234 812 345 6789",
  phoneHref: "tel:+2348123456789",
  whatsappHref: "https://wa.me/2348123456789",
  email: "info@hidd.com",
  address: "14 Bourdillon Road, Ikoyi, Lagos",
  socialLinks: {
    linkedin: "https://www.linkedin.com/company/hidd-advisory",
    x: "https://x.com/hiddadvisory",
    instagram: "https://www.instagram.com/hiddadvisory"
  }
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" }
] as const;

export const serviceFee = "₦1,000,000";
export const comprehensiveReportFee = "₦3,500,000";
