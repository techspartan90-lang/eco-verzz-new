import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from typing import Dict, Any


class PlotlyChartGenerator:
    """
    Plotly interactive chart generator producing JSON/HTML strings for Business Intelligence dashboards.
    """

    @classmethod
    def generate_waste_trend_chart_json(cls, dates: list, waste_kg: list) -> str:
        df = pd.DataFrame({"Date": dates, "Waste (kg)": waste_kg})
        fig = px.line(
            df,
            x="Date",
            y="Waste (kg)",
            title="EcoVerzz AI 30-Day Waste Generation Trend & Forecast",
            template="plotly_dark",
            markers=True,
        )
        return fig.to_json()

    @classmethod
    def generate_category_breakdown_pie_json(cls) -> str:
        labels = ["Plastic", "E-Waste", "Organic", "Paper & Glass", "Hazardous"]
        values = [45, 25, 15, 10, 5]
        fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.4)])
        fig.update_layout(title_text="Waste Category Breakdown (%)", template="plotly_dark")
        return fig.to_json()
