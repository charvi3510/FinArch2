from typing import List, Tuple
from app.schemas.financial import FinancialProfileSchema, ActionEvaluation
from app.financial_engine.calculator import FinancialCalculator

class SafetyValidationLayer:
    @staticmethod
    def validate_action_suitability(
        profile: FinancialProfileSchema, 
        action: ActionEvaluation
    ) -> Tuple[bool, List[str]]:
        metrics = FinancialCalculator.calculate_metrics(profile)
        warnings: List[str] = []
        is_safe = True
        
        # Rule 1: Cannot recommend aggressive direct equities or illiquid assets if emergency fund is severely deficient (< 2 months)
        if metrics.emergency_fund_coverage_months < 2.0 and action.category == "AGGRESSIVE_GROWTH":
            is_safe = False
            warnings.append(
                f"SAFETY OVERRIDE: Emergency fund coverage is only {metrics.emergency_fund_coverage_months:.1f} months. Allocating into high-volatility equities exposes you to liquidation risk during cash crunches."
            )
            
        # Rule 2: Warning if investing heavily while high-interest credit card debt (>25% APR) is unpaid
        if profile.credit_card_debt > 10000 and action.category in ["WEALTH_GROWTH", "AGGRESSIVE_GROWTH"]:
            warnings.append(
                f"FINANCIAL EFFICIENCY WARNING: You are carrying ₹{profile.credit_card_debt:,.0f} in credit card debt @ {profile.credit_card_rate}%. Debt cost outweighs the expected post-tax equity return."
            )
            
        # Rule 3: Debt to income ratio excessive (> 45%)
        if metrics.debt_to_income_pct > 45.0 and action.category not in ["DEBT_REDUCTION", "CAPITAL_PRESERVATION"]:
            warnings.append(
                f"DEBT BURDEN ALERT: Your Debt-to-Income ratio is {metrics.debt_to_income_pct:.1f}%. Increasing investment risks cash flow distress."
            )
            
        # Rule 4: Risk mismatch (Conservative investor taking aggressive growth)
        if profile.risk_tolerance == "conservative" and action.risk_level == "HIGH":
            warnings.append(
                "SUITABILITY MISMATCH: Action carries high volatility, conflicting with your conservative risk profile."
            )
            
        return is_safe, warnings
