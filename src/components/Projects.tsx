import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, X, Layers, Code, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'All' | 'Featured'>('All');

  const displayedProjects = filter === 'Featured' 
    ? projects.filter(p => p.featured) 
    : projects;

  return (
    <section id="projects" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Projects & Applications
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              A curated selection of responsive websites, web applications, and developer projects built for performance and user delight.
            </p>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 self-start md:self-auto shadow-sm">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'All'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter('Featured')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'Featured'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Featured Only
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Project Image Banner */}
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </div>
                )}

                {/* Hover Quick Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs shadow-lg hover:bg-brand-500 hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white text-slate-900 hover:bg-brand-500 hover:text-white transition-colors shadow-lg"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white text-slate-900 hover:bg-brand-500 hover:text-white transition-colors shadow-lg"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand-500 transition-colors cursor-pointer line-clamp-1"
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technology Badges */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 4 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Card Bottom Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs font-semibold">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-brand-500 hover:text-brand-600 inline-flex items-center gap-1 font-bold"
                    >
                      Case Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-500 font-bold transition-colors"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

        {displayedProjects.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            No projects found matching the criteria.
          </div>
        )}

        {/* Project Modal Dialog */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative space-y-6">
              
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedProject.thumbnailUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {selectedProject.fullDescription || selectedProject.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Built With
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-300 border border-brand-200/50 dark:border-brand-900/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Live Application
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <Github className="w-4 h-4" />
                    View Source Code
                  </a>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
