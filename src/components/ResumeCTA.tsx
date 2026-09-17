import React from 'react';
import { FileText, Download, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { Profile } from '../types';

interface ResumeCTAProps {
  profile: Profile;
}

export const ResumeCTA: React.FC<ResumeCTAProps> = ({ profile }) => {
  return (
    <section id="resume-cta" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container with Orange Glow */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-950 p-8 sm:p-12 lg:p-16 border border-slate-700 shadow-2xl text-white overflow-hidden">
          
          {/* Subtle Orange Glow Ambient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                Curriculum Vitae
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Looking for an experienced Web Developer?
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Download my up-to-date resume to review complete technical capabilities, educational credentials, work achievements, and project highlights.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> React & Modern Frontend
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Full Stack Node/Express APIs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> UI/UX & Responsive Systems
                </span>
              </div>
            </div>

            {/* Right Column Action */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/30 hover:scale-[1.02] transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Resume (PDF)
                </a>
              ) : (
                <a
                  href="#contact"
                  className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/30 hover:scale-[1.02] transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Request Resume Copy
                </a>
              )}

              <a
                href="#contact"
                className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/10 transition-colors"
              >
                Let's Discuss Opportunities <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
