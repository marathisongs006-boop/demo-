import React, { useState, useEffect } from 'react';
import { Skill } from '../../types';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../firebase/services';
import { DynamicIcon } from '../../utils/icons';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSkillsList = async () => {
    try {
      const res = await getSkills();
      setSkills(res);
    } catch (err) {
      console.error('Failed to load skills from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsList();
  }, []);

  const openNewSkillModal = () => {
    setEditingSkill({
      id: '',
      name: '',
      icon: 'Code2',
      percentage: 85,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditSkillModal = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      await updateSkill(skill.id, { visible: !skill.visible });
      setSkills(skills.map(s => (s.id === skill.id ? { ...s, visible: !s.visible } : s)));
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility in Firestore');
    }
  };

  const handleToggleFeatured = async (skill: Skill) => {
    try {
      await updateSkill(skill.id, { featured: !skill.featured });
      setSkills(skills.map(s => (s.id === skill.id ? { ...s, featured: !s.featured } : s)));
    } catch (err: any) {
      alert(err.message || 'Failed to update featured status in Firestore');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this skill from Firestore?')) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      setNotification({ type: 'success', message: 'Skill deleted from Firestore.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete skill from Firestore.' });
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    setIsSaving(true);
    setNotification(null);

    try {
      if (editingSkill.id) {
        await updateSkill(editingSkill.id, editingSkill);
        setSkills(skills.map(s => (s.id === editingSkill.id ? editingSkill : s)));
        setNotification({ type: 'success', message: 'Skill updated in Firestore successfully!' });
      } else {
        const { id, ...newSkillData } = editingSkill;
        const created = await addSkill(newSkillData);
        setSkills([...skills, created]);
        setNotification({ type: 'success', message: 'Skill created in Firestore successfully!' });
      }
      setIsModalOpen(false);
      setEditingSkill(null);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save skill in Firestore.' });
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
            Skills & Technical Stack (Firestore)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your technical languages, frameworks, proficiency percentages, and visibility in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={openNewSkillModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Skill
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

      {/* Skills Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Skill & Icon</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Proficiency</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-center">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500">
                        <DynamicIcon name={skill.icon || skill.name} size={18} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      {skill.category || 'Frontend'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 max-w-[140px]">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                        {skill.percentage}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(skill)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        skill.featured
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {skill.featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleVisibility(skill)}
                      className={`p-1.5 rounded-lg text-xs font-semibold ${
                        skill.visible
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                      }`}
                      title={skill.visible ? 'Published publicly' : 'Hidden from public'}
                    >
                      {skill.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditSkillModal(skill)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Skill */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingSkill.id ? 'Edit Skill (Firestore)' : 'Add New Skill (Firestore)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. React.js, TypeScript, Tailwind CSS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools">Tools</option>
                    <option value="Database">Database</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    value={editingSkill.icon || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                    placeholder="Code2, Layout, Database"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Proficiency Percentage
                  </label>
                  <span className="text-xs font-extrabold text-brand-500">
                    {editingSkill.percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={editingSkill.percentage}
                  onChange={(e) => setEditingSkill({ ...editingSkill, percentage: Number(e.target.value) })}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.visible}
                    onChange={(e) => setEditingSkill({ ...editingSkill, visible: e.target.checked })}
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                  <span>Visible on Public Site</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.featured}
                    onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                  <span>Featured Badge</span>
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
                  {isSaving ? 'Saving to Firestore...' : 'Save Skill'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
