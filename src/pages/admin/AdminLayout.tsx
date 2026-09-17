import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Cpu,
  FolderGit2,
  Briefcase,
  Layers,
  Share2,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Moon,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/profile', label: 'Profile & Bio', icon: User },
    { to: '/admin/skills', label: 'Skills & Stack', icon: Cpu },
    { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/admin/experience', label: 'Experience', icon: Briefcase },
    { to: '/admin/services', label: 'Services', icon: Layers },
    { to: '/admin/socials', label: 'Dynamic Socials', icon: Share2 },
    { to: '/admin/messages', label: 'Messages Inbox', icon: Inbox },
    { to: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white font-bold flex items-center justify-center text-sm">
            VP
          </div>
          <span className="font-bold text-sm">Firebase Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand & Site Preview link */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-base shadow-md shadow-brand-500/20">
                VP
              </div>
              <div>
                <h1 className="font-bold text-sm text-slate-900 dark:text-white">
                  Vinayak Padole
                </h1>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Firebase Admin</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Preview Action */}
          <div className="px-4 py-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-semibold hover:bg-brand-100 transition-colors border border-brand-200/50 dark:border-brand-900/50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Area: User & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Firebase Auth</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block max-w-[140px]" title={user?.email || ''}>
                {user?.email || 'admin'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};
