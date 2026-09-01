import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Goal } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import {
  Target,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
  TrendingUp,
  X,
  ShieldAlert
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { profile, updateProfile, currency } = useFinancial();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState<Goal>({
    name: '',
    category: 'custom',
    target_amount: 500000,
    current_amount: 50000,
    target_year: 2029,
    monthly_contribution: 10000,
    priority: 'HIGH',
    is_essential: false
  });

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name.trim()) return;

    const updatedGoals = [...profile.goals, { ...newGoal, id: Date.now() }];
    await updateProfile({
      ...profile,
      goals: updatedGoals
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
      is_essential: false
    });
  };

  const handleDeleteGoal = async (goalId?: number) => {
    if (!goalId) return;
    const updated = profile.goals.filter((g) => g.id !== goalId);
    await updateProfile({
      ...profile,
      goals: updated
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              FINANCIAL <span className="text-cyan-400">GOALS</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Multi-Milestone Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Goal-based capital allocation with automated contribution sufficiency analysis.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Financial Goal</span>
        </button>
      </div>

      {/* Goal Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Goal Corpus Target</span>
          <span className="text-2xl font-mono font-bold text-slate-100 mt-1 block">
            {formatCurrency(
              profile.goals.reduce((acc, g) => acc + g.target_amount, 0),
              currency
            )}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">{profile.goals.length} Active Targets</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Current Accumulated Capital</span>
          <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">
            {formatCurrency(
              profile.goals.reduce((acc, g) => acc + g.current_amount, 0),
              currency
            )}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Avg Completion:{' '}
            {(
              profile.goals.reduce((acc, g) => acc + (g.current_amount / g.target_amount) * 100, 0) /
              (profile.goals.length || 1)
            ).toFixed(0)}
            %
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Monthly Allocation Velocity</span>
          <span className="text-2xl font-mono font-bold text-cyan-400 mt-1 block">
            {formatCurrency(
              profile.goals.reduce((acc, g) => acc + g.monthly_contribution, 0),
              currency
            )}
            /mo
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Combined Monthly SIP & Savings</span>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.goals.map((goal) => {
          const pct = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
          const yearsRemaining = Math.max(goal.target_year - 2026, 1);
          const monthsRemaining = yearsRemaining * 12;
          const shortfall = Math.max(goal.target_amount - goal.current_amount, 0);
          const reqMonthly = shortfall / monthsRemaining;
          const isOnTrack = goal.monthly_contribution >= reqMonthly;

          return (
            <div
              key={goal.id || goal.name}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        {goal.category}
                      </span>
                      {goal.priority === 'HIGH' && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">{goal.name}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-400 p-2 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Amount */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-2xl font-bold text-slate-100">
                      {formatCurrency(goal.current_amount, currency)}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Target: {formatCurrency(goal.target_amount, currency)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 75 ? 'bg-emerald-400' : pct >= 35 ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>{pct}% Complete</span>
                    <span>Shortfall: {formatCurrency(shortfall, currency)}</span>
                  </div>
                </div>

                {/* Contribution & Sufficiency Analysis */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Target Year</span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-0.5 block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {goal.target_year} ({yearsRemaining} yrs left)
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Monthly Contribution</span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-0.5 block">
                      {formatCurrency(goal.monthly_contribution, currency)}/mo
                    </span>
                  </div>
                </div>
              </div>

              {/* Status footer badge */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                {isOnTrack ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>On Track for {goal.target_year} Milestone</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Need +{formatCurrency(reqMonthly - goal.monthly_contribution, currency)}/mo to stay on track</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD GOAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl max-w-lg w-full relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <Target className="w-4 h-4" />
              <span>Create New Financial Milestone</span>
            </div>

            <h3 className="text-xl font-bold text-slate-100 mt-1">Add Financial Goal</h3>

            <form onSubmit={handleAddGoal} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leh-Ladakh Expedition or Home Downpayment"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, current_amount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Milestone Year</label>
                  <input
                    type="number"
                    min="2026"
                    max="2060"
                    value={newGoal.target_year}
                    onChange={(e) => setNewGoal({ ...newGoal, target_year: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Monthly Contribution (₹)</label>
                  <input
                    type="number"
                    value={newGoal.monthly_contribution}
                    onChange={(e) => setNewGoal({ ...newGoal, monthly_contribution: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Goal Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="emergency">Emergency Reserve</option>
                    <option value="vehicle">Vehicle / Mobility</option>
                    <option value="home">Home / Real Estate</option>
                    <option value="retirement">Retirement Corpus</option>
                    <option value="education">Higher Education</option>
                    <option value="wealth">Wealth Creation</option>
                    <option value="custom">Custom Goal</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-glow-cyan"
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
