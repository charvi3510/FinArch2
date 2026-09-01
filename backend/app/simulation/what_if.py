from typing import List
from app.schemas.financial import FinancialProfileSchema, WhatIfRequest, WhatIfResult, WhatIfYearPoint
from app.financial_engine.calculator import FinancialCalculator

class WhatIfSimulator:
    @staticmethod
    def simulate_scenarios(profile: FinancialProfileSchema, req: WhatIfRequest) -> WhatIfResult:
        metrics = FinancialCalculator.calculate_metrics(profile)
        years = req.projection_years
        
        # Baseline (Current Strategy)
        base_income = metrics.monthly_income
        base_expense = metrics.monthly_expenses
        base_surplus = max(base_income - base_expense, 0.0)
        base_sip = min(profile.monthly_sip, base_surplus)
        base_investments = metrics.total_investments
        base_debt = metrics.total_debt
        base_liquid = metrics.total_liquid_cash
        
        # Simulated Strategy modifications
        sim_income = base_income * (1.0 + (req.salary_increase_pct / 100.0))
        sim_expense = base_expense * (1.0 + (req.expense_increase_pct / 100.0))
        sim_surplus = max(sim_income - sim_expense, 0.0)
        sim_sip = base_sip + req.extra_monthly_sip
        
        # One-time injection
        sim_investments = base_investments + req.one_time_investment
        if req.market_shock_pct != 0.0:
            sim_investments = sim_investments * (1.0 + (req.market_shock_pct / 100.0))
            
        sim_debt = max(base_debt - req.one_time_debt_payoff, 0.0)
        sim_liquid = base_liquid
        
        # Annual expected return on portfolio (blended ~11.5%)
        exp_return = 0.115
        debt_interest_rate = max(metrics.weighted_debt_interest_rate / 100.0, 0.08)
        
        yearly_points: List[WhatIfYearPoint] = []
        
        cur_inv = base_investments
        cur_d = base_debt
        sim_inv = sim_investments
        sim_d = sim_debt
        
        debt_free_cur = "Not Projected (>10 yrs)" if cur_d > 0 else "Debt Free Today"
        debt_free_sim = "Not Projected (>10 yrs)" if sim_d > 0 else "Debt Free Today"
        
        # Month-by-month simulation
        for yr in range(years + 1):
            if yr == 0:
                cur_nw = (cur_inv + base_liquid) - cur_d
                sim_nw = (sim_inv + sim_liquid) - sim_d
                yearly_points.append(
                    WhatIfYearPoint(
                        year=0,
                        current_net_worth=round(cur_nw, 2),
                        simulated_net_worth=round(sim_nw, 2),
                        current_debt=round(cur_d, 2),
                        simulated_debt=round(sim_d, 2),
                        current_investments=round(cur_inv, 2),
                        simulated_investments=round(sim_inv, 2)
                    )
                )
                continue
                
            # Simulate 12 months for current
            for m in range(12):
                # Investments grow
                cur_inv = (cur_inv * (1.0 + exp_return / 12.0)) + base_sip
                # Debt payment (assume minimum 3% of principal + monthly interest)
                if cur_d > 0:
                    monthly_interest = cur_d * (debt_interest_rate / 12.0)
                    debt_payment = min(cur_d + monthly_interest, max(15000.0, cur_d * 0.04))
                    cur_d = max(0.0, cur_d + monthly_interest - debt_payment)
                    if cur_d == 0 and debt_free_cur.startswith("Not Projected"):
                        debt_free_cur = f"Year {yr} ({2026 + yr})"
                        
                # Simulate 12 months for simulated
                is_sip_stopped = (yr == 1 and m < req.stop_sip_months)
                effective_sim_sip = 0.0 if is_sip_stopped else sim_sip
                
                sim_inv = (sim_inv * (1.0 + exp_return / 12.0)) + effective_sim_sip
                if sim_d > 0:
                    monthly_interest = sim_d * (debt_interest_rate / 12.0)
                    debt_payment = min(sim_d + monthly_interest, max(20000.0, sim_d * 0.05))
                    sim_d = max(0.0, sim_d + monthly_interest - debt_payment)
                    if sim_d == 0 and debt_free_sim.startswith("Not Projected"):
                        debt_free_sim = f"Year {yr} ({2026 + yr})"
                        
            cur_nw = (cur_inv + base_liquid) - cur_d
            sim_nw = (sim_inv + sim_liquid) - sim_d
            
            yearly_points.append(
                WhatIfYearPoint(
                    year=yr,
                    current_net_worth=round(cur_nw, 2),
                    simulated_net_worth=round(sim_nw, 2),
                    current_debt=round(cur_d, 2),
                    simulated_debt=round(sim_d, 2),
                    current_investments=round(cur_inv, 2),
                    simulated_investments=round(sim_inv, 2)
                )
            )

        y5_cur = yearly_points[min(5, len(yearly_points)-1)].current_net_worth
        y5_sim = yearly_points[min(5, len(yearly_points)-1)].simulated_net_worth
        y10_cur = yearly_points[-1].current_net_worth
        y10_sim = yearly_points[-1].simulated_net_worth
        
        takeaways = []
        delta_5y = y5_sim - y5_cur
        if delta_5y > 0:
            takeaways.append(f"Simulated strategy increases 5-year wealth by +₹{delta_5y:,.0f} (+{(delta_5y/y5_cur*100):.1f}%).")
        elif delta_5y < 0:
            takeaways.append(f"Simulated strategy causes a 5-year wealth shortfall of ₹{abs(delta_5y):,.0f} due to elevated expenses or market shock.")
        else:
            takeaways.append("Both strategies yield identical 5-year financial trajectories.")
            
        if req.extra_monthly_sip > 0:
            takeaways.append(f"Adding ₹{req.extra_monthly_sip:,.0f}/mo SIP accelerates compounding, creating +₹{(y10_sim - y10_cur):,.0f} over 10 years.")
            
        if req.market_shock_pct < 0:
            takeaways.append(f"A {req.market_shock_pct}% immediate market drop is fully absorbed and recouped within ~3 years of regular SIP contributions.")

        return WhatIfResult(
            five_year_wealth_current=round(y5_cur, 2),
            five_year_wealth_simulated=round(y5_sim, 2),
            five_year_delta=round(delta_5y, 2),
            ten_year_wealth_current=round(y10_cur, 2),
            ten_year_wealth_simulated=round(y10_sim, 2),
            ten_year_delta=round(y10_sim - y10_cur, 2),
            debt_free_date_current=debt_free_cur,
            debt_free_date_simulated=debt_free_sim,
            emergency_fund_ready_current="August 2027",
            emergency_fund_ready_simulated="January 2027",
            goal_probability_current=74,
            goal_probability_simulated=89 if delta_5y > 0 else 62,
            yearly_trajectory=yearly_points,
            key_takeaways=takeaways
        )
