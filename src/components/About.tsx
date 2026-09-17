import React from 'react';
import { FileText, CheckCircle2, Code2, Globe, Sparkles, MapPin, Mail, Phone } from 'lucide-react';
import { Profile } from '../types';

interface AboutProps {
  profile: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const highlights = [
    'Clean, semantic, and accessible frontend code architecture',
    'Responsive cross-device user interface design & animations',
    'Fast REST API integration and full-stack performance tuning',
    'Modern component-driven development with React & TypeScript'
  ];

  return (
    <section id="about" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            About Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Crafting Digital Experiences with Passion & Precision
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Quick Stats & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-brand-500/50 transition-colors">
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-500 mb-1">
                  {profile.yearsOfExperience || '4+'}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Years of Experience
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Web development & engineering
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-brand-500/50 transition-colors">
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-500 mb-1">
                  {profile.completedProjects || '25+'}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Projects Delivered
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Web apps, portals & APIs
                </div>
              </div>
            </div>

            {/* Contact Details Quick Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3.5">
              {profile.location && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{profile.location}</span>
                  </div>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Email</span>
                    <a href={`mailto:${profile.email}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-500 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Phone / WhatsApp</span>
                    <a href={`tel:${profile.phone}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-500 transition-colors">
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Bio Narrative and CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile.aboutText ||
                  'I am a passionate Web Developer with a strong focus on building clean, fast, and accessible digital experiences. With expertise across frontend design and full-stack engineering, I transform ideas into seamless web applications that solve real-world problems.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Development Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Button */}
            <div className="pt-4 flex items-center gap-4">
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-brand-500 dark:hover:bg-brand-500 dark:hover:text-white transition-colors shadow-md"
                >
                  <FileText className="w-4 h-4 text-brand-400 dark:text-brand-500" />
                  Download Curriculum Vitae
                </a>
              ) : (
                <a
                  href="#resume-cta"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-brand-500 dark:hover:bg-brand-500 dark:hover:text-white transition-colors shadow-md"
                >
                  <FileText className="w-4 h-4 text-brand-400 dark:text-brand-500" />
                  Get Resume
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
