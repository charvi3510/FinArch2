import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinancialProvider } from './context/FinancialContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { FinancialTwinPage } from './pages/FinancialTwinPage';
import { DecisionEnginePage } from './pages/DecisionEnginePage';
import { OptimizerPage } from './pages/OptimizerPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { GoalsPage } from './pages/GoalsPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <FinancialProvider>
      <HashRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/landing" element={<LandingPage />} />

          {/* App Dashboard Routes wrapped in AppLayout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="twin" element={<FinancialTwinPage />} />
            <Route path="decision" element={<DecisionEnginePage />} />
            <Route path="optimizer" element={<OptimizerPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="simulator" element={<WhatIfSimulatorPage />} />
            <Route path="risk" element={<RiskAnalysisPage />} />
            <Route path="advisor" element={<AdvisorPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </HashRouter>
    </FinancialProvider>
  );
}

export default App;
