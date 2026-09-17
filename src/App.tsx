import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProfileManager } from './pages/admin/ProfileManager';
import { SkillsManager } from './pages/admin/SkillsManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { ExperienceManager } from './pages/admin/ExperienceManager';
import { ServicesManager } from './pages/admin/ServicesManager';
import { SocialLinksManager } from './pages/admin/SocialLinksManager';
import { MessagesManager } from './pages/admin/MessagesManager';
import { SettingsManager } from './pages/admin/SettingsManager';
import { useAuth } from './context/AuthContext';
import { Loader2, ShieldAlert, LogOut } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAuthorized, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Your Firebase account UID (<span className="font-mono text-xs text-amber-400">{user.uid}</span>) is not authorized to access this administration panel. Only the authorized administrator UID can access this portal.
        </p>
        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-lg shadow-red-500/25"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Firebase
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin CMS Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfileManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="experience" element={<ExperienceManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="socials" element={<SocialLinksManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
