from typing import Dict, Any, List
from datetime import datetime

class MarketKnowledgeLayer:
    @staticmethod
    def get_market_benchmarks() -> Dict[str, Any]:
        return {
            "badge": "Demo Data - Simulated Market Benchmarks",
            "last_updated": datetime.utcnow().strftime("%B %d, %Y"),
            "regulatory_bodies": [
                {
                    "name": "Reserve Bank of India (RBI)",
                    "key_rate": "Repo Rate @ 6.50%",
                    "policy_stance": "Neutral",
                    "inflation_target": "4.0% (±2%)"
                },
                {
                    "name": "Securities and Exchange Board of India (SEBI)",
                    "framework": "Categorization and Rationalization of Mutual Fund Schemes",
                    "mandate": "Investor Protection & Capital Market Transparency"
                },
                {
                    "name": "Association of Mutual Funds in India (AMFI)",
                    "industry_aum": "₹66+ Lakh Crore",
                    "monthly_sip_inflows": "₹23,000+ Crore"
                }
            ],
            "benchmark_returns_history": [
                {"asset_class": "Nifty 50 (Large Cap)", "cagr_5y": 15.2, "cagr_10y": 13.8, "volatility_annual": 14.5, "risk": "Moderate-High"},
                {"asset_class": "Nifty Midcap 150", "cagr_5y": 21.4, "cagr_10y": 17.6, "volatility_annual": 19.8, "risk": "High"},
                {"asset_class": "Crisil 10Y G-Sec Debt", "cagr_5y": 6.8, "cagr_10y": 7.3, "volatility_annual": 4.1, "risk": "Low"},
                {"asset_class": "Physical Gold / SGB", "cagr_5y": 14.1, "cagr_10y": 11.2, "volatility_annual": 12.0, "risk": "Moderate"},
                {"asset_class": "Liquid Mutual Funds", "cagr_5y": 6.4, "cagr_10y": 6.6, "volatility_annual": 0.6, "risk": "Very Low"}
            ],
            "taxation_rules_reference": {
                "equity_ltcg": "12.5% on gains exceeding ₹1,25,000 / fiscal year",
                "equity_stcg": "20.0% on holding periods under 12 months",
                "debt_funds_ltcg": "Taxed at investor's marginal income tax slab rate",
                "gold_sgb_maturity": "100% Tax-Exempt if held till 8-year maturity"
            }
        }
