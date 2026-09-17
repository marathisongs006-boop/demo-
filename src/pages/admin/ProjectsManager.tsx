import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  duplicateProject,
  uploadFileToStorage,
  deleteFileFromStorage
} from '../../firebase/services';
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Github,
  Upload,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProjectsList = async () => {
    try {
      const res = await getProjects();
      setProjects(res);
    } catch (err) {
      console.error('Failed to load projects from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const openNewProjectModal = () => {
    setEditingProject({
      id: '',
      title: '',
      slug: '',
      thumbnailUrl: '',
      storagePath: '',
      description: '',
      fullDescription: '',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      liveUrl: '',
      githubUrl: '',
      featured: false,
      visible: true,
      sortOrder: projects.length + 1
    });
    setTechInput('');
    setIsModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject({ ...proj });
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (proj: Project) => {
    try {
      await updateProject(proj.id, { visible: !proj.visible });
      setProjects(projects.map(p => (p.id === proj.id ? { ...p, visible: !p.visible } : p)));
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility in Firestore');
    }
  };

  const handleToggleFeatured = async (proj: Project) => {
    try {
      await updateProject(proj.id, { featured: !proj.featured });
      setProjects(projects.map(p => (p.id === proj.id ? { ...p, featured: !p.featured } : p)));
    } catch (err: any) {
      alert(err.message || 'Failed to update featured flag in Firestore');
    }
  };

  const handleDuplicate = async (proj: Project) => {
    try {
      const dup = await duplicateProject(proj);
      setProjects([...projects, dup]);
      setNotification({ type: 'success', message: 'Project duplicated in Firestore successfully!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to duplicate project.' });
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${project.title}" from Firestore and Firebase Storage?`)) return;
    try {
      await deleteProject(project.id, project.storagePath);
      setProjects(projects.filter(p => p.id !== project.id));
      setNotification({ type: 'success', message: 'Project and storage media deleted successfully.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete project.' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setIsUploading(true);
    try {
      // If previous storagePath exists on this project, delete it
      if (editingProject.storagePath) {
        try {
          await deleteFileFromStorage(editingProject.storagePath);
        } catch (ignore) {}
      }

      const res = await uploadFileToStorage(file, 'projects');
      setEditingProject({
        ...editingProject,
        thumbnailUrl: res.url,
        storagePath: res.storagePath
      });
    } catch (err: any) {
      alert(err.message || 'Failed to upload screenshot to Firebase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProject) return;
    if (!editingProject.technologies.includes(techInput.trim())) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, techInput.trim()]
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter(t => t !== tech)
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSaving(true);
    setNotification(null);

    const slug = editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const projectToSave = { ...editingProject, slug };

    try {
      if (projectToSave.id) {
        await updateProject(projectToSave.id, projectToSave);
        setProjects(projects.map(p => (p.id === projectToSave.id ? projectToSave : p)));
        setNotification({ type: 'success', message: 'Project updated in Firestore successfully!' });
      } else {
        const { id, ...newProjData } = projectToSave;
        const created = await addProject(newProjData);
        setProjects([...projects, created]);
        setNotification({ type: 'success', message: 'Project created in Firestore successfully!' });
      }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save project in Firestore.' });
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Projects Portfolio (Firestore + Storage)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase your web applications, manage screenshots in Firebase Storage, links, and featured status.
          </p>
        </div>

        <button
          onClick={openNewProjectModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Project
        </button>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail */}
              <div className="aspect-video relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm ${
                      project.featured
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    {project.featured ? 'Featured ★' : 'Standard'}
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(project)}
                    className={`p-1.5 rounded-full text-white backdrop-blur-md ${
                      project.visible ? 'bg-emerald-600/80' : 'bg-slate-900/80'
                    }`}
                    title={project.visible ? 'Published' : 'Hidden'}
                  >
                    {project.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {project.title}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies?.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies && project.technologies.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{project.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500" title="Live Demo">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-200" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDuplicate(project)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Duplicate in Firestore"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openEditProjectModal(project)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete from Firestore & Storage"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Project */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingProject.id ? 'Edit Project (Firestore)' : 'Create New Project (Firestore)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Modern E-Commerce Platform"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Concise overview of the project and core value..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Case Study / Details
                </label>
                <textarea
                  rows={3}
                  value={editingProject.fullDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                  placeholder="Detailed architectural breakdown, user experience solutions, and outcomes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Thumbnail Image (Upload to Firebase Storage)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingProject.thumbnailUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })}
                    placeholder="https://... or upload to Firebase Storage"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                  <label className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-brand-500" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technology Stack Tags
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                    placeholder="e.g. Next.js, Redux, PostgreSQL"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editingProject.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 text-xs font-semibold"
                    >
                      <span>{tech}</span>
                      <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://example.com/demo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.visible}
                    onChange={(e) => setEditingProject({ ...editingProject, visible: e.target.checked })}
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25"
                >
                  {isSaving ? 'Saving to Firestore...' : 'Save Project'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
