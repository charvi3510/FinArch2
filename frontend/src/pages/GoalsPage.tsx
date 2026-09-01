import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Goal } from '../types';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
  Clock,
  Sparkles
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { profile, updateProfile, currency, isLoading } = useFinancial();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState<Goal>({
    name: '',
    category: 'custom',
    target_amount: 500000,
    current_amount: 50000,
    target_year: 2029,
    monthly_contribution: 10000,
    priority: 'HIGH',
    is_essential: false,
  });

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name.trim()) return;

    const updatedGoals = [...profile.goals, { ...newGoal, id: Date.now() }];
    await updateProfile({
      ...profile,
      goals: updatedGoals,
    });
    setIsAddModalOpen(false);
    setNewGoal({
      name: '',
      category: 'custom',
      target_amount: 500000,
      current_amount: 50000,
      target_year: 2029,
      monthly_contribution: 10000,
      priority: 'HIGH',
      is_essential: false,
    });
  };

  const handleDeleteGoal = async (goalId?: number) => {
    if (!goalId) return;
    const updated = profile.goals.filter((g) => g.id !== goalId);
    await updateProfile({
      ...profile,
      goals: updated,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              FINANCIAL MISSIONS
            </span>
            <span className="tech-label text-slate-400">CAPITAL VELOCITY TRACKER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            GOALS & MILESTONES
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-1.5 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Financial Goal</span>
        </button>
      </div>

      {/* HORIZONTAL MISSION TRAJECTORIES */}
      <div className="space-y-4">
        {profile.goals.map((goal) => {
          const completion =
            goal.completion_percentage ||
            (goal.target_amount > 0
              ? Math.round((goal.current_amount / goal.target_amount) * 100)
              : 0);

          const monthsLeft = Math.max((goal.target_year - 2026) * 12, 1);
          const remainingAmt = Math.max(goal.target_amount - goal.current_amount, 0);
          const requiredMonthly = Math.round(remainingAmt / monthsLeft);
          const isAhead = goal.monthly_contribution > requiredMonthly * 1.1;
          const isOnTrack = goal.monthly_contribution >= requiredMonthly;

          const statusBadge = isAhead ? (
            <span className="tech-badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AHEAD OF TARGET
            </span>
          ) : isOnTrack ? (
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              ON TRACK
            </span>
          ) : (
            <span className="tech-badge bg-crimson-500/10 text-crimson-400 border border-crimson-500/30">
              AT RISK (GAP: {formatCurrency(requiredMonthly - goal.monthly_contribution, currency)}/mo)
            </span>
          );

          return (
            <div
              key={goal.id || goal.name}
              className="fin-panel p-6 space-y-4 relative overflow-hidden group hover:border-white/[0.18] transition-all"
            >
              {/* Top Meta Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-obsidian-900 border border-white/[0.1] flex items-center justify-center text-mint-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                      {goal.name}
                    </h3>
                    <span className="tech-label text-[10px] text-slate-400">
                      TARGET: {formatCurrency(goal.target_amount, currency)} • YEAR {goal.target_year}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {statusBadge}
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Delete goal"
                    className="p-1.5 rounded-md bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-crimson-400 hover:border-crimson-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* HORIZONTAL PROGRESS TRAJECTORY */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Saved: <strong className="text-white">{formatCurrency(goal.current_amount, currency)}</strong>
                  </span>
                  <span className="font-extrabold text-mint-400">{completion}% ACCUMULATED</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-obsidian-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOnTrack ? 'bg-mint-500' : 'bg-crimson-500'
                    }`}
                    style={{ width: `${Math.min(completion, 100)}%` }}
                  />
                </div>
              </div>

              {/* 3 Mission Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-obsidian-900 border border-white/[0.06] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">CURRENT MONTHLY SIP</span>
                  <span className="text-sm font-mono font-bold text-white mt-0.5 block">
                    {formatCurrency(goal.monthly_contribution, currency)}/mo
                  </span>
                </div>

                <div className="bg-obsidian-900 border border-white/[0.06] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">REQUIRED SUFFICIENCY</span>
                  <span className="text-sm font-mono font-bold text-cyan-400 mt-0.5 block">
                    {formatCurrency(requiredMonthly, currency)}/mo
                  </span>
                </div>

                <div className="bg-obsidian-900 border border-white/[0.06] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">TIME TO MILESTONE</span>
                  <span className="text-sm font-mono font-bold text-white mt-0.5 block">
                    {monthsLeft} Months Left
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD GOAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fin-panel p-6 sm:p-8 max-w-lg w-full border border-mint-500/40 space-y-5 shadow-mint-glow animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-mint-400" />
                <h3 className="text-base font-bold font-mono text-white">CREATE FINANCIAL MISSION</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs font-mono">
              <div>
                <label className="tech-label block mb-1 text-slate-300">Mission / Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leh-Ladakh Expedition or Home Downpayment"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-3.5 py-2.5 text-white text-sm focus:border-mint-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="tech-label block mb-1 text-slate-300">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: Number(e.target.value) })}
                    className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-3 py-2 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="tech-label block mb-1 text-slate-300">Current Saved (₹)</label>
                  <input
                    type="number"
                    required
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, current_amount: Number(e.target.value) })}
                    className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-3 py-2 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="tech-label block mb-1 text-slate-300">Target Year</label>
                  <input
                    type="number"
                    required
                    min="2026"
                    max="2050"
                    value={newGoal.target_year}
                    onChange={(e) => setNewGoal({ ...newGoal, target_year: Number(e.target.value) })}
                    className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-3 py-2 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="tech-label block mb-1 text-slate-300">Monthly Contribution (₹)</label>
                  <input
                    type="number"
                    required
                    value={newGoal.monthly_contribution}
                    onChange={(e) => setNewGoal({ ...newGoal, monthly_contribution: Number(e.target.value) })}
                    className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-3 py-2 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-obsidian-900 border border-white/[0.12] text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-bold text-xs shadow-mint-glow transition-all"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
