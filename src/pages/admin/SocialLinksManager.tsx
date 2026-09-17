import React, { useState, useEffect } from 'react';
import { SocialLink } from '../../types';
import { getSocials, saveSocials, deleteSocial } from '../../firebase/services';
import { formatSocialUrl } from '../../utils/api';
import { DynamicIcon } from '../../utils/icons';
import {
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const SocialLinksManager: React.FC = () => {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSocialsList = async () => {
    try {
      const res = await getSocials();
      setSocials(res);
    } catch (err) {
      console.error('Failed to load social links from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialsList();
  }, []);

  const handleUrlChange = (id: string, newUrl: string) => {
    setSocials(socials.map(s => (s.id === id ? { ...s, url: newUrl } : s)));
  };

  const handleToggleVisibility = (id: string) => {
    setSocials(socials.map(s => (s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const handleAddPlatform = () => {
    const platform = prompt('Enter platform name (e.g. Medium, Discord, Dribbble):');
    if (!platform || !platform.trim()) return;

    const newLink: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: platform.trim(),
      url: '',
      label: platform.trim(),
      icon: platform.trim(),
      visible: true,
      sortOrder: socials.length + 1
    };

    setSocials([...socials, newLink]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this social platform record from Firestore?')) return;
    try {
      await deleteSocial(id);
      setSocials(socials.filter(s => s.id !== id));
      setNotification({ type: 'success', message: 'Social platform removed from Firestore.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete platform.' });
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setNotification(null);

    try {
      const updated = await saveSocials(socials);
      setSocials(updated);
      setNotification({
        type: 'success',
        message: 'Social links saved to Firestore! Only platforms with active toggle AND valid URL will render on the live website.'
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save socials in Firestore.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const activeCount = socials.filter(s => s.visible && s.url && s.url.trim() !== '').length;

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dynamic Social Links (Firestore)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control which social profiles appear publicly in Hero, Footer, and Contact sections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddPlatform}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Custom Platform
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving to Firestore...' : 'Save All Links'}
          </button>
        </div>
      </div>

      {/* Dynamic Social Rule Info Box */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Dynamic Visibility System:</span> If a platform is disabled (OFF) or has an empty URL, its icon is <strong>never rendered</strong> on the public website. When you enter a URL and toggle ON, it automatically appears everywhere!
        </div>
      </div>

      {/* Notification */}
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

      {/* Social Platforms List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
        {socials.map((social) => {
          const isLive = social.visible && social.url && social.url.trim() !== '';

          return (
            <div
              key={social.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                !social.visible ? 'opacity-60 bg-slate-50/50 dark:bg-slate-950/30' : ''
              }`}
            >
              {/* Platform Info */}
              <div className="flex items-center gap-3.5 sm:w-1/4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isLive ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <DynamicIcon name={social.icon || social.platform} size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {social.platform}
                  </div>
                  <div className="text-[11px] font-medium">
                    {isLive ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        ● Visible Publicly
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        ○ Hidden from Public
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={social.url || ''}
                    onChange={(e) => handleUrlChange(social.id, e.target.value)}
                    placeholder={
                      social.platform.toLowerCase() === 'whatsapp'
                        ? 'Phone number (e.g. +91 98765 43210)'
                        : social.platform.toLowerCase() === 'email'
                        ? 'Email address (e.g. contact@vinayakpadole.dev)'
                        : `https://${social.platform.toLowerCase()}.com/username`
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  {social.url && (
                    <a
                      href={formatSocialUrl(social.platform, social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-500"
                      title="Test Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Toggle Switch & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-1/4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={social.visible}
                    onChange={() => handleToggleVisibility(social.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {social.visible ? 'ON' : 'OFF'}
                  </span>
                </label>

                <button
                  onClick={() => handleDelete(social.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview Summary */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Live Public Icons Preview ({activeCount} Active)
        </h3>
        
        {activeCount > 0 ? (
          <div className="flex flex-wrap gap-3">
            {socials
              .filter(s => s.visible && s.url && s.url.trim() !== '')
              .map(s => (
                <div
                  key={s.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <DynamicIcon name={s.icon || s.platform} size={16} className="text-brand-500" />
                  <span>{s.platform}</span>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            No social icons will render on the public website until a URL is entered and turned ON.
          </div>
        )}
      </div>

    </div>
  );
};
