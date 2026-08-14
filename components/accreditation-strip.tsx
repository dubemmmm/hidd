import Image from "next/image";

import interNachiLogo from "@/logos/interNachi logo.png";
import nbaLogo from "@/logos/nba_logo.jpeg";
import niesvLogo from "@/logos/niesv logo.png";

type AccreditationStripProps = {
  compact?: boolean;
};

const marks = [
  {
    label: "InterNACHI",
    note: "Inspection Standards",
    logo: interNachiLogo,
    href: "https://www.nachi.org/"
  },
  {
    label: "NIESV",
    note: "Valuation Standards",
    logo: niesvLogo,
    href: "https://www.niesvlagos.org/en/"
  },
  {
    label: "NBA",
    note: "Legal Practice",
    logo: nbaLogo,
    href: "http://nigerianbar.org.ng/"
  }
] as const;

export function AccreditationStrip({ compact = false }: AccreditationStripProps) {
  return (
    <div className={`accreditation-strip ${compact ? "accreditation-strip--compact" : ""}`}>
      {marks.map((mark) => (
        <a
          key={mark.label}
          href={mark.href}
          className="accreditation-mark"
          aria-label={`Visit the ${mark.label} website`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="accreditation-mark__logo">
            <Image src={mark.logo} alt={`${mark.label} logo`} sizes="120px" />
          </div>
          <div className="accreditation-mark__copy">
            <strong>{mark.label}</strong>
            <span>{mark.note}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
