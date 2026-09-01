import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { FinancialProfile } from '../types';
import {
  Layers,
  Save,
  RotateCcw,
  User,
  ArrowDown,
  ArrowRight,
  Shield,
  Activity,
  DollarSign,
  CreditCard,
  PieChart,
  Radio,
  CheckCircle2
} from 'lucide-react';

export const FinancialTwinPage: React.FC = () => {
  const { profile, updateProfile, resetDemoProfile, metrics, currency, isLoading } = useFinancial();

  const [formData, setFormData] = useState<FinancialProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<
    'inflow' | 'outflow' | 'assets' | 'liabilities' | 'sip' | 'risk'
  >('inflow');
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleInputChange = (field: keyof FinancialProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const tabs = [
    { id: 'inflow', label: '1. Monthly Inflow' },
    { id: 'outflow', label: '2. Monthly Expenses' },
    { id: 'assets', label: '3. Balance Sheet Assets' },
    { id: 'liabilities', label: '4. Liabilities & Debt' },
    { id: 'sip', label: '5. Systematic SIPs' },
    { id: 'risk', label: '6. Risk & Horizon' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-ping"></span>
              MODEL STATUS: LIVE
            </span>
            <span className="tech-label text-slate-400">FINANCIAL IDENTITY MODEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
            FINANCIAL DIGITAL TWIN
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoProfile}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all flex items-center gap-1.5"
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Recalculated' : 'Save & Recalculate'}</span>
          </button>
        </div>
      </div>

      {/* SIGNATURE VISUALIZATION: Central Financial Identity Tree */}
      <div className="fin-panel p-6 sm:p-8 grid-pattern relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <span className="tech-label text-slate-300">FINANCIAL IDENTITY ARCHITECTURE</span>
          <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-400">
            AUTONOMOUS TWIN ENGINE
          </span>
        </div>

        {/* Tree Topology Structure */}
        <div className="flex flex-col items-center space-y-4">
          {/* Top Node: YOU */}
          <div className="px-6 py-2.5 rounded-lg bg-obsidian-900 border border-white/[0.15] text-center shadow-panel">
            <span className="tech-label text-mint-400 block text-[9px]">ROOT IDENTITY</span>
            <span className="text-sm font-mono font-extrabold text-white">YOU (PRIMARY TWIN)</span>
          </div>

          <div className="w-0.5 h-4 bg-white/[0.15]"></div>

          {/* Middle 3 Branches: CASH | ASSETS | DEBT */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {/* CASH */}
            <div className="bg-obsidian-900 border border-white/[0.08] p-4 rounded-lg space-y-1">
              <span className="tech-label text-cyan-400">01. LIQUID CASH & SURPLUS</span>
              <span className="text-xl font-mono font-extrabold text-white block">
                {formatCurrency(metrics.total_liquid_cash, currency)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                +{formatCurrency(metrics.monthly_surplus, currency)}/mo surplus
              </span>
            </div>

            {/* ASSETS */}
            <div className="bg-obsidian-900 border border-mint-500/30 p-4 rounded-lg space-y-1">
              <span className="tech-label text-mint-400">02. TOTAL ASSET BASE</span>
              <span className="text-xl font-mono font-extrabold text-white block">
                {formatCurrency(metrics.total_investments + metrics.total_liquid_cash, currency)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Equity, Debt, Gold, FDs
              </span>
            </div>

            {/* DEBT */}
            <div className="bg-obsidian-900 border border-crimson-500/30 p-4 rounded-lg space-y-1">
              <span className="tech-label text-crimson-400">03. TOTAL LIABILITIES</span>
              <span className="text-xl font-mono font-extrabold text-white block">
                {formatCurrency(metrics.total_debt, currency)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {metrics.debt_to_income_pct}% DTI Ratio
              </span>
            </div>
          </div>

          <div className="w-0.5 h-4 bg-white/[0.15]"></div>

          {/* Bottom Convergence: FINANCIAL HEALTH & NET WORTH */}
          <div className="px-8 py-3 rounded-lg bg-obsidian-900 border border-mint-500/50 text-center shadow-mint-glow">
            <span className="tech-label text-mint-400 block text-[9px]">SYNTHESIZED POSITION</span>
            <span className="text-xl sm:text-2xl font-mono font-extrabold text-white tracking-tight">
              NET WORTH: {formatCurrency(metrics.net_worth, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* TABBED DIRECT EDITING FORM */}
      <form onSubmit={handleSave} className="fin-panel p-6 sm:p-8 space-y-6">
        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-mint-500 text-obsidian-950 font-bold shadow-sm'
                  : 'bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-white hover:bg-obsidian-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Monthly Inflow */}
        {activeTab === 'inflow' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="tech-label block mb-2 text-slate-300">Primary Monthly Salary</label>
              <input
                type="number"
                value={formData.salary_income}
                onChange={(e) => handleInputChange('salary_income', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Other Monthly Inflows</label>
              <input
                type="number"
                value={formData.other_income}
                onChange={(e) => handleInputChange('other_income', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Outflow */}
        {activeTab === 'outflow' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="tech-label block mb-2 text-slate-300">Rent / Housing</label>
              <input
                type="number"
                value={formData.rent_expense}
                onChange={(e) => handleInputChange('rent_expense', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Food & Dining</label>
              <input
                type="number"
                value={formData.food_expense}
                onChange={(e) => handleInputChange('food_expense', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Transport & Fuel</label>
              <input
                type="number"
                value={formData.transport_expense}
                onChange={(e) => handleInputChange('transport_expense', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Utilities & Bills</label>
              <input
                type="number"
                value={formData.utilities_expense}
                onChange={(e) => handleInputChange('utilities_expense', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Subscriptions</label>
              <input
                type="number"
                value={formData.subscriptions_expense}
                onChange={(e) => handleInputChange('subscriptions_expense', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Other Discretionary</label>
              <input
                type="number"
                value={formData.other_expenses}
                onChange={(e) => handleInputChange('other_expenses', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Balance Sheet Assets */}
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="tech-label block mb-2 text-slate-300">Emergency Fund</label>
              <input
                type="number"
                value={formData.emergency_fund}
                onChange={(e) => handleInputChange('emergency_fund', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Direct Equities / Stocks</label>
              <input
                type="number"
                value={formData.stocks_equity}
                onChange={(e) => handleInputChange('stocks_equity', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Mutual Funds</label>
              <input
                type="number"
                value={formData.mutual_funds}
                onChange={(e) => handleInputChange('mutual_funds', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Fixed Deposits</label>
              <input
                type="number"
                value={formData.fixed_deposits}
                onChange={(e) => handleInputChange('fixed_deposits', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Gold / SGBs</label>
              <input
                type="number"
                value={formData.gold_assets}
                onChange={(e) => handleInputChange('gold_assets', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Liquid Cash Balance</label>
              <input
                type="number"
                value={formData.cash_balance}
                onChange={(e) => handleInputChange('cash_balance', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Liabilities & Debt */}
        {activeTab === 'liabilities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="tech-label block mb-2 text-crimson-400">Credit Card Debt Balance</label>
              <input
                type="number"
                value={formData.credit_card_debt}
                onChange={(e) => handleInputChange('credit_card_debt', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-crimson-500/30 rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-crimson-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-crimson-400">Credit Card APR (%)</label>
              <input
                type="number"
                value={formData.credit_card_rate}
                onChange={(e) => handleInputChange('credit_card_rate', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-crimson-500/30 rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-crimson-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Personal Loan Balance</label>
              <input
                type="number"
                value={formData.personal_loan}
                onChange={(e) => handleInputChange('personal_loan', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Personal Loan Rate (%)</label>
              <input
                type="number"
                value={formData.personal_loan_rate}
                onChange={(e) => handleInputChange('personal_loan_rate', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Systematic SIPs */}
        {activeTab === 'sip' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="tech-label block mb-2 text-slate-300">Active Monthly SIP</label>
              <input
                type="number"
                value={formData.monthly_sip}
                onChange={(e) => handleInputChange('monthly_sip', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Emergency Target Months</label>
              <input
                type="number"
                value={formData.emergency_target_months}
                onChange={(e) => handleInputChange('emergency_target_months', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 6: Risk & Horizon */}
        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="tech-label block mb-2 text-slate-300">Stated Risk Tolerance</label>
              <select
                value={formData.risk_tolerance}
                onChange={(e) => handleInputChange('risk_tolerance', e.target.value)}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div>
              <label className="tech-label block mb-2 text-slate-300">Investment Horizon (Years)</label>
              <input
                type="number"
                value={formData.investment_horizon_years}
                onChange={(e) => handleInputChange('investment_horizon_years', Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-4 py-2.5 text-white font-mono text-sm focus:border-mint-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all"
          >
            Save & Update Digital Twin
          </button>
        </div>
      </form>
    </div>
  );
};
