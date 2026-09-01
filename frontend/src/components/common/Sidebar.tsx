import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  SlidersHorizontal,
  PieChart,
  Target,
  Sparkles,
  ShieldCheck,
  Bot,
  Settings,
  Flame,
  X,
  ExternalLink,
  BrainCircuit
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Financial Twin', path: '/twin', icon: BrainCircuit, badge: 'Live' },
    { name: 'AI Decision Engine', path: '/decision', icon: Cpu, badge: 'Core' },
    { name: 'Opportunity Optimizer', path: '/optimizer', icon: SlidersHorizontal },
    { name: 'Portfolio', path: '/portfolio', icon: PieChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'What-If Simulator', path: '/simulator', icon: Flame, badge: '10Y' },
    { name: 'Risk Analysis', path: '/risk', icon: ShieldCheck },
    { name: 'AI Advisor', path: '/advisor', icon: Bot, badge: 'Explain' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <Link to="/landing" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-slate-100 font-mono text-base group-hover:text-cyan-400 transition-colors">
                FINARCH<span className="text-cyan-400">.AI</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-400">Autonomous Decision</span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Decision Platform
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-800 text-cyan-400 border border-cyan-500/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Landing / Hackathon Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <Link
            to="/landing"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Landing Page</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="mt-3 text-[10px] text-center text-slate-400">
            <span>FINARCH AI v1.0 • Hackathon Prototype</span>
          </div>
        </div>
      </aside>
    </>
  );
};
