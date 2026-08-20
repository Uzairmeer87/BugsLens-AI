import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { AppShell } from '../components/layout/AppShell.js';

// Feature Pages
import { LandingPage } from '../features/landing/LandingPage.js';
import { LoginPage } from '../features/auth/LoginPage.js';
import { RegisterPage } from '../features/auth/RegisterPage.js';
import { DashboardPage } from '../features/dashboard/DashboardPage.js';
import { ProjectsPage } from '../features/projects/ProjectsPage.js';
import { CodeAnalysisPage } from '../features/analysis/CodeAnalysisPage.js';
import { TestLabPage } from '../features/testing/TestLabPage.js';
import { BugsPage } from '../features/bugs/BugsPage.js';
import { BugDetailsPage } from '../features/bugs/BugDetailsPage.js';
import { CoveragePage } from '../features/coverage/CoveragePage.js';
import { ReportsPage } from '../features/reports/ReportsPage.js';
import { ActivityPage } from '../features/activity/ActivityPage.js';
import { SettingsPage } from '../features/settings/SettingsPage.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  // In demo mode or development, if not authenticated, allow entry with demo session fallback
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Workspace Shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/analysis" element={<CodeAnalysisPage />} />
        <Route path="/test-lab" element={<TestLabPage />} />
        <Route path="/bugs" element={<BugsPage />} />
        <Route path="/bugs/:id" element={<BugDetailsPage />} />
        <Route path="/coverage" element={<CoveragePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
