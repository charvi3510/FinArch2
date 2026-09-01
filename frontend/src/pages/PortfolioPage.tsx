import React from 'react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  PieChart as PieIcon,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export const PortfolioPage: React.FC = () => {
  const { profile, metrics, currency } = useFinancial();

  // Portfolio Asset breakdown matrix
  const assets = [
    {
      name: 'Direct Equities / Stocks',
      value: profile.stocks_equity,
      category: 'Growth',
      expectedReturn: 14.5,
      annualVolatility: 18.0,
      liquidity: 'T+1 (High)',
      riskLevel: 'HIGH',
    },
    {
      name: 'Mutual Funds / Index ETFs',
      value: profile.mutual_funds,
      category: 'Core Growth',
      expectedReturn: 13.0,
      annualVolatility: 15.0,
      liquidity: 'T+2 (High)',
      riskLevel: 'MEDIUM',
    },
    {
      name: 'Fixed Deposits (FD)',
      value: profile.fixed_deposits,
      category: 'Fixed Income',
      expectedReturn: 7.2,
      annualVolatility: 0.5,
      liquidity: 'Penalty (Medium)',
      riskLevel: 'VERY LOW',
    },
    {
      name: 'Physical Gold / SGBs',
      value: profile.gold_assets,
      category: 'Hedge / Commodity',
      expectedReturn: 9.5,
      annualVolatility: 12.0,
      liquidity: 'High (SGB 8Y)',
      riskLevel: 'LOW',
    },
    {
      name: 'Emergency & Liquid Cash',
      value: profile.emergency_fund + profile.cash_balance,
      category: 'Liquidity Buffer',
      expectedReturn: 4.0,
      annualVolatility: 0.0,
      liquidity: 'Instant (T+0)',
      riskLevel: 'VERY LOW',
    },
  ];

  const totalAssetValue = assets.reduce((sum, a) => sum + a.value, 0) || 1;

  const riskReturnData = assets
    .filter((a) => a.value > 0)
    .map((a) => ({
      name: a.name,
      volatility: a.annualVolatility,
      expectedReturn: a.expectedReturn,
      allocationPct: Math.round((a.value / totalAssetValue) * 100),
      value: a.value,
    }));

  const equityAllocationPct = Math.round(
    ((profile.stocks_equity + profile.mutual_funds) / totalAssetValue) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              PORTFOLIO INTELLIGENCE
            </span>
            <span className="tech-label text-slate-400">ASSET RISK-RETURN TOPOLOGY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            PORTFOLIO INTELLIGENCE
          </h1>
        </div>

        <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300 self-start sm:self-auto">
          TOTAL ASSETS: {formatCurrency(totalAssetValue, currency)}
        </span>
      </div>

      {/* CONCENTRATION ALERT / SAFETY STATUS */}
      {equityAllocationPct > 65 ? (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <span className="font-bold text-amber-400 block uppercase">
              HIGH CONCENTRATION RISK DETECTED ({equityAllocationPct}% EQUITIES)
            </span>
            <p className="text-slate-300 mt-0.5">
              Equity exposure exceeds recommended 65% baseline for current moderate risk profile. A market correction of -20% could cause an unrealized drawdown of ~{formatCurrency(totalAssetValue * 0.13, currency)}.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-mint-500/10 border border-mint-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-mint-400 shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <span className="font-bold text-mint-400 block uppercase">
              BALANCED ASSET ALLOCATION ({equityAllocationPct}% EQUITIES)
            </span>
            <p className="text-slate-300 mt-0.5">
              Portfolio maintains healthy diversification across liquid reserves, equity growth, and fixed income hedges.
            </p>
          </div>
        </div>
      )}

      {/* HERO VISUALIZATION: RISK-VS-RETURN SCATTER TOPOLOGY */}
      <div className="fin-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div>
            <span className="tech-label text-slate-400">MODERN PORTFOLIO THEORY MAP</span>
            <h3 className="text-base font-bold text-white font-mono">
              ASSET RISK (VOLATILITY) VS. EXPECTED RETURN
            </h3>
          </div>
          <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
            Top-Left = Maximum Efficiency
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <XAxis
                type="number"
                dataKey="volatility"
                name="Annual Volatility"
                unit="%"
                stroke="#4A5B68"
                fontSize={11}
                label={{ value: 'Annual Volatility / Downside Risk (%)', position: 'bottom', offset: -10, fill: '#64748b', fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="expectedReturn"
                name="Expected CAGR"
                unit="%"
                stroke="#4A5B68"
                fontSize={11}
                label={{ value: 'Expected CAGR (%)', angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A0D0F', borderColor: '#222B32', borderRadius: '8px' }}
                formatter={(val: any, name: any) => [name === 'allocationPct' ? `${val}%` : `${val}%`, name]}
              />
              <Scatter data={riskReturnData}>
                {riskReturnData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name.includes('Equities') ? '#00f59b' : entry.name.includes('Mutual') ? '#22d3ee' : '#38bdf8'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DETAILED ASSET MAP TABLE */}
      <div className="fin-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="tech-label text-slate-400">HOLDINGS AUDIT</span>
            <h3 className="text-base font-bold text-white font-mono">ASSET EXPOSURE & LIQUIDITY MATRIX</h3>
          </div>
          <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
            5 ASSET CLASSES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-obsidian-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="p-3">Asset Holding</th>
                <th className="p-3">Current Value</th>
                <th className="p-3">Allocation</th>
                <th className="p-3">Expected CAGR</th>
                <th className="p-3">Volatility</th>
                <th className="p-3">Liquidity Speed</th>
                <th className="p-3 text-right">Risk Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {assets.map((a) => {
                const allocPct = Math.round((a.value / totalAssetValue) * 100);
                return (
                  <tr key={a.name} className="hover:bg-obsidian-900/40">
                    <td className="p-3 font-sans font-bold text-white">{a.name}</td>
                    <td className="p-3 text-white font-bold">{formatCurrency(a.value, currency)}</td>
                    <td className="p-3 font-bold text-mint-400">{allocPct}%</td>
                    <td className="p-3 text-cyan-400">+{a.expectedReturn}%</td>
                    <td className="p-3 text-slate-400">{a.annualVolatility}%</td>
                    <td className="p-3 text-slate-300">{a.liquidity}</td>
                    <td className="p-3 text-right">
                      <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
                        {a.riskLevel}
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
  );
};
