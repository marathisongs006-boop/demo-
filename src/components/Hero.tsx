import React from 'react';
import { ArrowRight, Sparkles, Send } from 'lucide-react';
import { Profile, SocialLink } from '../types';
import { DynamicIcon } from '../utils/icons';
import { formatSocialUrl } from '../utils/api';

interface HeroProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

export const Hero: React.FC<HeroProps> = ({ profile, socialLinks }) => {
  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Intro & Headline */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Availability Badge (Controlled from Admin) */}
            {profile.availabilityEnabled && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>{profile.availabilityText || 'Available for Freelance & Full-Time'}</span>
              </div>
            )}

            {/* Main Greeting & Name */}
            <div className="space-y-2">
              <div className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span>Hi there 👋, I'm</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {profile.fullName || 'Vinayak Padole'}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-500 to-amber-500 bg-clip-text text-transparent">
                  {profile.professionalTitle || 'Web Developer'}
                </span>
                <span className="hidden sm:inline-block w-12 h-[2px] bg-brand-400/60 rounded-full" />
              </div>
            </div>

            {/* Short Intro */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {profile.shortIntro || 'I build modern, responsive and user-friendly websites and web applications.'}
            </p>

            {/* CTAs: "View My Work" & "Contact Me" */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Contact Me</span>
                <Send className="w-4 h-4 text-brand-500" />
              </a>
            </div>

            {/* Dynamic Social Links (Render ONLY when enabled and has valid URL) */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 w-full max-w-md">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Connect With Me
                </p>
                <div className="flex items-center flex-wrap gap-2.5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={formatSocialUrl(social.platform, social.url)}
                      target={social.platform.toLowerCase() === 'email' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={social.label || social.platform}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 dark:hover:bg-brand-500 text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white border border-slate-200/80 dark:border-slate-700 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <DynamicIcon name={social.icon || social.platform} size={18} />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Split Portrait with Decorative Orange Shape */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Decorative Geometric Orange Shapes */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-br from-brand-500 to-amber-500 -rotate-3 opacity-90 transition-transform group-hover:rotate-0" />
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-slate-900 dark:bg-slate-800 rotate-2 opacity-50 -z-10" />

              {/* Portrait Container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 aspect-[4/5] flex items-center justify-center">
                {profile.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt={profile.fullName || 'Vinayak Padole'}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-brand-100 to-amber-50 dark:from-slate-800 dark:to-slate-900 text-brand-600">
                    <Sparkles className="w-16 h-16 mb-2 text-brand-500" />
                    <span className="font-bold text-xl text-slate-800 dark:text-white">{profile.fullName}</span>
                    <span className="text-sm text-slate-500">{profile.professionalTitle}</span>
                  </div>
                )}

                {/* Floating Experience Badge */}
                {profile.yearsOfExperience && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Experience</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        {profile.yearsOfExperience} in Web Dev
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-sm">
                      VP
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
