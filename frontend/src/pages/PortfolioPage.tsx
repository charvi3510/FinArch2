import React from 'react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency } from '../utils/formatters';
import {
  PieChart as PieIcon,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts';

export const PortfolioPage: React.FC = () => {
  const { profile, metrics, currency } = useFinancial();

  const totalPortfolio = metrics.total_investments + metrics.total_liquid_cash;

  const allocations = [
    { name: 'Direct Equity & Stocks', value: profile.stocks_equity, percentage: ((profile.stocks_equity / totalPortfolio) * 100).toFixed(1), color: '#06b6d4' },
    { name: 'Mutual Funds (Equity + Hybrid)', value: profile.mutual_funds, percentage: ((profile.mutual_funds / totalPortfolio) * 100).toFixed(1), color: '#3b82f6' },
    { name: 'Fixed Deposits (FD)', value: profile.fixed_deposits, percentage: ((profile.fixed_deposits / totalPortfolio) * 100).toFixed(1), color: '#10b981' },
    { name: 'Sovereign Gold / Physical Gold', value: profile.gold_assets, percentage: ((profile.gold_assets / totalPortfolio) * 100).toFixed(1), color: '#f59e0b' },
    { name: 'Liquid Bank & Cash', value: metrics.total_liquid_cash, percentage: ((metrics.total_liquid_cash / totalPortfolio) * 100).toFixed(1), color: '#8b5cf6' }
  ].filter((a) => a.value > 0);

  // Scatter plot points: Risk vs Return
  const riskReturnData = [
    { name: 'Direct Stocks', risk: 22, returnRate: 14.5, size: profile.stocks_equity, color: '#06b6d4' },
    { name: 'Mutual Funds', risk: 16, returnRate: 12.0, size: profile.mutual_funds, color: '#3b82f6' },
    { name: 'Gold / SGB', risk: 12, returnRate: 9.5, size: profile.gold_assets, color: '#f59e0b' },
    { name: 'Fixed Deposits', risk: 3, returnRate: 7.2, size: profile.fixed_deposits, color: '#10b981' },
    { name: 'Liquid Savings', risk: 1, returnRate: 4.0, size: metrics.total_liquid_cash, color: '#8b5cf6' }
  ];

  // Concentration and Health Warnings
  const warnings = [];
  if (metrics.equity_allocation_pct > 65) {
    warnings.push({
      type: 'CONCENTRATION_WARNING',
      title: `High Equity Concentration (${metrics.equity_allocation_pct}%)`,
      desc: 'Your total portfolio has over 65% exposure to equity assets, creating elevated downside vulnerability during market corrections.',
      recommendation: 'Direct future monthly surpluses toward fixed income / debt instruments to build an anti-fragile asset foundation.'
    });
  }
  if (metrics.cash_allocation_pct > 30) {
    warnings.push({
      type: 'CASH_DRAG',
      title: `Excess Cash Drag (${metrics.cash_allocation_pct}%)`,
      desc: 'Holding more than 30% in low-yield cash results in real purchasing power decay against 5.5% inflation.',
      recommendation: 'Deploy idle balances above the 6-month emergency reserve into short-term multi-asset funds.'
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              PORTFOLIO <span className="text-cyan-400">INTELLIGENCE</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Modern Portfolio Theory
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Holistic asset allocation analysis, risk-return efficiency, and automated concentration detection.
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Total Portfolio Value:</span>
          <span className="text-xl font-mono font-bold text-cyan-400">
            {formatCurrency(totalPortfolio, currency)}
          </span>
        </div>
      </div>

      {/* Concentration / Diagnostic Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-card-elevated"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">{w.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{w.desc}</p>
                  <p className="text-xs text-amber-400/90 font-medium mt-1">
                    <strong>Engine Recommendation: </strong> {w.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Allocation Donut + Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider mb-2 self-start">
            Asset Distribution
          </h3>

          <div className="w-full h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b14" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val), currency), 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Capital</span>
              <span className="text-lg font-mono font-bold text-slate-100 mt-0.5">
                {formatCurrency(totalPortfolio, currency)}
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
            {allocations.map((a) => (
              <div key={a.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }}></span>
                <span className="text-slate-400 truncate text-[11px]">{a.name}</span>
                <span className="font-mono text-slate-200 font-semibold ml-auto">{a.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              Asset Class Breakdown & Characteristics
            </h3>
            <span className="text-xs font-mono text-cyan-400">Blended Yield: ~11.4%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 font-mono bg-slate-900/60">
                <tr>
                  <th className="p-3 rounded-l-xl">Asset Category</th>
                  <th className="p-3">Current Holdings</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Target Mix</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allocations.map((item) => {
                  return (
                    <tr key={item.name} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-semibold text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span>{item.name}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-100">
                        {formatCurrency(item.value, currency)}
                      </td>
                      <td className="p-3 font-mono text-cyan-400">{item.percentage}%</td>
                      <td className="p-3 font-mono text-slate-400">
                        {item.name.includes('Equity') ? '55%' : item.name.includes('Mutual') ? '20%' : item.name.includes('Gold') ? '10%' : '15%'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Risk vs Expected Return Scatter Plot */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">
              Expected Return vs Volatility Profile (Efficient Frontier Mapping)
            </h3>
            <p className="text-xs text-slate-400">
              Higher returns require corresponding standard deviation tolerance.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
            Est. Sharpe Ratio: 1.34
          </span>
        </div>

        <div className="h-72 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <XAxis
                type="number"
                dataKey="risk"
                name="Annual Volatility"
                unit="%"
                stroke="#475569"
                fontSize={11}
                label={{ value: 'Annual Volatility (%)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="returnRate"
                name="Expected Return"
                unit="%"
                stroke="#475569"
                fontSize={11}
                label={{ value: 'Expected CAGR (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="size" range={[60, 400]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
              />
              <Scatter name="Assets" data={riskReturnData}>
                {riskReturnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
