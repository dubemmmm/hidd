from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
)

OUT = Path("output/pdf/sample-area-comparison-report.pdf")
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#10233F")
BLUE = colors.HexColor("#123B72")
GOLD = colors.HexColor("#C59A3A")
MUTED = colors.HexColor("#66758C")
PALE = colors.HexColor("#F3F6FA")
LINE = colors.HexColor("#DCE3EC")
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=GOLD, spaceAfter=9, uppercase=True))
styles.add(ParagraphStyle(name="TitleLarge", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=31, leading=35, textColor=NAVY, spaceAfter=14))
styles.add(ParagraphStyle(name="Subtitle", parent=styles["Normal"], fontName="Helvetica", fontSize=12, leading=18, textColor=MUTED, spaceAfter=16))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=22, leading=27, textColor=NAVY, spaceAfter=16))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=NAVY, spaceBefore=8, spaceAfter=8))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=15, textColor=MUTED, spaceAfter=10))
styles.add(ParagraphStyle(name="Smallx", parent=styles["Normal"], fontName="Helvetica", fontSize=7.5, leading=11, textColor=MUTED))
styles.add(ParagraphStyle(name="Verdict", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=BLUE, alignment=TA_CENTER, spaceAfter=10))


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(22 * mm, height - 18 * mm, width - 22 * mm, height - 18 * mm)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(NAVY)
    canvas.drawString(22 * mm, height - 14 * mm, "HIDD ADVISORY")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 22 * mm, height - 14 * mm, "DEMONSTRATION REPORT")
    canvas.line(22 * mm, 16 * mm, width - 22 * mm, 16 * mm)
    canvas.drawString(22 * mm, 11 * mm, "Illustrative content only - not professional advice")
    canvas.drawRightString(width - 22 * mm, 11 * mm, f"Page {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=22 * mm,
    rightMargin=22 * mm,
    topMargin=25 * mm,
    bottomMargin=22 * mm,
    title="Sample Area Comparison Report",
    author="HIDD Advisory",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
doc.addPageTemplates([PageTemplate(id="standard", frames=[frame], onPage=header_footer)])

story = []
story += [
    Spacer(1, 22 * mm),
    Paragraph("FLAGSHIP DEMONSTRATION", styles["Kicker"]),
    Paragraph("Sample Area<br/>Comparison Report", styles["TitleLarge"]),
    Paragraph("An illustrative example showing how HIDD can organise a side-by-side buyer review. District names and findings in this document are fictional.", styles["Subtitle"]),
    Spacer(1, 8 * mm),
]

summary = Table(
    [
        [Paragraph("RESOURCE TYPE", styles["Smallx"]), Paragraph("EDITION", styles["Smallx"]), Paragraph("VERSION", styles["Smallx"])],
        ["Comparison Report", "Demonstration Edition", "1.0"],
        [Paragraph("COVERAGE", styles["Smallx"]), Paragraph("FORMAT", styles["Smallx"]), Paragraph("STATUS", styles["Smallx"])],
        ["Illustrative District A and B", "PDF", "Sample only"],
    ],
    colWidths=[doc.width / 3] * 3,
)
summary.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE),
    ("TEXTCOLOR", (0, 1), (-1, -1), NAVY),
    ("FONTNAME", (0, 1), (-1, -1), "Helvetica-Bold"),
    ("FONTSIZE", (0, 1), (-1, -1), 9),
    ("GRID", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
]))
story += [summary, Spacer(1, 16 * mm), Paragraph("What this sample demonstrates", styles["H2x"])]
for item in [
    "A concise executive comparison for a buyer decision.",
    "Clear separation between verified evidence, analyst interpretation, and unresolved questions.",
    "A final recommendation framed as Proceed, Proceed with Conditions, or Do Not Proceed.",
]:
    story.append(Paragraph(f"- {item}", styles["Bodyx"]))

story += [PageBreak(), Paragraph("Comparison framework", styles["H1x"]), Paragraph("The example below is deliberately illustrative. It demonstrates structure rather than making claims about a real Lagos district.", styles["Bodyx"])]

