import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { FinancialProfile } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import {
  BrainCircuit,
  Save,
  RotateCcw,
  DollarSign,
  TrendingDown,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Shield,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const FinancialTwinPage: React.FC = () => {
  const { profile, metrics, updateProfile, resetDemoProfile, currency, isLoading } = useFinancial();
  const [formData, setFormData] = useState<FinancialProfile>(profile);
  const [activeTab, setActiveTab] = useState<'income' | 'expenses' | 'assets' | 'liabilities' | 'sip' | 'risk'>('income');

  // Handle number input changes
  const handleInputChange = (field: keyof FinancialProfile, val: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof val === 'string' ? parseFloat(val) || 0 : val
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleReset = async () => {
    await resetDemoProfile();
    setFormData(profile);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              FINANCIAL <span className="text-cyan-400">DIGITAL TWIN</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete mathematical replication of your balance sheet, cash flows, liabilities, and risk appetite.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Profile</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Twin</span>
          </button>
        </div>
      </div>

      {/* Live Twin Calculated Metrics Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Calculated Net Worth</span>
          <span className="text-lg sm:text-xl font-mono font-bold text-cyan-400 mt-1 block">
            {formatCurrency(metrics.net_worth, currency)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Monthly Surplus</span>
          <span className="text-lg sm:text-xl font-mono font-bold text-emerald-400 mt-1 block">
            {formatCurrency(metrics.monthly_surplus, currency)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Savings Rate</span>
          <span className="text-lg sm:text-xl font-mono font-bold text-purple-400 mt-1 block">
            {metrics.savings_rate_pct}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Emergency Buffer</span>
          <span className="text-lg sm:text-xl font-mono font-bold text-amber-400 mt-1 block">
            {metrics.emergency_fund_coverage_months} Months
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Debt-to-Income (DTI)</span>
          <span className="text-lg sm:text-xl font-mono font-bold text-rose-400 mt-1 block">
            {metrics.debt_to_income_pct}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Equity Allocation</span>
          <span className="text-lg sm:text-xl font-mono font-bold text-blue-400 mt-1 block">
            {metrics.equity_allocation_pct}%
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'income', label: '1. Inflow & Income', icon: DollarSign },
          { id: 'expenses', label: '2. Monthly Expenses', icon: TrendingDown },
          { id: 'assets', label: '3. Assets & Savings', icon: PiggyBank },
          { id: 'liabilities', label: '4. Liabilities & Debt', icon: CreditCard },
          { id: 'sip', label: '5. Systematic Investments', icon: TrendingUp },
          { id: 'risk', label: '6. Risk & Horizons', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Income */}
        {activeTab === 'income' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Monthly Inflows & Revenue</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Primary Take-Home Salary (₹ / Month)
                </label>
                <input
                  type="number"
                  value={formData.salary_income}
                  onChange={(e) => handleInputChange('salary_income', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 font-mono text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Net in-hand salary credited after taxes</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Other / Freelance / Rental Income (₹ / Month)
                </label>
                <input
                  type="number"
                  value={formData.other_income}
                  onChange={(e) => handleInputChange('other_income', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 font-mono text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Secondary recurring inflows</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Total Monthly Inflow</span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {formatFullCurrency(formData.salary_income + formData.other_income, currency)}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Expenses */}
        {activeTab === 'expenses' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-400" />
              <span>Monthly Expense Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">House Rent / Maintenance</label>
                <input
                  type="number"
                  value={formData.rent_expense}
                  onChange={(e) => handleInputChange('rent_expense', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Groceries & Dining</label>
                <input
                  type="number"
                  value={formData.food_expense}
                  onChange={(e) => handleInputChange('food_expense', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Transport & Fuel</label>
                <input
                  type="number"
                  value={formData.transport_expense}
                  onChange={(e) => handleInputChange('transport_expense', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Electricity, Water, Wi-Fi</label>
                <input
                  type="number"
                  value={formData.utilities_expense}
                  onChange={(e) => handleInputChange('utilities_expense', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">OTT & Subscriptions</label>
                <input
                  type="number"
                  value={formData.subscriptions_expense}
                  onChange={(e) => handleInputChange('subscriptions_expense', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Discretionary / Misc</label>
                <input
                  type="number"
                  value={formData.other_expenses}
                  onChange={(e) => handleInputChange('other_expenses', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Total Monthly Outflows</span>
              <span className="text-xl font-mono font-bold text-amber-400">
                {formatFullCurrency(
                  formData.rent_expense +
                    formData.food_expense +
                    formData.transport_expense +
                    formData.utilities_expense +
                    formData.subscriptions_expense +
                    formData.other_expenses,
                  currency
                )}
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Assets */}
        {activeTab === 'assets' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-cyan-400" />
              <span>Liquid Assets & Portfolio Reserves</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Liquid Savings Bank Balance</label>
                <input
                  type="number"
                  value={formData.bank_savings}
                  onChange={(e) => handleInputChange('bank_savings', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Dedicated Emergency Fund</label>
                <input
                  type="number"
                  value={formData.emergency_fund}
                  onChange={(e) => handleInputChange('emergency_fund', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Direct Stocks / Equities</label>
                <input
                  type="number"
                  value={formData.stocks_equity}
                  onChange={(e) => handleInputChange('stocks_equity', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Mutual Funds Portfolio</label>
                <input
                  type="number"
                  value={formData.mutual_funds}
                  onChange={(e) => handleInputChange('mutual_funds', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Fixed Deposits (FD)</label>
                <input
                  type="number"
                  value={formData.fixed_deposits}
                  onChange={(e) => handleInputChange('fixed_deposits', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Gold / Sovereign Gold Bonds</label>
                <input
                  type="number"
                  value={formData.gold_assets}
                  onChange={(e) => handleInputChange('gold_assets', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Liabilities */}
        {activeTab === 'liabilities' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-400" />
              <span>Liabilities, Loans & Borrowings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Revolving Credit Card Debt (Highest Carry Cost)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Principal Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.credit_card_debt}
                      onChange={(e) => handleInputChange('credit_card_debt', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Interest Rate (% APR)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.credit_card_rate}
                      onChange={(e) => handleInputChange('credit_card_rate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Personal Loan
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Outstanding Balance (₹)</label>
                    <input
                      type="number"
                      value={formData.personal_loan}
                      onChange={(e) => handleInputChange('personal_loan', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.personal_loan_rate}
                      onChange={(e) => handleInputChange('personal_loan_rate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  Auto / Vehicle Loan
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Outstanding Balance (₹)</label>
                    <input
                      type="number"
                      value={formData.vehicle_loan}
                      onChange={(e) => handleInputChange('vehicle_loan', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vehicle_loan_rate}
                      onChange={(e) => handleInputChange('vehicle_loan_rate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                  Home Loan / Mortgage
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Outstanding Balance (₹)</label>
                    <input
                      type="number"
                      value={formData.home_loan}
                      onChange={(e) => handleInputChange('home_loan', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.home_loan_rate}
                      onChange={(e) => handleInputChange('home_loan_rate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: SIP */}
        {activeTab === 'sip' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Systematic Investment Plan (SIP)</span>
            </h3>

            <div className="max-w-md">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Monthly Mutual Fund SIP Commitment (₹)
              </label>
              <input
                type="number"
                value={formData.monthly_sip}
                onChange={(e) => handleInputChange('monthly_sip', e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 font-mono text-base focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Automatically deducted monthly for equity & debt funds
              </span>
            </div>
          </div>
        )}

        {/* Tab 6: Risk */}
        {activeTab === 'risk' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Risk Tolerance & Strategy Preferences</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'conservative',
                  title: 'Conservative',
                  desc: 'Capital preservation priority. Low tolerance for drawdown. Maximum debt & fixed income bias.'
                },
                {
                  id: 'moderate',
                  title: 'Moderate',
                  desc: 'Balanced growth. Comfortable with normal market cycles. Balanced equity & debt mix.'
                },
                {
                  id: 'aggressive',
                  title: 'Aggressive',
                  desc: 'High compounding growth focus. 7+ year horizon. Comfortable with 25%+ market volatility.'
                }
              ].map((r) => (
                <div
                  key={r.id}
                  onClick={() => setFormData((prev) => ({ ...prev, risk_tolerance: r.id as any }))}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    formData.risk_tolerance === r.id
                      ? 'bg-cyan-500/15 border-cyan-500/40 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-slate-100">{r.title}</span>
                    {formData.risk_tolerance === r.id && (
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Target Emergency Reserve (Months of Living Expenses)
                </label>
                <input
                  type="number"
                  value={formData.emergency_target_months}
                  onChange={(e) => handleInputChange('emergency_target_months', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Primary Investment Horizon (Years)
                </label>
                <input
                  type="number"
                  value={formData.investment_horizon_years}
                  onChange={(e) => handleInputChange('investment_horizon_years', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button at bottom */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Digital Twin</span>
          </button>
        </div>
      </form>
    </div>
  );
};
