import numpy as np
from typing import Dict, Any, List
from app.schemas.financial import MonteCarloRequest, MonteCarloResult

class MonteCarloSimulator:
    @staticmethod
    def run_simulation(req: MonteCarloRequest) -> MonteCarloResult:
        np.random.seed(42) # For reproducible deterministic runs, or randomized if needed
        
        num_sims = max(req.num_simulations, 100)
        years = req.years
        months = years * 12
        initial_wealth = req.initial_wealth
        monthly_addition = req.monthly_savings
        
        # Monthly mean return and monthly volatility (log-normal geometric brownian motion)
        annual_return = req.expected_return_pct / 100.0
        annual_vol = req.annual_volatility_pct / 100.0
        
        monthly_return = (1.0 + annual_return) ** (1.0 / 12.0) - 1.0
        monthly_vol = annual_vol / np.sqrt(12.0)
        
        # Simulate paths: shape (num_sims, months + 1)
        simulated_paths = np.zeros((num_sims, months + 1))
        simulated_paths[:, 0] = initial_wealth
        
        # Random normal shocks
        shocks = np.random.normal(loc=monthly_return, scale=monthly_vol, size=(num_sims, months))
        
        for t in range(1, months + 1):
            # Compound previous balance + add monthly contribution
            growth_factors = 1.0 + shocks[:, t - 1]
            simulated_paths[:, t] = (simulated_paths[:, t - 1] * growth_factors) + monthly_addition
            
        final_wealths = simulated_paths[:, -1]
        
        # Calculate key metrics
        target = req.target_goal_wealth
        success_count = np.sum(final_wealths >= target)
        success_prob = (success_count / num_sims) * 100.0
        
        p10 = np.percentile(final_wealths, 10)
        p50 = np.percentile(final_wealths, 50)
        p90 = np.percentile(final_wealths, 90)
        mean_wealth = np.mean(final_wealths)
        min_wealth = np.min(final_wealths)
        max_wealth = np.max(final_wealths)
        
        # Generate yearly trajectories for percentiles
        yearly_indices = [yr * 12 for yr in range(years + 1)]
        p10_yearly = [round(float(np.percentile(simulated_paths[:, idx], 10)), 2) for idx in yearly_indices]
        p50_yearly = [round(float(np.percentile(simulated_paths[:, idx], 50)), 2) for idx in yearly_indices]
        p90_yearly = [round(float(np.percentile(simulated_paths[:, idx], 90)), 2) for idx in yearly_indices]
        
        # Generate histogram / distribution bins (12 bins)
        hist, bin_edges = np.histogram(final_wealths, bins=12)
        distribution_bins = []
        for i in range(len(hist)):
            distribution_bins.append({
                "range_label": f"₹{bin_edges[i]/100000:.1f}L - ₹{bin_edges[i+1]/100000:.1f}L",
                "min_val": round(float(bin_edges[i]), 2),
                "max_val": round(float(bin_edges[i+1]), 2),
                "count": int(hist[i]),
                "probability_pct": round(float(hist[i] / num_sims * 100), 1)
            })
            
        assumptions_text = (
            f"Based on {num_sims:,} simulated economic cycles over {years} years with {req.expected_return_pct}% expected return, "
            f"{req.annual_volatility_pct}% annual standard deviation, and continuous ₹{monthly_addition:,.0f}/mo SIP."
        )
        
        return MonteCarloResult(
            num_simulations=num_sims,
            target_goal=target,
            goal_success_probability_pct=round(success_prob, 1),
            expected_final_wealth=round(float(mean_wealth), 2),
            median_wealth=round(float(p50), 2),
            p10_worst_case=round(float(p10), 2),
            p90_best_case=round(float(p90), 2),
            min_wealth=round(float(min_wealth), 2),
            max_wealth=round(float(max_wealth), 2),
            distribution_bins=distribution_bins,
            percentile_trajectories={
                "p10": p10_yearly,
                "p50": p50_yearly,
                "p90": p90_yearly
            },
            assumptions_summary=assumptions_text
        )