comparison_data = [
    ["Assessment area", "Illustrative District A", "Illustrative District B"],
    ["Flood resilience", "Further drainage verification needed", "Preliminary position appears stronger"],
    ["Title security", "Document trail incomplete", "Document trail supplied for review"],
    ["Planning certainty", "Use confirmation outstanding", "Planning information requested"],
    ["Infrastructure", "Access pressure requires site review", "Access appears more established"],
    ["Market liquidity", "Narrower buyer pool", "Broader comparable evidence requested"],
]
comparison = Table(comparison_data, colWidths=[42 * mm, 61 * mm, 61 * mm], repeatRows=1)
comparison.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY),
    ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("BACKGROUND", (0, 1), (0, -1), PALE),
    ("TEXTCOLOR", (0, 1), (-1, -1), NAVY),
    ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("FONTNAME", (1, 1), (-1, -1), "Helvetica"),
    ("FONTSIZE", (0, 0), (-1, -1), 8),
    ("LEADING", (0, 0), (-1, -1), 11),
    ("GRID", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 9),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))
story += [comparison, Spacer(1, 12 * mm), Paragraph("Questions before reliance", styles["H2x"])]
for item in [
    "Has each source document been independently verified?",
    "Does the property-specific inspection support the district-level view?",
    "Are price differences explained by condition, title, access, or seller positioning?",
]:
    story.append(Paragraph(f"- {item}", styles["Bodyx"]))

story += [PageBreak(), Paragraph("Decision summary", styles["H1x"])]
cards = []
for title, body, colour in [
    ("PROCEED", "No material blocker identified within scope. Record normal completion items.", colors.HexColor("#E8F3EE")),
    ("PROCEED WITH CONDITIONS", "Move only after the specified verification, remediation, or pricing conditions are satisfied.", colors.HexColor("#FBF4E3")),
    ("DO NOT PROCEED", "A material issue remains unresolved or the buyer position cannot presently be justified.", colors.HexColor("#F8E9E7")),
]:
    card = Table([[Paragraph(title, styles["H2x"])], [Paragraph(body, styles["Bodyx"])]], colWidths=[doc.width])
    card.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colour),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ]))
    cards.extend([KeepTogether(card), Spacer(1, 7 * mm)])
story += cards
story += [Spacer(1, 6 * mm), Paragraph("Illustrative verdict", styles["Kicker"]), Paragraph("Proceed with Conditions", styles["Verdict"]), Paragraph("This sample verdict exists only to demonstrate report hierarchy. A real verdict would be issued only after the agreed property, document, location, and valuation work is completed by the responsible professionals.", ParagraphStyle(name="CenteredBody", parent=styles["Bodyx"], alignment=TA_CENTER))]

story += [PageBreak(), Paragraph("Method, authorship and sources", styles["H1x"])]
story += [
    Paragraph("Lead professional", styles["H2x"]),
    Paragraph("[Verified professional name] - [relevant credentials and registration details]", styles["Bodyx"]),
    Paragraph("Contributors and reviewers", styles["H2x"]),
    Paragraph("[Verified contributor name] - [role and credentials]", styles["Bodyx"]),
    Paragraph("Source examples", styles["H2x"]),
    Paragraph("Lagos State Physical Planning Permit Authority - About Planning Permit", styles["Bodyx"]),
    Paragraph("https://www.epp.lagosstate.gov.ng/Home/AboutPlanningPermit", styles["Smallx"]),
    Spacer(1, 4 * mm),
    Paragraph("Lagos State Government - Lagos Resilience Strategy", styles["Bodyx"]),
    Paragraph("https://lasbca.lagosstate.gov.ng/wp-content/uploads/2021/05/Lagos_Resilience_Strategy.pdf", styles["Smallx"]),
    Spacer(1, 10 * mm),
    Paragraph("Important limitation", styles["H2x"]),
    Paragraph("This document is a user-interface and document-design sample. It does not assess any real property, district, title, building, price, or transaction and must not be used to make a purchase decision.", styles["Bodyx"]),
]

doc.build(story)
print(OUT)
