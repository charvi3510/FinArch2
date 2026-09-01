import React from 'react';
import { FinancialHealthScoreBreakdown } from '../../types';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  scoreData: FinancialHealthScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const HealthScoreRadial: React.FC<Props> = ({ scoreData, size = 'md', showBreakdown = true }) => {
  const score = scoreData.overall_score;

  // Semicircle / 240-degree gauge calculation
  const radius = size === 'lg' ? 68 : size === 'md' ? 52 : 36;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 5;
  const arcLength = 240; // degrees
  const circumference = (2 * Math.PI * radius * arcLength) / 360;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#00f59b';
  let badgeColor = 'bg-mint-500/10 text-mint-400 border-mint-500/30';

  if (score >= 80) {
    strokeColor = '#00f59b';
    badgeColor = 'bg-mint-500/10 text-mint-400 border-mint-500/30';
  } else if (score >= 65) {
    strokeColor = '#22d3ee';
    badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  } else if (score >= 45) {
    strokeColor = '#fbbf24';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    strokeColor = '#f43f5e';
    badgeColor = 'bg-crimson-500/10 text-crimson-400 border-crimson-500/30';
  }

  const svgDim = radius * 2 + 24;

  const subScores = [
    { label: 'Emergency', score: scoreData.emergency_fund_score, max: 100 },
    { label: 'Debt Safety', score: scoreData.debt_health_score, max: 100 },
    { label: 'Savings Rate', score: scoreData.savings_score, max: 100 },
    { label: 'Diversification', score: scoreData.diversification_score, max: 100 },
    { label: 'Goal Velocity', score: scoreData.goal_progress_score, max: 100 },
    { label: 'Risk Alignment', score: scoreData.risk_alignment_score, max: 100 },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Arc Meter */}
      <div className="relative flex items-center justify-center" style={{ width: svgDim, height: svgDim * 0.85 }}>
        <svg height={svgDim} width={svgDim} className="transform rotate-[150deg]">
          {/* Background Track Arc */}
          <circle
            cx={svgDim / 2}
            cy={svgDim / 2}
            r={radius}
            stroke="#141A1F"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            fill="none"
            strokeLinecap="round"
          />

          {/* Active Score Arc */}
          <circle
            cx={svgDim / 2}
            cy={svgDim / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            fill="none"
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* Center Numerical readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-3xl sm:text-4xl font-mono font-extrabold text-white tracking-tight">
            {score}
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            / 100 INDEX
          </span>
        </div>
      </div>

      {/* Grade status badge */}
      <div className="mt-1 flex items-center gap-2">
        <span className={`tech-badge border ${badgeColor}`}>
          GRADE: {scoreData.score_grade || 'A'}
        </span>
        <span className="text-xs font-mono text-slate-300 font-semibold">
          {scoreData.insights?.[0] || 'Strong financial foundation'}
        </span>
      </div>

      {/* Sub-Score Bars */}
      {showBreakdown && (
        <div className="w-full mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-3">
          {subScores.map((item) => (
            <div key={item.label} className="bg-obsidian-900/60 p-2.5 rounded border border-white/[0.05]">
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="text-slate-400 uppercase">{item.label}</span>
                <span className="font-bold text-white">{item.score}%</span>
              </div>
              <div className="w-full h-1 bg-obsidian-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-mint-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
