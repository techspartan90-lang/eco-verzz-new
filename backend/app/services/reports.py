import io
import csv
from datetime import datetime

class ReportGeneratorService:
    @staticmethod
    def generate_report_data(report_type: str, user_email: str) -> dict:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        r_type = report_type.lower()

        if "portfolio" in r_type:
            return {
                "report_title": "EcoVerzz Comprehensive Portfolio Report",
                "generated_at": timestamp,
                "user_email": user_email,
                "summary": {
                    "total_portfolio_value": "$1,250,000.00",
                    "total_carbon_offset_yield": "44,200 tCO2e",
                    "esg_rating": "AAA (Top 2% Globally)",
                    "active_funds_count": 5
                },
                "holdings": [
                    {"symbol": "ECO-SOLAR", "name": "EcoVerzz Global Solar Infrastructure", "allocation": "35%", "value": "$437,500"},
                    {"symbol": "ECO-WIND", "name": "EcoVerzz Offshore Wind & Grid Trust", "allocation": "25%", "value": "$312,500"},
                    {"symbol": "ECO-WASTE", "name": "EcoVerzz Circular Waste & Recycling Index", "allocation": "20%", "value": "$250,000"},
                    {"symbol": "CARBON-YIELD", "name": "EcoVerzz Verified Carbon Credit Yield", "allocation": "15%", "value": "$187,500"},
                    {"symbol": "GREEN-HYDRO", "name": "NextGen Green Hydrogen & Storage ETF", "allocation": "5%", "value": "$62,500"}
                ]
            }
        elif "risk" in r_type:
            return {
                "report_title": "EcoVerzz Institutional Risk & Stress Testing Report",
                "generated_at": timestamp,
                "user_email": user_email,
                "risk_metrics": {
                    "sharpe_ratio": 2.42,
                    "sortino_ratio": 3.02,
                    "annual_volatility": "11.8%",
                    "max_drawdown": "8.2%",
                    "value_at_risk_95": "4.1%",
                    "portfolio_beta": 0.64
                },
                "stress_tests": [
                    {"scenario": "EU Carbon Price Spike ($150/ton)", "portfolio_impact": "+14.2% Return Gain"},
                    {"scenario": "Solar Hardware Supply Bottleneck", "portfolio_impact": "-2.1% Short-term Volatility"},
                    {"scenario": "Global Energy Transition Acceleration", "portfolio_impact": "+22.5% Outperformance"}
                ]
            }
        elif "performance" in r_type:
            return {
                "report_title": "EcoVerzz Historical Performance & Alpha Report",
                "generated_at": timestamp,
                "user_email": user_email,
                "performance_summary": {
                    "cagr_3yr": "18.4%",
                    "returns_1yr": "22.1%",
                    "alpha_over_sp500": "+3.5%",
                    "net_carbon_dividend": "$3,450 ECO"
                },
                "monthly_perf": [
                    {"month": "Jan", "return": "2.1%", "sp500_esg": "1.2%"},
                    {"month": "Feb", "return": "3.4%", "sp500_esg": "1.8%"},
                    {"month": "Mar", "return": "2.8%", "sp500_esg": "-0.4%"},
                    {"month": "Apr", "return": "4.1%", "sp500_esg": "2.1%"}
                ]
            }
        else:
            return {
                "report_title": "EcoVerzz Investment & Asset Allocation Report",
                "generated_at": timestamp,
                "user_email": user_email,
                "details": {
                    "total_invested": "$1,000,000.00",
                    "current_valuation": "$1,250,000.00",
                    "total_profit": "$250,000.00",
                    "roi": "+25.00%"
                }
            }

    @classmethod
    def export_csv(cls, report_type: str, user_email: str) -> str:
        data = cls.generate_report_data(report_type, user_email)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Report Title", data["report_title"]])
        writer.writerow(["User Email", data["user_email"]])
        writer.writerow(["Generated At", data["generated_at"]])
        writer.writerow([])

        if "holdings" in data:
            writer.writerow(["Symbol", "Fund Name", "Allocation", "Value"])
            for h in data["holdings"]:
                writer.writerow([h["symbol"], h["name"], h["allocation"], h["value"]])
        elif "risk_metrics" in data:
            writer.writerow(["Metric", "Value"])
            for k, v in data["risk_metrics"].items():
                writer.writerow([k, v])

        return output.getvalue()
