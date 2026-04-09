type AccreditationStripProps = {
  compact?: boolean;
};

const marks = [
  { label: "InterNACHI", note: "Inspection Standards" },
  { label: "NIESV", note: "Valuation Standards" },
  { label: "NBA", note: "Legal Practice" }
] as const;

export function AccreditationStrip({ compact = false }: AccreditationStripProps) {
  return (
    <div className={`accreditation-strip ${compact ? "accreditation-strip--compact" : ""}`}>
      {marks.map((mark) => (
        <div key={mark.label} className="accreditation-mark" aria-label={mark.label}>
          <strong>{mark.label}</strong>
          <span>{mark.note}</span>
        </div>
      ))}
    </div>
  );
}
