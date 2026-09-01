from typing import List, Tuple
from app.schemas.financial import FinancialProfileSchema, FinancialHealthScoreBreakdown
from app.financial_engine.calculator import FinancialCalculator

class FinancialHealthEngine:
    @staticmethod
    def calculate_health_score(profile: FinancialProfileSchema) -> FinancialHealthScoreBreakdown:
        metrics = FinancialCalculator.calculate_metrics(profile)
        insights: List[str] = []
        
        # 1. Emergency Fund Score (Weight: 20%)
        # Target: 6 months (or custom target)
        target_months = max(profile.emergency_target_months, 3)
        coverage = metrics.emergency_fund_coverage_months
        if coverage >= target_months:
            emergency_score = 100
        elif coverage >= 3.0:
            emergency_score = int(60 + (coverage - 3.0) / (target_months - 3.0) * 40)
        else:
            emergency_score = int((coverage / 3.0) * 60)
        emergency_score = min(max(emergency_score, 0), 100)
        
        if emergency_score < 70:
            insights.append(f"Emergency reserve covers only {coverage:.1f} months of expenses (Target: {target_months} months). Priority should be building a safety cushion.")
        else:
            insights.append(f"Healthy emergency cushion covering {coverage:.1f} months of expenses.")

        # 2. Debt Health Score (Weight: 25%)
        # Penalizes high-interest debt heavily (CC > 20%, Personal Loan > 12%)
        total_debt = metrics.total_debt
        dti = metrics.debt_to_income_pct
        has_high_interest = (profile.credit_card_debt > 0 or profile.personal_loan > 0)
        
        if total_debt == 0:
            debt_score = 100
            insights.append("Zero debt burden. Excellent liability health.")
        else:
            base_score = 100 - min(dti * 1.5, 50)
            if profile.credit_card_debt > 0:
                base_score -= 30 # Severe penalty for revolving credit card debt @ 38%
                insights.append(f"High-interest credit card debt of ₹{profile.credit_card_debt:,.0f} @ {profile.credit_card_rate}% APR is eroding wealth.")
            if profile.personal_loan > 0:
                base_score -= 15
                insights.append(f"Personal loan of ₹{profile.personal_loan:,.0f} @ {profile.personal_loan_rate}% is higher than typical market returns.")
            debt_score = int(min(max(base_score, 10), 100))

        # 3. Savings Rate Score (Weight: 20%)
        # Ideal savings rate: 30%+
        savings_rate = metrics.savings_rate_pct
        if savings_rate >= 40.0:
            savings_score = 100
        elif savings_rate >= 20.0:
            savings_score = int(70 + (savings_rate - 20.0) / 20.0 * 30)
        elif savings_rate > 0:
            savings_score = int((savings_rate / 20.0) * 70)
        else:
            savings_score = 10
            insights.append("Monthly expenses exceed or match monthly income. Urgent cashflow optimization required.")
            
        if savings_rate >= 30:
            insights.append(f"Strong monthly savings rate of {savings_rate:.1f}% providing healthy surplus.")

        # 4. Investment Diversification Score (Weight: 15%)
        # Balanced portfolio across equity, debt, gold, cash
        equity_pct = metrics.equity_allocation_pct
        if 40 <= equity_pct <= 75 and metrics.gold_allocation_pct >= 5 and metrics.debt_allocation_pct >= 10:
            diversification_score = 90
        elif 30 <= equity_pct <= 85:
            diversification_score = 75
        elif equity_pct > 85:
            diversification_score = 55
            insights.append("Portfolio is heavily skewed towards equity (>85%), increasing market drawdown vulnerability.")
        else:
            diversification_score = 50
            insights.append("High cash drag or under-investment detected in long-term compounding assets.")

        # 5. Goal Progress Score (Weight: 10%)
        goals = profile.goals
        if not goals:
            goal_score = 65
            insights.append("No defined financial goals found. Setting targeted milestones improves wealth focus.")
        else:
            total_progress = 0
            for g in goals:
                pct = (g.current_amount / g.target_amount * 100) if g.target_amount > 0 else 0
                total_progress += min(pct, 100)
            avg_progress = total_progress / len(goals)
            goal_score = int(min(max(avg_progress, 20), 100))
            insights.append(f"Active tracking on {len(goals)} financial goals with average progress of {avg_progress:.0f}%.")

        # 6. Risk Alignment Score (Weight: 10%)
        # Stated risk vs asset allocation
        tolerance = profile.risk_tolerance.lower()
        if tolerance == "conservative":
            risk_score = 90 if equity_pct <= 40 else (60 if equity_pct <= 60 else 40)
        elif tolerance == "moderate":
            risk_score = 90 if 45 <= equity_pct <= 75 else 65
        else: # aggressive
            risk_score = 90 if equity_pct >= 65 else 70
        risk_score = int(risk_score)

        # Weighted Total Score
        overall = (
            emergency_score * 0.20 +
            debt_score * 0.25 +
            savings_score * 0.20 +
            diversification_score * 0.15 +
            goal_score * 0.10 +
            risk_score * 0.10
        )
        overall_int = int(round(overall))
        
        # Grade determination
        if overall_int >= 85:
            grade = "EXCELLENT"
        elif overall_int >= 70:
            grade = "STRONG"
        elif overall_int >= 50:
            grade = "MODERATE"
        else:
            grade = "VULNERABLE"
            
        return FinancialHealthScoreBreakdown(
            overall_score=overall_int,
            emergency_fund_score=emergency_score,
            debt_health_score=debt_score,
            savings_score=savings_score,
            diversification_score=diversification_score,
            goal_progress_score=goal_score,
            risk_alignment_score=risk_score,
            insights=insights[:4],
            score_grade=grade
        )
