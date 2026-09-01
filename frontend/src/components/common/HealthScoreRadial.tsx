import React from 'react';
import { FinancialHealthScoreBreakdown } from '../../types';
import { ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  scoreData: FinancialHealthScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const HealthScoreRadial: React.FC<Props> = ({ scoreData, size = 'md', showBreakdown = true }) => {
  const score = scoreData.overall_score;
  const radius = size === 'lg' ? 70 : size === 'md' ? 52 : 36;
  const strokeWidth = size === 'lg' ? 12 : size === 'md' ? 9 : 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-cyan-400';
  let ringStroke = 'url(#cyanGradient)';
  let gradeBadge = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';

  if (score >= 85) {
    ringStroke = 'url(#emeraldGradient)';
    colorClass = 'text-emerald-400';
    gradeBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (score >= 70) {
    ringStroke = 'url(#cyanGradient)';
    colorClass = 'text-cyan-400';
    gradeBadge = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  } else if (score >= 50) {
    ringStroke = 'url(#amberGradient)';
    colorClass = 'text-amber-400';
    gradeBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    ringStroke = 'url(#roseGradient)';
    colorClass = 'text-rose-400';
    gradeBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  const svgDim = radius * 2 + 10;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: svgDim, height: svgDim }}>
        <svg height={svgDim} width={svgDim} className="transform -rotate-90">
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={svgDim / 2}
            cy={svgDim / 2}
          />
          {/* Progress circle */}
          <circle
            stroke={ringStroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={svgDim / 2}
            cy={svgDim / 2}
          />
        </svg>

        {/* Center score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-bold ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'} ${colorClass}`}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${gradeBadge}`}>
          {scoreData.score_grade} HEALTH
        </span>
      </div>

      {showBreakdown && (
        <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Emergency Reserve</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-semibold text-slate-200">{scoreData.emergency_fund_score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${scoreData.emergency_fund_score}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Debt Health</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-semibold text-slate-200">{scoreData.debt_health_score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${scoreData.debt_health_score}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Savings Rate</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-semibold text-slate-200">{scoreData.savings_score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${scoreData.savings_score}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Diversification</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-semibold text-slate-200">{scoreData.diversification_score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${scoreData.diversification_score}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Goal Progress</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-semibold text-slate-200">{scoreData.goal_progress_score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${scoreData.goal_progress_score}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Risk Alignment</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-semibold text-slate-200">{scoreData.risk_alignment_score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-teal-400 h-full rounded-full" style={{ width: `${scoreData.risk_alignment_score}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
