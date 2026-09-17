import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  Layers,
  Inbox,
  ArrowRight,
  ExternalLink,
  Plus,
  Eye,
  Sparkles,
  Loader2
} from 'lucide-react';
import {
  getProjects,
  getSkills,
  getServices,
  getContactMessages,
  getProfile
} from '../../firebase/services';
import { Profile, ContactMessage } from '../../types';

export const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [counts, setCounts] = useState({
    projects: 0,
    publishedProjects: 0,
    skills: 0,
    services: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prof, projs, skls, servs, msgs] = await Promise.all([
          getProfile(),
          getProjects(),
          getSkills(),
          getServices(),
          getContactMessages()
        ]);

        setProfile(prof);
        setCounts({
          projects: projs.length,
          publishedProjects: projs.filter(p => p.visible).length,
          skills: skls.length,
          services: servs.length,
          messages: msgs.length,
          unreadMessages: msgs.filter(m => m.status === 'unread').length
        });
        setRecentMessages(msgs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load Firestore stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Firestore Projects',
      value: counts.projects,
      sub: `${counts.publishedProjects} published`,
      icon: FolderGit2,
      link: '/admin/projects',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40'
    },
    {
      title: 'Skills & Stack',
      value: counts.skills,
      sub: 'Stored in Cloud Firestore',
      icon: Cpu,
      link: '/admin/skills',
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/40'
    },
    {
      title: 'Active Services',
      value: counts.services,
      sub: 'Specialized offerings',
      icon: Layers,
      link: '/admin/services',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'Contact Messages',
      value: counts.messages,
      sub: `${counts.unreadMessages} unread inquiries`,
      icon: Inbox,
      link: '/admin/messages',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-500 to-amber-500 text-white shadow-xl shadow-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Cloud Firestore Connected
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {profile?.fullName || 'Vinayak Padole'}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            Live production database on Firebase. Manage projects, skills, and portfolio content in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white text-brand-600 hover:bg-slate-50 font-bold text-xs shadow-md inline-flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {card.value}
            </div>

            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              {card.title}
            </div>

            <div className="text-[11px] text-slate-400 mt-0.5">
              {card.sub}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Actions Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/projects"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 text-left transition-all group"
            >
              <Plus className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Project</div>
              <div className="text-[11px] text-slate-400">Save to Firestore & Storage</div>
            </Link>

            <Link
              to="/admin/skills"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 text-left transition-all group"
            >
              <Cpu className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Manage Skills</div>
              <div className="text-[11px] text-slate-400">Update stack & percentages</div>
            </Link>

            <Link
              to="/admin/socials"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 text-left transition-all group"
            >
              <Sparkles className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Dynamic Socials</div>
              <div className="text-[11px] text-slate-400">Toggle WhatsApp, LinkedIn</div>
            </Link>

            <Link
              to="/admin/profile"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 text-left transition-all group"
            >
              <Eye className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Update Profile</div>
              <div className="text-[11px] text-slate-400">Bio, portrait & resume</div>
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Visitor Inquiries (Firestore)
            </h2>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
            >
              View all messages ({counts.messages}) →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.name}
                      </span>
                      <span className="text-[11px] text-slate-400">({msg.email})</span>
                      {msg.status === 'unread' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                      {msg.subject}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No contact inquiries in Firestore yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
