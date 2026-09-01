import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Sliders,
  PieChart,
  Target,
  GitCompare,
  ShieldAlert,
  Bot,
  Settings,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { path: '/twin', label: 'FINANCIAL TWIN', icon: Layers },
    { path: '/decision', label: 'DECISION ENGINE', icon: Cpu, isSignature: true },
    { path: '/optimizer', label: 'OPTIMIZER', icon: Sliders },
    { path: '/portfolio', label: 'PORTFOLIO', icon: PieChart },
    { path: '/goals', label: 'GOALS', icon: Target },
    { path: '/simulator', label: 'SIMULATOR', icon: GitCompare },
    { path: '/risk', label: 'RISK ANALYSIS', icon: ShieldAlert },
    { path: '/advisor', label: 'AI ADVISOR', icon: Bot },
    { path: '/settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-obsidian-950 border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <NavLink to="/landing" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-obsidian-900 border border-mint-500/30 flex items-center justify-center text-mint-400 group-hover:border-mint-500 transition-colors">
                <Activity className="w-4 h-4 text-mint-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-white tracking-wider font-mono">FINARCH</span>
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-mint-500/10 text-mint-400 border border-mint-500/20 font-bold">AI</span>
                </div>
                <span className="tech-label block text-[9px] text-slate-400">FINANCIAL INTELLIGENCE</span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 tech-label text-slate-400">COMMAND CENTER</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono tracking-wider transition-all relative ${
                    isActive
                      ? 'bg-obsidian-850 text-white font-bold border-l-2 border-mint-500 pl-2.5 shadow-panel'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-mint-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.isSignature && (
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse"></span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Engine Online Status Badge */}
        <div className="p-4 border-t border-white/[0.08] bg-obsidian-900/50">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="tech-label text-slate-400">SYSTEM STATUS</span>
            <span className="text-[10px] font-semibold text-mint-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-mint-500 animate-ping"></span>
              ONLINE
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Autonomous Engine 1.0</p>
        </div>
      </aside>
    </>
  );
};
