import React, { ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: ReactNode;
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive,
  icon,
  accentColor = 'cyan',
  onClick
}) => {
  const colorMap = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-500/10',
    rose: 'border-rose-500/20 hover:border-rose-500/40 text-rose-400 bg-rose-500/10',
    purple: 'border-purple-500/20 hover:border-purple-500/40 text-purple-400 bg-purple-500/10',
    blue: 'border-blue-500/20 hover:border-blue-500/40 text-blue-400 bg-blue-500/10'
  };

  const selectedClasses = colorMap[accentColor] || colorMap.cyan;

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl border transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${selectedClasses}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-100 tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <span className={`font-semibold font-mono ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend}
              </span>
            )}
            {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
