import Image from "next/image";

import interNachiLogo from "@/logos/interNachi logo.png";
import nbaLogo from "@/logos/nba_logo.jpeg";
import niesvLogo from "@/logos/niesv logo.png";

type AccreditationStripProps = {
  compact?: boolean;
};

const marks = [
  { label: "InterNACHI", note: "Inspection Standards", logo: interNachiLogo },
  { label: "NIESV", note: "Valuation Standards", logo: niesvLogo },
  { label: "NBA", note: "Legal Practice", logo: nbaLogo }
] as const;

export function AccreditationStrip({ compact = false }: AccreditationStripProps) {
  return (
    <div className={`accreditation-strip ${compact ? "accreditation-strip--compact" : ""}`}>
      {marks.map((mark) => (
        <div key={mark.label} className="accreditation-mark" aria-label={mark.label}>
          <div className="accreditation-mark__logo">
            <Image src={mark.logo} alt={`${mark.label} logo`} sizes="120px" />
          </div>
          <div className="accreditation-mark__copy">
            <strong>{mark.label}</strong>
            <span>{mark.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
