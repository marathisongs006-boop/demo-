import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { getServices, addService, updateService, deleteService } from '../../firebase/services';
import { DynamicIcon } from '../../utils/icons';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Layers,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchServicesList = async () => {
    try {
      const res = await getServices();
      setServices(res);
    } catch (err) {
      console.error('Failed to load services from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesList();
  }, []);

  const openNewModal = () => {
    setEditingService({
      id: '',
      title: '',
      description: '',
      icon: 'Code',
      visible: true,
      sortOrder: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (service: Service) => {
    try {
      await updateService(service.id, { visible: !service.visible });
      setServices(services.map(s => (s.id === service.id ? { ...s, visible: !s.visible } : s)));
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility in Firestore');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service from Firestore?')) return;
    try {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
      setNotification({ type: 'success', message: 'Service deleted from Firestore.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete from Firestore.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setIsSaving(true);
    setNotification(null);

    try {
      if (editingService.id) {
        await updateService(editingService.id, editingService);
        setServices(services.map(s => (s.id === editingService.id ? editingService : s)));
        setNotification({ type: 'success', message: 'Service updated in Firestore successfully!' });
      } else {
        const { id, ...newServData } = editingService;
        const created = await addService(newServData);
        setServices([...services, created]);
        setNotification({ type: 'success', message: 'Service created in Firestore successfully!' });
      }
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save service in Firestore.' });
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
            Services & Offerings (Firestore)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define freelance and engineering services stored in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Service
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500">
                  <DynamicIcon name={service.icon || 'Code'} size={20} />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleVisibility(service)}
                    className={`p-1.5 rounded-lg text-xs font-semibold ${
                      service.visible
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {service.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {service.title}
              </h3>
              
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingService.id ? 'Edit Service (Firestore)' : 'Add Service (Firestore)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Icon (Lucide name)
                </label>
                <input
                  type="text"
                  value={editingService.icon || ''}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  placeholder="Code, Layout, Server, Zap, Database"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Explain what value this service delivers to clients..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="srv-vis"
                  checked={editingService.visible}
                  onChange={(e) => setEditingService({ ...editingService, visible: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="srv-vis" className="text-xs font-semibold cursor-pointer">
                  Visible on public site
                </label>
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
                  {isSaving ? 'Saving to Firestore...' : 'Save Service'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
