import React, { useState, useEffect } from 'react';
import { Experience } from '../../types';
import { getExperience, addExperience, updateExperience, deleteExperience } from '../../firebase/services';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Briefcase,
  Calendar,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ExperienceManager: React.FC = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchExperienceList = async () => {
    try {
      const res = await getExperience();
      setExperience(res);
    } catch (err) {
      console.error('Failed to load experience from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceList();
  }, []);

  const openNewModal = () => {
    setEditingExp({
      id: '',
      role: '',
      company: '',
      startDate: '2024-01',
      endDate: '',
      current: true,
      description: '',
      visible: true,
      sortOrder: experience.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (exp: Experience) => {
    try {
      await updateExperience(exp.id, { visible: !exp.visible });
      setExperience(experience.map(e => (e.id === exp.id ? { ...e, visible: !e.visible } : e)));
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility in Firestore');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience record from Firestore?')) return;
    try {
      await deleteExperience(id);
      setExperience(experience.filter(e => e.id !== id));
      setNotification({ type: 'success', message: 'Experience record deleted from Firestore.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete from Firestore.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    setIsSaving(true);
    setNotification(null);

    try {
      if (editingExp.id) {
        await updateExperience(editingExp.id, editingExp);
        setExperience(experience.map(e => (e.id === editingExp.id ? editingExp : e)));
        setNotification({ type: 'success', message: 'Experience updated in Firestore successfully!' });
      } else {
        const { id, ...newExpData } = editingExp;
        const created = await addExperience(newExpData);
        setExperience([...experience, created]);
        setNotification({ type: 'success', message: 'Experience added to Firestore successfully!' });
      }
      setIsModalOpen(false);
      setEditingExp(null);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save experience in Firestore.' });
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
            Career Experience & Timeline (Firestore)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your employment history, client engagements, dates, and impact descriptions in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Experience
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

      {/* Experience List */}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/60">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </span>
                {exp.current && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    Current Role
                  </span>
                )}
                {!exp.visible && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500">
                    Hidden
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {exp.role}
                </h3>
                <div className="text-xs font-semibold text-brand-500 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {exp.company}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleToggleVisibility(exp)}
                className={`p-2 rounded-xl text-xs font-semibold ${
                  exp.visible
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
                title={exp.visible ? 'Published' : 'Hidden'}
              >
                {exp.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => openEditModal(exp)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingExp.id ? 'Edit Experience (Firestore)' : 'Add Experience (Firestore)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    placeholder="e.g. Senior Web Developer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    placeholder="e.g. Innovate Solutions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.startDate}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    placeholder="e.g. 2023-01 or Jan 2023"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={editingExp.current}
                    value={editingExp.current ? 'Present' : (editingExp.endDate || '')}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    placeholder="e.g. 2024-05"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExp.current}
                    onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                  <span>Currently working in this role</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExp.visible}
                    onChange={(e) => setEditingExp({ ...editingExp, visible: e.target.checked })}
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                  <span>Visible on site</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description of Key Responsibilities & Achievements
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  placeholder="Key contributions, frameworks used, performance improvements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md"
                >
                  {isSaving ? 'Saving to Firestore...' : 'Save Record'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
