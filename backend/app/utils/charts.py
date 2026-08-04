import os
import matplotlib
matplotlib.use("Agg")  # Non-interactive background rendering
import matplotlib.pyplot as plt
import pandas as pd
from typing import Dict, List, Any

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "reports")
os.makedirs(STATIC_DIR, exist_ok=True)


class ChartGenerator:
    """
    Matplotlib chart generator creating high-res PNG plots for report PDF embedding.
    """

    @classmethod
    def generate_category_pie_chart(cls, categories_data: List[Dict[str, Any]]) -> str:
        output_path = os.path.join(STATIC_DIR, "category_pie.png")
        labels = [c["category"] for c in categories_data]
        counts = [c["count"] for c in categories_data]
        colors = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"]

        plt.figure(figsize=(6, 4), facecolor="#0f172a")
        plt.pie(
            counts,
            labels=labels,
            autopct="%1.1f%%",
            colors=colors,
            textprops={"color": "white", "fontsize": 9, "weight": "bold"},
            startangle=140,
        )
        plt.title("Category Distribution", color="white", fontsize=11, weight="bold", pad=12)
        plt.tight_layout()
        plt.savefig(output_path, dpi=200, facecolor="#0f172a", edgecolor="none")
        plt.close()
        return output_path

    @classmethod
    def generate_monthly_trend_chart(cls, monthly_data: List[Dict[str, Any]]) -> str:
        output_path = os.path.join(STATIC_DIR, "monthly_trend.png")
        months = [m["month"] for m in monthly_data]
        totals = [m["total_reports"] for m in monthly_data]
        resolved = [m["resolved_reports"] for m in monthly_data]

        plt.figure(figsize=(7, 4), facecolor="#0f172a")
        ax = plt.axes()
        ax.set_facecolor("#1e293b")

        plt.plot(months, totals, marker="o", color="#06b6d4", linewidth=2.5, label="Total Reports")
        plt.plot(months, resolved, marker="s", color="#10b981", linewidth=2.5, label="Resolved Reports")

        plt.title("Monthly Activity Trend", color="white", fontsize=11, weight="bold", pad=12)
        plt.xticks(color="white", fontsize=8)
        plt.yticks(color="white", fontsize=8)
        plt.grid(True, linestyle="--", alpha=0.3, color="#475569")
        plt.legend(facecolor="#0f172a", edgecolor="#334155", labelcolor="white", fontsize=8)

        plt.tight_layout()
        plt.savefig(output_path, dpi=200, facecolor="#0f172a", edgecolor="none")
        plt.close()
        return output_path

    @classmethod
    def generate_eco_points_chart(cls, monthly_data: List[Dict[str, Any]]) -> str:
        output_path = os.path.join(STATIC_DIR, "eco_points_trend.png")
        months = [m["month"] for m in monthly_data]
        points = [m["eco_points"] for m in monthly_data]

        plt.figure(figsize=(7, 4), facecolor="#0f172a")
        ax = plt.axes()
        ax.set_facecolor("#1e293b")

        plt.bar(months, points, color="#10b981", edgecolor="#059669", width=0.5)

        plt.title("Eco Points Issued Trend", color="white", fontsize=11, weight="bold", pad=12)
        plt.xticks(color="white", fontsize=8)
        plt.yticks(color="white", fontsize=8)
        plt.grid(True, linestyle="--", alpha=0.3, color="#475569", axis="y")

        plt.tight_layout()
        plt.savefig(output_path, dpi=200, facecolor="#0f172a", edgecolor="none")
        plt.close()
        return output_path
