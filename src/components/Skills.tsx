import React, { useState, useMemo } from 'react';
import { Sparkles, Code, Server, Wrench } from 'lucide-react';
import { Skill } from '../types';
import { DynamicIcon } from '../utils/icons';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter(s => s.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Skills & Proficiency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Technologies & Modern Stack
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            A comprehensive overview of my technical capabilities, languages, frameworks, and developer tools.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                    <DynamicIcon name={skill.icon || skill.name} size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {skill.category || 'Development'}
                    </span>
                  </div>
                </div>

                {skill.percentage > 0 && (
                  <span className="text-sm font-extrabold text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-lg border border-brand-200/60 dark:border-brand-900/60">
                    {skill.percentage}%
                  </span>
                )}
              </div>

              {/* Progress Bar Indicator */}
              {skill.percentage > 0 && (
                <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, skill.percentage)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium">
            No skills listed in this category yet.
          </div>
        )}

      </div>
    </section>
  );
};
