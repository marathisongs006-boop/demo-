import React from 'react';
import { Profile, SocialLink, SiteSettings } from '../types';
import { DynamicIcon } from '../utils/icons';
import { formatSocialUrl } from '../utils/api';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  profile: Profile;
  socialLinks: SocialLink[];
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ profile, socialLinks, siteSettings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-brand-500/20">
                VP
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {profile.fullName || 'Vinayak Padole'}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {profile.shortIntro || 'Building modern, performant, and responsive web applications with precision.'}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Navigation
            </div>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-brand-400 transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-brand-400 transition-colors">Skills & Stack</a></li>
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Projects</a></li>
              <li><a href="#experience" className="hover:text-brand-400 transition-colors">Experience</a></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Follow & Connect
            </div>
            {socialLinks && socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={formatSocialUrl(social.platform, social.url)}
                    target={social.platform.toLowerCase() === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.label || social.platform}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-brand-500 text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5 border border-slate-700/60"
                  >
                    <DynamicIcon name={social.icon || social.platform} size={18} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active social accounts configured.</p>
            )}

            <div className="pt-2">
              <a
                href="/admin"
                className="text-xs text-slate-500 hover:text-brand-400 transition-colors underline"
              >
                Admin CMS Login →
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            {siteSettings.copyrightText || `© ${new Date().getFullYear()} Vinayak Padole. All rights reserved.`}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors group"
          >
            <span>Back to top</span>
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
