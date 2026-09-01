import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { WhatIfResult, MonteCarloResult } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import {
  Flame,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Sliders,
  Calendar,
  ShieldCheck,
  Zap,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

export const WhatIfSimulatorPage: React.FC = () => {
  const { profile, metrics, currency } = useFinancial();
  const [activeTab, setActiveTab] = useState<'deterministic' | 'monte_carlo'>('deterministic');

  // Deterministic What-If Parameters
  const [params, setParams] = useState({
    salary_increase_pct: 0,
    expense_increase_pct: 0,
    extra_monthly_sip: 0,
    one_time_investment: 0,
    one_time_debt_payoff: 0,
    market_shock_pct: 0,
    stop_sip_months: 0,
    projection_years: 10
  });

  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null);
  const [loadingWhatIf, setLoadingWhatIf] = useState<boolean>(true);

  // Monte Carlo parameters
  const [mcParams, setMcParams] = useState({
    initial_wealth: metrics.total_investments,
    monthly_savings: profile.monthly_sip,
    years: 10,
    num_simulations: 1000,
    expected_return_pct: 12.0,
    annual_volatility_pct: 15.0,
    target_goal_wealth: 7500000
  });

  const [mcResult, setMcResult] = useState<MonteCarloResult | null>(null);
  const [loadingMC, setLoadingMC] = useState<boolean>(true);

  const runWhatIf = async () => {
    setLoadingWhatIf(true);
    try {
      const res = await ApiService.simulateWhatIf(params);
      setWhatIfResult(res);
    } catch (e) {
      console.error('What-if error:', e);
    } finally {
      setLoadingWhatIf(false);
    }
  };

  const runMC = async () => {
    setLoadingMC(true);
    try {
      const res = await ApiService.runMonteCarlo(
        mcParams.initial_wealth,
        mcParams.monthly_savings,
        mcParams.years,
        mcParams.num_simulations,
        mcParams.expected_return_pct,
        mcParams.annual_volatility_pct,
        mcParams.target_goal_wealth
      );
      setMcResult(res);
    } catch (e) {
      console.error('Monte carlo error:', e);
    } finally {
      setLoadingMC(false);
    }
  };

  useEffect(() => {
    runWhatIf();
  }, [params, profile]);

  useEffect(() => {
    runMC();
  }, [mcParams, profile]);

  // Quick preset scenarios
  const applyPreset = (presetName: string) => {
    if (presetName === 'sip_boost') {
      setParams({ ...params, extra_monthly_sip: 5000 });
    } else if (presetName === 'salary_hike') {
      setParams({ ...params, salary_increase_pct: 15 });
    } else if (presetName === 'market_crash') {
      setParams({ ...params, market_shock_pct: -20 });
    } else if (presetName === 'debt_clear') {
      setParams({ ...params, one_time_debt_payoff: 100000 });
    } else if (presetName === 'lump_sum') {
      setParams({ ...params, one_time_investment: 100000 });
    } else if (presetName === 'reset') {
      setParams({
        salary_increase_pct: 0,
        expense_increase_pct: 0,
        extra_monthly_sip: 0,
        one_time_investment: 0,
        one_time_debt_payoff: 0,
        market_shock_pct: 0,
        stop_sip_months: 0,
        projection_years: 10
      });
    }
  };

  // Monte Carlo percentile trajectories for fan chart
  const mcTrajectoryData = mcResult
    ? Array.from({ length: mcParams.years + 1 }, (_, i) => ({
        year: `Yr ${i}`,
        p10_worst: mcResult.percentile_trajectories.p10[i] || 0,
        p50_median: mcResult.percentile_trajectories.p50[i] || 0,
        p90_best: mcResult.percentile_trajectories.p90[i] || 0,
        targetGoal: mcParams.target_goal_wealth
      }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              WHAT-IF <span className="text-cyan-400">SIMULATOR & LAB</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              10-Year Multi-Scenario
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate life changes, market shocks, extra SIPs, and stochastic Monte Carlo market pathways.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('deterministic')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'deterministic'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scenario Levers (Dual Strategy)
          </button>
          <button
            onClick={() => setActiveTab('monte_carlo')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'monte_carlo'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1,000 Monte Carlo Paths
          </button>
        </div>
      </div>

      {activeTab === 'deterministic' ? (
        <>
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono mr-2">Quick Scenarios:</span>
            <button
              onClick={() => applyPreset('sip_boost')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-cyan-300"
            >
              +₹5,000 Extra SIP
            </button>
            <button
              onClick={() => applyPreset('salary_hike')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-emerald-300"
            >
              +15% Salary Hike
            </button>
            <button
              onClick={() => applyPreset('market_crash')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-rose-300"
            >
              -20% Market Drop Today
            </button>
            <button
              onClick={() => applyPreset('debt_clear')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-purple-300"
            >
              ₹1L Debt Prepayment
            </button>
            <button
              onClick={() => applyPreset('lump_sum')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-amber-300"
            >
              ₹1L Lump Sum Investment
            </button>
            <button
              onClick={() => applyPreset('reset')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400 ml-auto"
            >
              Reset Baseline
            </button>
          </div>

          {/* Interactive Levers Control Grid */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Simulated Strategy Levers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Lever 1: Salary Hike */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Salary Increase</span>
                  <span className="font-mono text-emerald-400 font-bold">+{params.salary_increase_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={params.salary_increase_pct}
                  onChange={(e) => setParams({ ...params, salary_increase_pct: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Lever 2: Expense Inflation */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Expense Increase</span>
                  <span className="font-mono text-rose-400 font-bold">+{params.expense_increase_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={params.expense_increase_pct}
                  onChange={(e) => setParams({ ...params, expense_increase_pct: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              {/* Lever 3: Extra SIP */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Extra Monthly SIP</span>
                  <span className="font-mono text-cyan-400 font-bold">+{formatCurrency(params.extra_monthly_sip, currency)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="2000"
                  value={params.extra_monthly_sip}
                  onChange={(e) => setParams({ ...params, extra_monthly_sip: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Lever 4: Market Crash Shock */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Immediate Market Shock</span>
                  <span className={`font-mono font-bold ${params.market_shock_pct < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.market_shock_pct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="30"
                  step="5"
                  value={params.market_shock_pct}
                  onChange={(e) => setParams({ ...params, market_shock_pct: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Key Simulation Takeaways & Comparative Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">5-Year Wealth Impact</span>
              <span className="text-xl font-mono font-bold text-slate-100 mt-1 block">
                {formatCurrency(whatIfResult?.five_year_wealth_simulated || 0, currency)}
              </span>
              <span
                className={`text-[11px] font-mono font-bold mt-1 block ${
                  (whatIfResult?.five_year_delta || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {(whatIfResult?.five_year_delta || 0) >= 0 ? '+' : ''}
                {formatCurrency(whatIfResult?.five_year_delta || 0, currency)} vs Base
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">10-Year Wealth Impact</span>
              <span className="text-xl font-mono font-bold text-cyan-400 mt-1 block">
                {formatCurrency(whatIfResult?.ten_year_wealth_simulated || 0, currency)}
              </span>
              <span className="text-[11px] font-mono text-cyan-300 mt-1 block">
                +
                {formatCurrency(
                  (whatIfResult?.ten_year_wealth_simulated || 0) - (whatIfResult?.ten_year_wealth_current || 0),
                  currency
                )}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Projected Debt Free</span>
              <span className="text-sm sm:text-base font-mono font-bold text-slate-100 mt-1 block">
                {whatIfResult?.debt_free_date_simulated || 'Year 2028'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Base: {whatIfResult?.debt_free_date_current}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Goal Success Probability</span>
              <span className="text-xl font-mono font-bold text-purple-400 mt-1 block">
                {whatIfResult?.goal_probability_simulated || 85}%
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Base: {whatIfResult?.goal_probability_current}%</span>
            </div>
          </div>

          {/* Dual Strategy Trajectory Chart */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">
                  Dual-Strategy Trajectory: Current vs Simulated Path
                </h3>
                <p className="text-xs text-slate-400">10-Year net worth compounding curve comparison</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                  <span className="text-slate-400">Current Strategy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <span className="text-cyan-300 font-bold">Simulated Strategy</span>
                </div>
              </div>
            </div>

            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={whatIfResult?.yearly_trajectory || []}>
                  <defs>
                    <linearGradient id="curGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={11} tickFormatter={(yr) => `Year ${yr}`} />
                  <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => formatCurrency(v, currency)} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="current_net_worth"
                    name="Current Strategy Net Worth"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#curGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="simulated_net_worth"
                    name="Simulated Strategy Net Worth"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#simGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        /* MONTE CARLO TAB */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Monte Carlo Banner */}
          <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/30 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>1,000-Path Stochastic Market Simulation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                Long-Term Goal Probability: {mcResult?.goal_success_probability_pct}% Success Rate
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Simulates 1,000 randomized market volatility regimes to determine true statistical confidence of reaching ₹{(mcParams.target_goal_wealth / 100000).toFixed(1)}L goal corpus.
              </p>
            </div>

            <div className="p-3 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Expected Median Corpus</span>
              <span className="text-2xl font-bold text-emerald-400">
                {formatCurrency(mcResult?.median_wealth || 0, currency)}
              </span>
            </div>
          </div>

          {/* Percentile Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-rose-500/20">
              <span className="text-[11px] text-rose-400 uppercase tracking-wider font-semibold block">
                10th Percentile (Worst Case)
              </span>
              <span className="text-xl font-mono font-bold text-slate-100 mt-1 block">
                {formatCurrency(mcResult?.p10_worst_case || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">90% chance of exceeding this</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
              <span className="text-[11px] text-cyan-400 uppercase tracking-wider font-semibold block">
                50th Percentile (Median)
              </span>
              <span className="text-xl font-mono font-bold text-cyan-300 mt-1 block">
                {formatCurrency(mcResult?.median_wealth || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Most probable outcome</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold block">
                90th Percentile (Bull Case)
              </span>
              <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
                {formatCurrency(mcResult?.p90_best_case || 0, currency)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Strong bull economic cycle</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-purple-500/20">
              <span className="text-[11px] text-purple-400 uppercase tracking-wider font-semibold block">
                Target Corpus
              </span>
              <span className="text-xl font-mono font-bold text-purple-300 mt-1 block">
                {formatCurrency(mcParams.target_goal_wealth, currency)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {mcResult?.goal_success_probability_pct}% probability
              </span>
            </div>
          </div>

          {/* Monte Carlo Fan Chart */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">
                  Percentile Fan Dispersion (10th / 50th / 90th Percentiles)
                </h3>
                <p className="text-xs text-slate-400">Range of possible outcomes across 10 years of market volatility</p>
              </div>
            </div>

            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mcTrajectoryData}>
                  <XAxis dataKey="year" stroke="#475569" fontSize={11} />
                  <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => formatCurrency(v, currency)} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                  />
                  <Line type="monotone" dataKey="p90_best" name="90th Percentile (Bull Case)" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="p50_median" name="50th Percentile (Median)" stroke="#06b6d4" strokeWidth={3} />
                  <Line type="monotone" dataKey="p10_worst" name="10th Percentile (Bear Case)" stroke="#f43f5e" strokeWidth={2} />
                  <Line type="monotone" dataKey="targetGoal" name="Target Goal" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wealth Distribution Histogram */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider pb-3 border-b border-slate-800">
              Corpus Probability Distribution (1,000 Iterations)
            </h3>

            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mcResult?.distribution_bins || []}>
                  <XAxis dataKey="range_label" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Probability']}
                  />
                  <Bar dataKey="probability_pct" radius={[6, 6, 0, 0]}>
                    {(mcResult?.distribution_bins || []).map((_, index) => (
                      <Cell key={`bin-${index}`} fill={index > 4 ? '#06b6d4' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
