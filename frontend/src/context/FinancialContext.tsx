import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinancialProfile, FinancialMetrics, FinancialHealthScoreBreakdown } from '../types';
import { ApiService } from '../services/api';
import { ClientFinancialEngine, DEFAULT_DEMO_PROFILE } from '../services/clientEngine';

interface ToastInfo {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
}

interface FinancialContextType {
  profile: FinancialProfile;
  metrics: FinancialMetrics;
  healthScore: FinancialHealthScoreBreakdown;
  currency: 'INR' | 'USD';
  isBackendConnected: boolean;
  isLoading: boolean;
  toasts: ToastInfo[];
  updateProfile: (newProfile: FinancialProfile) => Promise<void>;
  resetDemoProfile: () => Promise<void>;
  setCurrency: (c: 'INR' | 'USD') => void;
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<FinancialProfile>(DEFAULT_DEMO_PROFILE);
  const [metrics, setMetrics] = useState<FinancialMetrics>(ClientFinancialEngine.calculateMetrics(DEFAULT_DEMO_PROFILE));
  const [healthScore, setHealthScore] = useState<FinancialHealthScoreBreakdown>(ClientFinancialEngine.calculateHealthScore(DEFAULT_DEMO_PROFILE));
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const backendOk = await ApiService.checkBackend();
      setIsBackendConnected(backendOk);
      const prof = await ApiService.getProfile();
      setProfile(prof);
      setMetrics(ClientFinancialEngine.calculateMetrics(prof));
      setHealthScore(ClientFinancialEngine.calculateHealthScore(prof));
    } catch (e) {
      console.error('Failed to load profile:', e);
      const fallback = ApiService.getLocalProfile();
      setProfile(fallback);
      setMetrics(ClientFinancialEngine.calculateMetrics(fallback));
      setHealthScore(ClientFinancialEngine.calculateHealthScore(fallback));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateProfile = async (newProfile: FinancialProfile) => {
    setIsLoading(true);
    try {
      const updated = await ApiService.updateProfile(newProfile);
      setProfile(updated);
      setMetrics(ClientFinancialEngine.calculateMetrics(updated));
      setHealthScore(ClientFinancialEngine.calculateHealthScore(updated));
      showToast('Profile Updated', 'Financial Digital Twin successfully recalculated.', 'success');
    } catch (e) {
      console.error('Update profile error:', e);
      showToast('Error', 'Failed to update profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemoProfile = async () => {
    setIsLoading(true);
    try {
      const reset = await ApiService.resetToDemo();
      setProfile(reset);
      setMetrics(ClientFinancialEngine.calculateMetrics(reset));
      setHealthScore(ClientFinancialEngine.calculateHealthScore(reset));
      showToast('Demo Profile Loaded', 'Realistic hackathon demo financial data restored.', 'info');
    } catch (e) {
      console.error('Reset error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FinancialContext.Provider
      value={{
        profile,
        metrics,
        healthScore,
        currency,
        isBackendConnected,
        isLoading,
        toasts,
        updateProfile,
        resetDemoProfile,
        setCurrency,
        showToast,
        removeToast
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
