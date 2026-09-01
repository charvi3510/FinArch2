import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { OptimizationResult } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import {
  SlidersHorizontal,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const OptimizerPage: React.FC = () => {
  const { profile, currency } = useFinancial();
  const [amount, setAmount] = useState<number>(50000);
  const [weights, setWeights] = useState({
    expected_return: 0.25,
    risk_reduction: 0.20,
    liquidity: 0.20,
    debt_payoff: 0.20,
    goal_alignment: 0.15
  });

  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOptimization = async () => {
    setLoading(true);
    try {
      const res = await ApiService.optimizeOpportunity(amount, weights);
      setResult(res);
    } catch (e) {
      console.error('Optimization failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, [amount, weights, profile]);

  const handleWeightChange = (key: keyof typeof weights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  const chartData = result?.comparison_table.map((item) => ({
    name: item.action.length > 20 ? item.action.substring(0, 18) + '...' : item.action,
    fiveYearWealth: item.five_year_wealth,
    wealthDelta: item.wealth_delta,
    score: item.score
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              OPPORTUNITY <span className="text-cyan-400">OPTIMIZER</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Pareto Multi-Objective
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Weigh every available rupee against competing financial alternatives using customizable multi-objective criteria.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Dynamic Weights Active</span>
        </div>
      </div>

      {/* Available Amount & Weights Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Available Capital Input */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Available Capital To Allocate
            </span>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-slate-200">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(Number(e.target.value), 0))}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xl sm:text-2xl font-mono font-bold text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {[25000, 50000, 100000, 200000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    amount === preset
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {formatCurrency(preset, currency)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
            <span className="font-semibold block mb-1">Optimizer Principle:</span>
            Capital is scarce. FINARCH AI ranks allocations where the marginal utility of debt relief or compounding growth is highest.
          </div>
        </div>

        {/* Right 2 cols: Multi-Objective Weight Sliders */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Preference Weightings (Customize Optimization Function)
            </span>
            <button
              onClick={() =>
                setWeights({
                  expected_return: 0.25,
                  risk_reduction: 0.20,
                  liquidity: 0.20,
                  debt_payoff: 0.20,
                  goal_alignment: 0.15
                })
              }
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Expected Return</span>
                <span className="font-mono text-cyan-400">{(weights.expected_return * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={weights.expected_return}
                onChange={(e) => handleWeightChange('expected_return', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Risk Minimization</span>
                <span className="font-mono text-emerald-400">{(weights.risk_reduction * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={weights.risk_reduction}
                onChange={(e) => handleWeightChange('risk_reduction', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Immediate Liquidity</span>
                <span className="font-mono text-purple-400">{(weights.liquidity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={weights.liquidity}
                onChange={(e) => handleWeightChange('liquidity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Debt Elimination</span>
                <span className="font-mono text-rose-400">{(weights.debt_payoff * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={weights.debt_payoff}
                onChange={(e) => handleWeightChange('debt_payoff', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Goal Target Alignment</span>
                <span className="font-mono text-amber-400">{(weights.goal_alignment * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={weights.goal_alignment}
                onChange={(e) => handleWeightChange('goal_alignment', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">
              Multi-Objective Opportunity Matrix
            </h3>
            <p className="text-xs text-slate-400">Comparing financial opportunities for {formatFullCurrency(amount, currency)}</p>
          </div>
          {result?.best_action && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Highest Utility: {result.best_action.action}</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="p-3.5 rounded-l-xl">Action</th>
                <th className="p-3.5">Expected Return</th>
                <th className="p-3.5">Risk Rating</th>
                <th className="p-3.5">Liquidity</th>
                <th className="p-3.5">Goal Impact</th>
                <th className="p-3.5 font-right">5Y Projected Wealth</th>
                <th className="p-3.5 font-right rounded-r-xl">Decision Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {result?.comparison_table.map((row, idx) => {
                const isBest = idx === 0;
                return (
                  <tr
                    key={row.action_id}
                    className={`transition-colors ${isBest ? 'bg-cyan-500/10 font-medium text-slate-100' : 'hover:bg-slate-900/40'}`}
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        {isBest && <span className="text-cyan-400 font-bold">★</span>}
                        <span className="font-semibold text-slate-200">{row.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{row.pros}</span>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{row.expected_return}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          row.risk.includes('GUARANTEED') || row.risk.includes('VERY LOW')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : row.risk.includes('MODERATE') || row.risk.includes('LOW')
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {row.risk}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{row.liquidity}</td>
                    <td className="p-3.5 font-mono text-cyan-300">{row.goal_impact}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-100">
                      {formatCurrency(row.five_year_wealth, currency)}
                      <span className="text-[10px] text-emerald-400 block">
                        (+{formatCurrency(row.wealth_delta, currency)})
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-base text-cyan-400">
                      {row.score}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Year Projected Wealth Comparison Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">
              5-Year Wealth Trajectory Comparison
            </h3>
            <p className="text-xs text-slate-400">Projected final capital value across each competing action</p>
          </div>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 30 }}>
              <XAxis type="number" stroke="#475569" fontSize={11} tickFormatter={(v) => formatCurrency(v, currency)} />
              <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val: any) => [formatCurrency(Number(val), currency), '5Y Wealth']}
              />
              <Bar dataKey="fiveYearWealth" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
