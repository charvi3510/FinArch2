import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: React.ReactNode;
  accentColor?: 'mint' | 'cyan' | 'amber' | 'crimson' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive,
  icon,
  accentColor = 'slate',
  onClick,
}) => {
  const accentBorder = {
    mint: 'hover:border-mint-500/40',
    cyan: 'hover:border-cyan-500/40',
    amber: 'hover:border-amber-500/40',
    crimson: 'hover:border-crimson-500/40',
    slate: 'hover:border-white/20',
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`fin-panel p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group ${
        onClick ? `cursor-pointer ${accentBorder}` : ''
      }`}
    >
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="tech-label">{title}</span>
        {icon && <div className="text-slate-400 group-hover:text-slate-200 transition-colors">{icon}</div>}
      </div>

      {/* Main Metric */}
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
          {value}
        </div>

        {/* Subtitle / Trend */}
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs font-mono">
            {trend && (
              <span
                className={`font-semibold ${
                  trendPositive ? 'text-mint-400' : 'text-crimson-400'
                }`}
              >
                {trend}
              </span>
            )}
            {subtitle && <span className="text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
