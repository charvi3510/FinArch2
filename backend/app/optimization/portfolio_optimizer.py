from typing import List, Dict, Any
from app.schemas.financial import FinancialProfileSchema, OptimizationRequest, ActionEvaluation
from app.financial_engine.calculator import FinancialCalculator

class OpportunityOptimizer:
    @staticmethod
    def optimize_opportunity(profile: FinancialProfileSchema, req: OptimizationRequest) -> Dict[str, Any]:
        metrics = FinancialCalculator.calculate_metrics(profile)
        amt = req.amount
        
        # Calculate raw attributes for 5 primary actions:
        # Actions: Pay High-Interest Debt, Invest in Diversified Equity (SIP), Build Emergency Reserve, Invest in Fixed Income, Hold Liquid Cash
        
        # Debt rate
        debt_rate = max(profile.credit_card_rate if profile.credit_card_debt > 0 else 0,
                        profile.personal_loan_rate if profile.personal_loan > 0 else 0,
                        9.0) # default baseline
        
        raw_options = [
            {
                "id": "DEBT_PAYOFF",
                "name": "Pay Down High-Interest Debt",
                "expected_return": debt_rate,
                "risk_score": 5, # Very low risk / guaranteed
                "liquidity_score": 15, # Low liquidity
                "debt_impact_score": 98,
                "goal_alignment_score": 85,
                "stability_score": 95,
                "tax_penalty": 0, # Tax free
                "fee_penalty": 0,
                "pros": "Guaranteed tax-free return equal to debt interest saved",
                "risk_label": "GUARANTEED (ZERO VOLATILITY)"
            },
            {
                "id": "EQUITY_SIP",
                "name": "Invest in Equity (Mutual Funds / SIP)",
                "expected_return": 12.5,
                "risk_score": 65,
                "liquidity_score": 75,
                "debt_impact_score": 10,
                "goal_alignment_score": 92,
                "stability_score": 60,
                "tax_penalty": 12.5, # LTCG above limit
                "fee_penalty": 0.5, # Expense ratio
                "pros": "Highest compounding growth over 5+ year horizons",
                "risk_label": "MODERATE RISK"
            },
            {
                "id": "EMERGENCY_RESERVE",
                "name": "Build Emergency Fund (Liquid)",
                "expected_return": 7.0,
                "risk_score": 10,
                "liquidity_score": 98,
                "debt_impact_score": 0,
                "goal_alignment_score": 88,
                "stability_score": 98,
                "tax_penalty": 20.0, # Slab tax
                "fee_penalty": 0.1,
                "pros": "Crucial safety buffer against unexpected life crises",
                "risk_label": "VERY LOW RISK"
            },
            {
                "id": "FIXED_INCOME",
                "name": "Invest in Fixed Income / Corporate FD / SGB",
                "expected_return": 8.0,
                "risk_score": 25,
                "liquidity_score": 50,
                "debt_impact_score": 0,
                "goal_alignment_score": 70,
                "stability_score": 85,
                "tax_penalty": 20.0,
                "fee_penalty": 0.2,
                "pros": "Stable, predictable accrual yield with capital preservation",
                "risk_label": "LOW RISK"
            },
            {
                "id": "HOLD_CASH",
                "name": "Hold Liquid Cash in Savings",
                "expected_return": 3.8,
                "risk_score": 5,
                "liquidity_score": 100,
                "debt_impact_score": 0,
                "goal_alignment_score": 40,
                "stability_score": 90,
                "tax_penalty": 10.0,
                "fee_penalty": 0.0,
                "pros": "Instant access for immediate buying opportunities",
                "risk_label": "INFLATION DRAG RISK"
            }
        ]
        
        # User dynamic weights
        w_ret = req.weight_expected_return
        w_risk = req.weight_risk_reduction
        w_liq = req.weight_liquidity
        w_debt = req.weight_debt_payoff
        w_goal = req.weight_goal_alignment
        
        scored_actions = []
        for opt in raw_options:
            # Score formula:
            # Score = w_ret * (Expected Return / 20 * 100) + w_risk * (100 - Risk Score) + w_liq * Liquidity Score + w_debt * Debt Impact + w_goal * Goal Alignment
            # Normalized
            ret_term = (opt["expected_return"] / 30.0) * 100.0
            risk_term = 100.0 - opt["risk_score"]
            liq_term = opt["liquidity_score"]
            debt_term = opt["debt_impact_score"]
            goal_term = opt["goal_alignment_score"]
            
            # Emergency fund bonus if coverage < 3 months
            if opt["id"] == "EMERGENCY_RESERVE" and metrics.emergency_fund_coverage_months < 3.0:
                goal_term += 25.0
                
            # If user has no debt, set debt_term to 0 for debt payoff and adjust
            if opt["id"] == "DEBT_PAYOFF" and metrics.total_debt == 0:
                debt_term = 0
                ret_term = 0
            
            total_raw_score = (
                w_ret * ret_term +
                w_risk * risk_term +
                w_liq * liq_term +
                w_debt * debt_term +
                w_goal * goal_term
            )
            
            # Normalize to 0-100
            final_score = min(max(total_raw_score, 5.0), 99.0)
            
            # 5-Year Projected wealth
            five_year_wealth = amt * ((1.0 + (opt["expected_return"] / 100.0)) ** 5)
            
            scored_actions.append({
                "action": opt["name"],
                "action_id": opt["id"],
                "expected_return": f"{opt['expected_return']:.1f}%",
                "expected_return_num": opt["expected_return"],
                "risk": opt["risk_label"],
                "risk_score": opt["risk_score"],
                "liquidity": f"{opt['liquidity_score']}/100",
                "goal_impact": f"{min(int(goal_term), 100)}/100",
                "five_year_wealth": round(five_year_wealth, 2),
                "wealth_delta": round(five_year_wealth - amt, 2),
                "score": round(final_score, 1),
                "pros": opt["pros"]
            })
            
        scored_actions.sort(key=lambda x: x["score"], reverse=True)
        
        # Best action
        best = scored_actions[0]
        
        return {
            "amount": amt,
            "best_action": best,
            "comparison_table": scored_actions,
            "weights_used": {
                "expected_return": w_ret,
                "risk_reduction": w_risk,
                "liquidity": w_liq,
                "debt_payoff": w_debt,
                "goal_alignment": w_goal
            },
            "formula_explanation": "Decision Score = (w_ret × Return_Norm) + (w_risk × (100 - Risk)) + (w_liq × Liquidity) + (w_debt × Debt_Impact) + (w_goal × Goal_Alignment)"
        }

    @staticmethod
    def analyze_portfolio_risk(profile: FinancialProfileSchema) -> Dict[str, Any]:
        metrics = FinancialCalculator.calculate_metrics(profile)
        
        # Allocations
        equity = profile.stocks_equity + (profile.mutual_funds * 0.7)
        debt = profile.fixed_deposits + (profile.mutual_funds * 0.3)
        gold = profile.gold_assets
        cash = profile.cash_balance + profile.bank_savings + profile.emergency_fund
        total = equity + debt + gold + cash
        
        warnings = []
        recommendations = []
        
        eq_pct = (equity / total * 100) if total > 0 else 0
        gold_pct = (gold / total * 100) if total > 0 else 0
        cash_pct = (cash / total * 100) if total > 0 else 0
        debt_pct = (debt / total * 100) if total > 0 else 0
        
        if eq_pct > 65:
            warnings.append({
                "type": "CONCENTRATION_WARNING",
                "severity": "HIGH" if eq_pct > 80 else "MEDIUM",
                "title": f"High Equity Exposure ({eq_pct:.1f}%)",
                "message": f"Your portfolio has {eq_pct:.1f}% exposure to equity assets, exposing capital to heightened market drawdowns during economic corrections."
            })
            recommendations.append("Systematically allocate future monthly surpluses toward fixed income / debt to reduce portfolio standard deviation.")
            
        if cash_pct > 35:
            warnings.append({
                "type": "CASH_DRAG_WARNING",
                "severity": "MEDIUM",
                "title": f"Excess Cash Drag ({cash_pct:.1f}%)",
                "message": f"Holding {cash_pct:.1f}% in liquid cash causes purchasing power loss against 5.5% inflation."
            })
            recommendations.append("Deploy idle cash above the 6-month emergency reserve into short-term debt funds or multi-asset funds.")
            
        if gold_pct < 5:
            warnings.append({
                "type": "UNDER_HEDGED",
                "severity": "LOW",
                "title": "Low Precious Metals Hedge (<5%)",
                "message": "A 5-10% allocation in Sovereign Gold Bonds or Gold ETFs provides non-correlated inflation hedging."
            })
            
        # Risk vs Return scatter point mapping
        risk_return_points = [
            {"asset": "Direct Stocks", "return": 14.5, "risk": 22.0, "amount": profile.stocks_equity, "color": "#38bdf8"},
            {"asset": "Mutual Funds", "return": 12.0, "risk": 16.0, "amount": profile.mutual_funds, "color": "#818cf8"},
            {"asset": "Fixed Deposits", "return": 7.2, "risk": 3.0, "amount": profile.fixed_deposits, "color": "#34d399"},
            {"asset": "Gold / SGB", "return": 9.5, "risk": 11.0, "amount": profile.gold_assets, "color": "#fbbf24"},
            {"asset": "Liquid Cash & Savings", "return": 4.0, "risk": 1.0, "amount": cash, "color": "#94a3b8"}
        ]
        
        return {
            "total_portfolio_value": round(total, 2),
            "allocations": [
                {"name": "Equity & Stocks", "value": round(equity, 2), "percentage": round(eq_pct, 1), "color": "#06b6d4"},
                {"name": "Debt & Fixed Income", "value": round(debt, 2), "percentage": round(debt_pct, 1), "color": "#10b981"},
                {"name": "Gold & Commodities", "value": round(gold, 2), "percentage": round(gold_pct, 1), "color": "#f59e0b"},
                {"name": "Cash & Liquid", "value": round(cash, 2), "percentage": round(cash_pct, 1), "color": "#6366f1"}
            ],
            "warnings": warnings,
            "recommendations": recommendations,
            "risk_return_points": risk_return_points,
            "overall_portfolio_expected_return": round((eq_pct*0.13 + debt_pct*0.075 + gold_pct*0.095 + cash_pct*0.04), 2),
            "estimated_sharpe_ratio": 1.34
        }
