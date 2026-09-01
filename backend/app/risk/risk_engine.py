from typing import Dict, Any, List
from app.schemas.financial import FinancialProfileSchema, RiskAssessment
from app.financial_engine.calculator import FinancialCalculator

class RiskEngine:
    @staticmethod
    def assess_risk(profile: FinancialProfileSchema) -> RiskAssessment:
        metrics = FinancialCalculator.calculate_metrics(profile)
        tolerance = profile.risk_tolerance.lower()
        
        # Stated tolerance score (1-100)
        stated_score = 30 if tolerance == "conservative" else (65 if tolerance == "moderate" else 90)
        
        # Actual portfolio risk score (calculated from equity exposure, debt leverage, liquidity)
        equity_pct = metrics.equity_allocation_pct
        dti = metrics.debt_to_income_pct
        emergency_months = metrics.emergency_fund_coverage_months
        
        actual_risk_score = int(
            (equity_pct * 0.55) + 
            (min(dti * 0.8, 30)) + 
            (max(0, (6.0 - emergency_months) * 4))
        )
        actual_risk_score = min(max(actual_risk_score, 10), 98)
        
        # Alignment check
        score_diff = actual_risk_score - stated_score
        if score_diff > 15:
            alignment = "AGGRESSIVE_MISMATCH"
            summary = (
                f"Your actual portfolio risk profile ({actual_risk_score}/100) is more aggressive than your stated '{profile.risk_tolerance}' risk appetite. "
                "High equity allocation combined with unpaid short-term debt elevates vulnerability during market corrections."
            )
        elif score_diff < -15:
            alignment = "CONSERVATIVE_MISMATCH"
            summary = (
                f"Your actual portfolio risk ({actual_risk_score}/100) is more conservative than your stated '{profile.risk_tolerance}' tolerance. "
                "Excessive cash holding may lag inflation over long time horizons."
            )
        else:
            alignment = "ALIGNED"
            summary = (
                f"Your financial risk exposure ({actual_risk_score}/100) aligns well with your stated '{profile.risk_tolerance}' risk profile."
            )
            
        # 6-Axis Radar Metrics (0 - 100)
        # 1. Risk Tolerance (Stated)
        # 2. Portfolio Volatility
        # 3. Liquidity Safety
        # 4. Diversification Health
        # 5. Debt Risk (Inverted: 100 is zero debt risk, 0 is dangerous debt)
        # 6. Time Horizon Alignment
        
        volatility_metric = int(min(equity_pct * 1.1, 95))
        liquidity_metric = int(min(metrics.emergency_fund_coverage_months / 6.0 * 90 + 10, 100))
        diversification_metric = int(85 if 40 <= equity_pct <= 75 and metrics.gold_allocation_pct >= 5 else 60)
        debt_risk_metric = int(max(100 - (metrics.debt_to_income_pct * 2 + (30 if profile.credit_card_debt > 0 else 0)), 15))
        horizon_metric = int(min(profile.investment_horizon_years * 12, 95))
        
        radar_metrics = {
            "Risk Tolerance": stated_score,
            "Volatility Exposure": volatility_metric,
            "Liquidity Buffer": liquidity_metric,
            "Diversification": diversification_metric,
            "Debt Safety": debt_risk_metric,
            "Time Horizon": horizon_metric
        }
        
        # Max drawdown estimate based on equity % (historical 2008 / 2020 peak-to-trough)
        max_drawdown = round((equity_pct / 100.0) * 38.0 + (metrics.gold_allocation_pct / 100.0) * -10.0, 1)
        
        # 95% Monthly Value at Risk (VaR)
        var_95 = round(metrics.total_investments * (volatility_metric / 100.0 * 0.08), 2)
        
        recs = [
            f"Maintain at least {profile.emergency_target_months} months in liquid fixed income before taking leveraged market positions.",
            "Eliminate revolving credit card debt to immediately remove the highest risk-cost liability.",
            "Rebalance once equity allocation shifts by more than ±5% from your target weight."
        ]
        
        return RiskAssessment(
            risk_tolerance=profile.risk_tolerance,
            stated_tolerance_score=stated_score,
            actual_portfolio_risk_score=actual_risk_score,
            risk_alignment=alignment,
            radar_metrics=radar_metrics,
            max_drawdown_estimate_pct=max_drawdown,
            value_at_risk_95_pct=var_95,
            summary=summary,
            recommendations=recs
        )
