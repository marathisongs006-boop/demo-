import React from 'react';
import { Briefcase, Calendar, Sparkles } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experience: ExperienceType[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Career Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work Experience & Timeline
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            A chronological timeline of my engineering roles, technical responsibilities, and key impact.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-3xl mx-auto relative">
          
          {/* Vertical Center Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />

          <div className="space-y-12">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-8 group`}
                >
                  {/* Center Dot Indicator */}
                  <div className="absolute left-4 sm:left-1/2 top-5 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-brand-500 shadow-md flex items-center justify-center z-10 group-hover:scale-125 transition-transform duration-200">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                  </div>

                  {/* Content Card */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all duration-200">
                      
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/60 inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {item.startDate} — {item.current ? 'Present' : item.endDate}
                        </span>
                        {item.current && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.role}
                      </h3>

                      <div className="text-sm font-semibold text-brand-500 mb-3 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {item.company}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                    </div>
                  </div>

                  {/* Empty Spacer for alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>

          {experience.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No experience records to display.
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
