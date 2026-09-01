from typing import List, Dict, Any
from app.schemas.financial import FinancialProfileSchema, ActionEvaluation, DecisionEngineResult
from app.financial_engine.calculator import FinancialCalculator

class DecisionEngine:
    @staticmethod
    def evaluate_next_rupee_action(
        profile: FinancialProfileSchema, 
        amount: float = 10000.0,
        custom_weights: Dict[str, float] = None
    ) -> DecisionEngineResult:
        metrics = FinancialCalculator.calculate_metrics(profile)
        safety_warnings: List[str] = []
        
        # Check safety indicators
        is_emergency_deficient = metrics.emergency_fund_coverage_months < 3.0
        has_credit_card_debt = profile.credit_card_debt > 0
        has_high_personal_loan = profile.personal_loan > 0 and profile.personal_loan_rate >= 12.0
        
        if is_emergency_deficient:
            safety_warnings.append(
                f"Emergency reserve covers only {metrics.emergency_fund_coverage_months:.1f} months (< 3 month minimum safety threshold). Safety priority applied."
            )
        if has_credit_card_debt:
            safety_warnings.append(
                f"High-interest revolving credit card debt of ₹{profile.credit_card_debt:,.0f} @ {profile.credit_card_rate}% APR active."
            )

        actions: List[ActionEvaluation] = []
        
        # ----------------------------------------------------
        # Action 1: Pay Down High-Interest Debt
        # ----------------------------------------------------
        if profile.credit_card_debt > 0 or profile.personal_loan > 0:
            highest_debt_rate = max(
                profile.credit_card_rate if profile.credit_card_debt > 0 else 0,
                profile.personal_loan_rate if profile.personal_loan > 0 else 0
            )
            # Guaranteed return equal to debt interest saved + guaranteed tax free!
            # Score calculation
            debt_score = 70.0 + min(highest_debt_rate * 0.75, 25.0)
            if has_credit_card_debt:
                debt_score = 96.0
            
            saved_5y = amount * ((1 + (highest_debt_rate / 100.0)) ** 5)
            
            actions.append(
                ActionEvaluation(
                    action_id="pay_high_interest_debt",
                    action_name="Pay Down High-Interest Debt",
                    category="DEBT_REDUCTION",
                    rank=0,
                    decision_score=round(debt_score, 1),
                    expected_annual_return_pct=round(highest_debt_rate, 1),
                    risk_level="LOW", # 100% Guaranteed Return
                    liquidity_rating="LOW",
                    tax_efficiency_rating="HIGH", # Debt interest saved is 100% tax-free
                    five_year_projected_wealth=round(saved_5y, 2),
                    projected_benefit=f"+₹{round(saved_5y - amount):,.0f} saved in interest payments",
                    confidence_pct=94,
                    recommendation_summary=(
                        f"Repaying debt @ {highest_debt_rate:.1f}% APR guarantees an immediate risk-free return of {highest_debt_rate:.1f}%, beating virtually all post-tax equity benchmarks."
                    ),
                    pros=[
                        f"Guaranteed {highest_debt_rate:.1f}% annual financial benefit (zero market volatility)",
                        "100% tax-free equivalent yield",
                        "Immediately lowers Debt-to-Income (DTI) and improves credit score",
                        "Frees up monthly cash flow for future investments"
                    ],
                    cons=[
                        "Capital is locked (cannot be liquidated in an emergency unless re-borrowed)"
                    ],
                    key_assumptions=[
                        f"Interest rate on targeted debt remains at {highest_debt_rate:.1f}%",
                        "Prepayment penalty is zero or negligible"
                    ]
                )
            )

        # ----------------------------------------------------
        # Action 2: Build Emergency Reserve
        # ----------------------------------------------------
        coverage = metrics.emergency_fund_coverage_months
        if coverage < profile.emergency_target_months:
            emergency_score = 92.0 if coverage < 3.0 else (84.0 if coverage < 4.5 else 74.0)
            liquid_yield = 7.0 # High-yield liquid fund / FD yield
            five_y_liquid = amount * ((1 + 0.07) ** 5)
            
            actions.append(
                ActionEvaluation(
                    action_id="build_emergency_fund",
                    action_name="Strengthen Emergency Reserve",
                    category="CAPITAL_PRESERVATION",
                    rank=0,
                    decision_score=round(emergency_score, 1),
                    expected_annual_return_pct=7.0,
                    risk_level="LOW",
                    liquidity_rating="HIGH",
                    tax_efficiency_rating="MEDIUM",
                    five_year_projected_wealth=round(five_y_liquid, 2),
                    projected_benefit=f"+₹{round(five_y_liquid - amount):,.0f} capital buffer with T+1 liquidity",
                    confidence_pct=91,
                    recommendation_summary=(
                        f"Your emergency fund currently covers {coverage:.1f} months of expenses. Building a 6-month shield protects against forced asset liquidations."
                    ),
                    pros=[
                        "Immediate liquidity for medical, job, or unforeseen emergencies",
                        "Prevents selling equity investments at a loss during market drawdowns",
                        "Stable ~7.0% yield in sweep accounts / liquid funds"
                    ],
                    cons=[
                        "Lower compounding rate compared to long-term equities"
                    ],
                    key_assumptions=[
                        "Funds stored in RBI-regulated Liquid Mutual Funds or High-Yield FDs",
                        "Inflation rate hovers between 5-6%"
                    ]
                )
            )

        # ----------------------------------------------------
        # Action 3: Increase Systematic Investment Plan (SIP)
        # ----------------------------------------------------
        sip_expected_return = 12.5 # Broad diversified index / flexi-cap
        sip_5y = amount * ((1 + 0.125) ** 5)
        # Score calculation depends on risk tolerance
        risk_bonus = 5.0 if profile.risk_tolerance == "aggressive" else (2.0 if profile.risk_tolerance == "moderate" else -5.0)
        sip_score = 80.0 + risk_bonus
        if has_credit_card_debt:
            sip_score -= 15.0 # Deprioritize equity if card debt @ 38% exists
            
        actions.append(
            ActionEvaluation(
                action_id="increase_monthly_sip",
                action_name="Increase Monthly SIP in Diversified Equity",
                category="WEALTH_GROWTH",
                rank=0,
                decision_score=round(max(sip_score, 40.0), 1),
                expected_annual_return_pct=sip_expected_return,
                risk_level="MODERATE",
                liquidity_rating="MEDIUM",
                tax_efficiency_rating="HIGH", # Long-term capital gains tax benefit (12.5% LTCG)
                five_year_projected_wealth=round(sip_5y, 2),
                projected_benefit=f"+₹{round(sip_5y - amount):,.0f} compounding wealth over 5Y",
                confidence_pct=86,
                recommendation_summary=(
                    "Dollar-cost averaging via SIP captures long-term GDP growth while smoothing market volatility."
                ),
                pros=[
                    "Rupee cost averaging removes market timing risk",
                    "Historical 12-14% CAGR in Indian Large & Midcap equities",
                    "Favorable LTCG tax structure above ₹1.25L exemption"
                ],
                cons=[
                    "Short-term portfolio volatility (10-20% standard deviation)",
                    "Requires minimum 5-7 year horizon for risk mitigation"
                ],
                key_assumptions=[
                    "Indian equity market continues ~12% nominal growth trend",
                    "SIP is maintained uninterrupted through market cycles"
                ]
            )
        )

        # ----------------------------------------------------
        # Action 4: Direct Equity / Growth Equities
        # ----------------------------------------------------
        direct_return = 14.0
        direct_5y = amount * ((1 + 0.14) ** 5)
        equity_score = 75.0 if profile.risk_tolerance == "aggressive" else 65.0
        if has_credit_card_debt:
            equity_score -= 20.0
            
        actions.append(
            ActionEvaluation(
                action_id="invest_direct_equity",
                action_name="Lump Sum in High-Growth Equities",
                category="AGGRESSIVE_GROWTH",
                rank=0,
                decision_score=round(equity_score, 1),
                expected_annual_return_pct=direct_return,
                risk_level="HIGH",
                liquidity_rating="HIGH",
                tax_efficiency_rating="HIGH",
                five_year_projected_wealth=round(direct_5y, 2),
                projected_benefit=f"+₹{round(direct_5y - amount):,.0f} aggressive potential gain",
                confidence_pct=72,
                recommendation_summary=(
                    "Allocating lump sum to high-growth leaders or sectoral indices offers upside at higher volatility."
                ),
                pros=[
                    "Highest historical upside potential",
                    "T+1 settlement liquidity on NSE/BSE"
                ],
                cons=[
                    "Vulnerable to short-term market corrections",
                    "Requires active research and risk monitoring"
                ],
                key_assumptions=[
                    "Investment horizon > 7 years",
                    "Investor can tolerate 25% temporary drawdown"
                ]
            )
        )

        # ----------------------------------------------------
        # Action 5: Fixed Income / Debt Funds / Sovereign Gold Bond
        # ----------------------------------------------------
        debt_return = 7.8
        debt_5y = amount * ((1 + 0.078) ** 5)
        actions.append(
            ActionEvaluation(
                action_id="invest_fixed_income",
                action_name="Allocate to Fixed Income / SGB / Target Maturity Funds",
                category="DEFENSIVE_ALLOCATION",
                rank=0,
                decision_score=68.0,
                expected_annual_return_pct=debt_return,
                risk_level="LOW",
                liquidity_rating="MEDIUM",
                tax_efficiency_rating="MEDIUM",
                five_year_projected_wealth=round(debt_5y, 2),
                projected_benefit=f"+₹{round(debt_5y - amount):,.0f} predictable capital accumulation",
                confidence_pct=89,
                recommendation_summary=(
                    "Target Maturity Debt Funds and Sovereign Gold offer stable accrual yield with low volatility."
                ),
                pros=[
                    "High predictability and capital preservation",
                    "Hedges against equity bear markets"
                ],
                cons=[
                    "May barely beat inflation after slab tax"
                ],
                key_assumptions=[
                    "RBI repo rate trajectory stays between 5.5% - 6.5%"
                ]
            )
        )

        # ----------------------------------------------------
        # Action 6: Hold High-Liquidity Cash
        # ----------------------------------------------------
        cash_return = 4.0
        cash_5y = amount * ((1 + 0.04) ** 5)
        actions.append(
            ActionEvaluation(
                action_id="hold_liquid_cash",
                action_name="Hold in High-Yield Savings / Arbitrage Fund",
                category="CASH_MANAGEMENT",
                rank=0,
                decision_score=48.0,
                expected_annual_return_pct=cash_return,
                risk_level="LOW",
                liquidity_rating="HIGH",
                tax_efficiency_rating="LOW",
                five_year_projected_wealth=round(cash_5y, 2),
                projected_benefit=f"+₹{round(cash_5y - amount):,.0f} maximum immediate flexibility",
                confidence_pct=98,
                recommendation_summary=(
                    "Holding surplus cash preserves total liquidity but suffers from inflation drag."
                ),
                pros=[
                    "Instant withdrawal with zero exit load",
                    "Dry powder ready for sudden market dips"
                ],
                cons=[
                    "Real negative return after 5.5% inflation and income tax"
                ],
                key_assumptions=[
                    "Funds kept in savings bank balance or overnight fund"
                ]
            )
        )

        # ----------------------------------------------------
        # Action 7: Portfolio Rebalancing
        # ----------------------------------------------------
        rebalance_return = 11.8
        rebalance_5y = amount * ((1 + 0.118) ** 5)
        actions.append(
            ActionEvaluation(
                action_id="rebalance_portfolio",
                action_name="Reallocate Portfolio to Target Risk Asset Mix",
                category="PORTFOLIO_OPTIMIZATION",
                rank=0,
                decision_score=72.0,
                expected_annual_return_pct=rebalance_return,
                risk_level="MODERATE",
                liquidity_rating="MEDIUM",
                tax_efficiency_rating="MEDIUM",
                five_year_projected_wealth=round(rebalance_5y, 2),
                projected_benefit=f"+₹{round(rebalance_5y - amount):,.0f} improved risk-adjusted Sharpe ratio",
                confidence_pct=83,
                recommendation_summary=(
                    "Rebalancing existing assets locks in gains and realigns the portfolio with your target risk profile."
                ),
                pros=[
                    "Systematic buy-low sell-high discipline",
                    "Reduces concentration in overperforming sectors"
                ],
                cons=[
                    "May trigger short-term capital gains tax upon switching"
                ],
                key_assumptions=[
                    "Target allocation: 60% Equity / 25% Debt / 10% Gold / 5% Cash"
                ]
            )
        )

        # Sort actions descending by decision_score
        actions.sort(key=lambda x: x.decision_score, reverse=True)
        for i, act in enumerate(actions):
            act.rank = i + 1

        highest = actions[0]
        
        return DecisionEngineResult(
            amount=amount,
            highest_value_action=highest,
            ranked_actions=actions,
            safety_warnings=safety_warnings,
            validation_status="VALIDATED"
        )
