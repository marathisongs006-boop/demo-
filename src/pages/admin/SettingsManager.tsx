import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { getSiteSettings, updateSiteSettings } from '../../firebase/services';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../firebase/config';
import {
  Save,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [pwdNotification, setPwdNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSiteSettings();
        setSettings(res);
      } catch (err) {
        console.error('Failed to load settings from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setNotification(null);

    try {
      const res = await updateSiteSettings(settings);
      setSettings(res);
      setNotification({ type: 'success', message: 'Site settings saved to Cloud Firestore!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save settings in Firestore.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdNotification(null);

    if (newPassword !== confirmPassword) {
      setPwdNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPwdNotification({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    if (!auth.currentUser || !auth.currentUser.email) {
      setPwdNotification({ type: 'error', message: 'No authenticated Firebase user found.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Re-authenticate with current password before updating
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setPwdNotification({ type: 'success', message: 'Firebase Admin password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password change error:', err);
      let msg = 'Failed to change password in Firebase Auth.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Current password is incorrect.';
      } else if (err.message) {
        msg = err.message;
      }
      setPwdNotification({ type: 'error', message: msg });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Site Settings & Security (Firebase)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure site metadata stored in Firestore, brand settings, and Firebase Admin credentials.
        </p>
      </div>

      {/* SEO & Site Settings Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Globe className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            General & SEO Settings (Firestore)
          </h2>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Browser Tab Title
            </label>
            <input
              type="text"
              name="siteTitle"
              required
              value={settings.siteTitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Search Engine Meta Description
            </label>
            <textarea
              name="metaDescription"
              rows={3}
              required
              value={settings.metaDescription}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="accentColor"
                  value={settings.accentColor || '#f97316'}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={settings.accentColor || '#f97316'}
                  onChange={handleChange}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Theme Mode
              </label>
              <select
                name="theme"
                value={settings.theme || 'system'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="system">System Preference</option>
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Footer Copyright Text
            </label>
            <input
              type="text"
              name="copyrightText"
              value={settings.copyrightText}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving to Firestore...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Security Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <KeyRound className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Change Firebase Admin Password
          </h2>
        </div>

        {pwdNotification && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              pwdNotification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            {pwdNotification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{pwdNotification.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              {isChangingPassword ? 'Updating in Firebase...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
