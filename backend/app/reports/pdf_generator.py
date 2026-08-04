import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

class PDFReportGenerator:
    """
    ReportLab PDF Generator for EcoVerzz AI analytics reports.
    """

    @classmethod
    def generate_pdf(
        cls,
        output_filepath: str,
        analytics: dict,
        categories: list,
        top_users: list,
        chart_paths: list = None,
    ) -> str:
        doc = SimpleDocTemplate(
            output_filepath,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#10b981"),
            fontName="Helvetica-Bold",
        )

        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#64748b"),
            fontName="Helvetica",
        )

        heading_style = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0f172a"),
            fontName="Helvetica-Bold",
            spaceBefore=12,
            spaceAfter=6,
        )

        body_style = ParagraphStyle(
            "DocBody",
            parent=styles["Normal"],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#334155"),
        )

        elements = []

        # Header Block
        header_table = Table(
            [
                [
                    Paragraph("<b>ECOVERZZ AI</b><br/><font size=8 color='#64748b'>Sustainable Wealth & Analytics Engine</font>", title_style),
                    Paragraph(f"<b>Generated Date:</b><br/>{datetime.now().strftime('%b %d, %Y - %H:%M')}", subtitle_style),
                ]
            ],
            colWidths=[4.5 * inch, 2.5 * inch],
        )
        header_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ])
        )
        elements.append(header_table)
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#10b981"), spaceBefore=4, spaceAfter=15))

        # Title Block
        elements.append(Paragraph("Executive Performance & Sustainability Report", heading_style))
        elements.append(Paragraph("System-wide analysis of reports, verification pipelines, eco points, and user contributions.", body_style))
        elements.append(Spacer(1, 12))

        # Summary Cards Table
        card_data = [
            ["Total Reports", "Pending", "Verified", "Resolved", "Eco Points"],
            [
                str(analytics.get("total_reports", 0)),
                str(analytics.get("pending", 0)),
                str(analytics.get("verified", 0)),
                str(analytics.get("resolved", 0)),
                f"{analytics.get('eco_points', 0):,}",
            ],
        ]
        summary_table = Table(card_data, colWidths=[1.4 * inch] * 5)
        summary_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#f1f5f9")),
                ("TEXTCOLOR", (0, 1), (-1, 1), colors.HexColor("#10b981")),
                ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 1), (-1, 1), 11),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#0f172a")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
            ])
        )
        elements.append(summary_table)
        elements.append(Spacer(1, 16))

        # Embedded Charts Section
        if chart_paths:
            elements.append(Paragraph("Analytics Visualizations", heading_style))
            chart_images = []
            for p in chart_paths:
                if os.path.exists(p):
                    chart_images.append(Image(p, width=3.3 * inch, height=2.2 * inch))

            if len(chart_images) >= 2:
                charts_table = Table([[chart_images[0], chart_images[1]]], colWidths=[3.5 * inch, 3.5 * inch])
                charts_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER")]))
                elements.append(charts_table)
            elif len(chart_images) == 1:
                elements.append(chart_images[0])

            elements.append(Spacer(1, 16))

        # Top Categories Table
        elements.append(Paragraph("Top Report Categories", heading_style))
        cat_table_data = [["Category", "Reports Count", "Eco Points Issued"]]
        for c in categories:
            cat_table_data.append([c["category"], str(c["count"]), f"{c['eco_points']:,}"])

        cat_table = Table(cat_table_data, colWidths=[3.5 * inch, 1.75 * inch, 1.75 * inch])
        cat_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e293b")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#1e293b")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
            ])
        )
        elements.append(cat_table)
        elements.append(Spacer(1, 16))

        # Top Contributors Table
        elements.append(Paragraph("Top Contributors Leaderboard", heading_style))
        user_table_data = [["User Name", "Email", "Reports", "Eco Points"]]
        for u in top_users[:5]:
            user_table_data.append([u["user_name"], u["email"], str(u["total_reports"]), f"{u['eco_points']:,}"])

        user_table = Table(user_table_data, colWidths=[2.2 * inch, 2.8 * inch, 1.0 * inch, 1.0 * inch])
        user_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#10b981")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#10b981")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
            ])
        )
        elements.append(user_table)
        elements.append(Spacer(1, 20))

        # Footer Line
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=10, spaceAfter=10))
        footer_style = ParagraphStyle(
            "FooterStyle",
            parent=styles["Normal"],
            fontSize=9,
            textColor=colors.HexColor("#64748b"),
            alignment=1,  # Center
            fontName="Helvetica-Bold",
        )
        elements.append(Paragraph("Powered by EcoVerzz AI • Sustainable Intelligence Platform", footer_style))

        doc.build(elements)
        return output_filepath
