from typing import Dict, Any
from app.schemas.financial import FinancialProfileSchema, FinancialMetrics

class FinancialCalculator:
    @staticmethod
    def calculate_metrics(profile: FinancialProfileSchema) -> FinancialMetrics:
        # Total Monthly Income
        monthly_income = profile.salary_income + profile.other_income
        
        # Total Monthly Expenses
        monthly_expenses = (
            profile.rent_expense +
            profile.food_expense +
            profile.transport_expense +
            profile.utilities_expense +
            profile.subscriptions_expense +
            profile.other_expenses
        )
        
        monthly_surplus = monthly_income - monthly_expenses
        
        # Assets calculation
        total_liquid_cash = profile.cash_balance + profile.bank_savings + profile.emergency_fund
        total_investments = (
            profile.stocks_equity +
            profile.mutual_funds +
            profile.gold_assets +
            profile.fixed_deposits +
            profile.other_assets
        )
        total_assets = total_liquid_cash + total_investments
        
        # Debts calculation
        total_debt = (
            profile.credit_card_debt +
            profile.personal_loan +
            profile.education_loan +
            profile.home_loan +
            profile.vehicle_loan +
            profile.other_liabilities
        )
        
        # Weighted interest rate on debt
        weighted_interest_sum = (
            profile.credit_card_debt * profile.credit_card_rate +
            profile.personal_loan * profile.personal_loan_rate +
            profile.education_loan * profile.education_loan_rate +
            profile.home_loan * profile.home_loan_rate +
            profile.vehicle_loan * profile.vehicle_loan_rate
        )
        weighted_debt_rate = (weighted_interest_sum / total_debt) if total_debt > 0 else 0.0
        
        # Net Worth
        net_worth = total_assets - total_debt
        
        # Emergency Fund Coverage in Months
        # If monthly expenses > 0
        emergency_coverage_months = (
            (profile.emergency_fund + profile.bank_savings) / monthly_expenses
        ) if monthly_expenses > 0 else 0.0
        
        # Savings Rate
        savings_rate_pct = (
            (monthly_surplus / monthly_income * 100) if monthly_income > 0 else 0.0
        )
        
        # Debt to Income Ratio (Annualized / Monthly)
        debt_to_income_pct = (
            (total_debt / (monthly_income * 12) * 100) if monthly_income > 0 else 0.0
        )
        
        # Asset Allocation Percentages
        equity_total = profile.stocks_equity + (profile.mutual_funds * 0.7) # assuming 70% equity in MF
        debt_total = profile.fixed_deposits + (profile.mutual_funds * 0.3)
        gold_total = profile.gold_assets
        cash_total = total_liquid_cash
        
        portfolio_total = equity_total + debt_total + gold_total + cash_total
        if portfolio_total > 0:
            equity_pct = round((equity_total / portfolio_total) * 100, 1)
            debt_pct = round((debt_total / portfolio_total) * 100, 1)
            gold_pct = round((gold_total / portfolio_total) * 100, 1)
            cash_pct = round((cash_total / portfolio_total) * 100, 1)
        else:
            equity_pct, debt_pct, gold_pct, cash_pct = 0.0, 0.0, 0.0, 0.0
            
        return FinancialMetrics(
            net_worth=round(net_worth, 2),
            monthly_income=round(monthly_income, 2),
            monthly_expenses=round(monthly_expenses, 2),
            monthly_surplus=round(monthly_surplus, 2),
            total_investments=round(total_investments, 2),
            total_debt=round(total_debt, 2),
            total_liquid_cash=round(total_liquid_cash, 2),
            emergency_fund_coverage_months=round(emergency_coverage_months, 1),
            savings_rate_pct=round(savings_rate_pct, 1),
            debt_to_income_pct=round(debt_to_income_pct, 1),
            weighted_debt_interest_rate=round(weighted_debt_rate, 2),
            equity_allocation_pct=equity_pct,
            debt_allocation_pct=debt_pct,
            gold_allocation_pct=gold_pct,
            cash_allocation_pct=cash_pct
        )
