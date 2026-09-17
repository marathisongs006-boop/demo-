import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Service } from '../types';
import { DynamicIcon } from '../utils/icons';

interface ServicesProps {
  services: Service[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <section id="services" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            What I Offer
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Specialized Development Services
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            High quality, scalable, and responsive web development solutions tailored to help businesses and founders succeed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500 mb-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <DynamicIcon name={service.icon || 'Code'} size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-500 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-bold text-brand-500">
                <a href="#contact" className="inline-flex items-center gap-1 hover:underline">
                  Inquire Now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No services listed currently.
          </div>
        )}

      </div>
    </section>
  );
};
