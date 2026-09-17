import React, { useState, useEffect } from 'react';
import { Profile } from '../../types';
import { getProfile, updateProfile, uploadFileToStorage, deleteFileFromStorage } from '../../firebase/services';
import {
  Save,
  Upload,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2
} from 'lucide-react';

export const ProfileManager: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res);
      } catch (err) {
        console.error('Failed to load profile from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProfile({ ...profile, [name]: checked });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsUploadingImage(true);
    try {
      // If old storage path exists, clean up
      if (profile.profileImageStoragePath) {
        try {
          await deleteFileFromStorage(profile.profileImageStoragePath);
        } catch (ignore) {}
      }

      const res = await uploadFileToStorage(file, 'profile');
      const updated = {
        ...profile,
        profileImageUrl: res.url,
        profileImageStoragePath: res.storagePath
      };
      setProfile(updated);
      await updateProfile(updated);
      setSaveStatus('success');
      setStatusMessage('Portrait image uploaded to Firebase Storage and saved!');
    } catch (err: any) {
      console.error('Image upload error:', err);
      setSaveStatus('error');
      setStatusMessage(err.message || 'Image upload to Firebase Storage failed.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsUploadingResume(true);
    try {
      if (profile.resumeStoragePath) {
        try {
          await deleteFileFromStorage(profile.resumeStoragePath);
        } catch (ignore) {}
      }

      const res = await uploadFileToStorage(file, 'resumes');
      const updated = {
        ...profile,
        resumeUrl: res.url,
        resumeStoragePath: res.storagePath
      };
      setProfile(updated);
      await updateProfile(updated);
      setSaveStatus('success');
      setStatusMessage('Resume PDF uploaded to Firebase Storage and saved!');
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setSaveStatus('error');
      setStatusMessage(err.message || 'Resume upload to Firebase Storage failed.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await updateProfile(profile);
      setProfile(res);
      setSaveStatus('success');
      setStatusMessage('Profile information saved directly to Cloud Firestore!');
    } catch (err: any) {
      console.error('Profile update error:', err);
      setSaveStatus('error');
      setStatusMessage(err.message || 'Failed to update profile in Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Profile & Personal Bio (Firestore)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit your developer identity, availability status, portrait, and resume stored in Firebase.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving to Firestore...' : 'Save Profile'}
        </button>
      </div>

      {/* Status Notifications */}
      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Identity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Identity & Headlines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={profile.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                name="professionalTitle"
                required
                value={profile.professionalTitle}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Short Intro (Hero Section)
            </label>
            <input
              type="text"
              name="shortIntro"
              required
              value={profile.shortIntro}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Detailed About Bio (About Section)
            </label>
            <textarea
              name="aboutText"
              rows={4}
              required
              value={profile.aboutText}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Media & Resume Upload */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Media & Resume Assets (Firebase Storage)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Portrait Image */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Hero Portrait Photo (Firebase Storage)
              </label>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                  {profile.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt="Portrait" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-brand-500" />
                    <span>{isUploadingImage ? 'Uploading to Firebase...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    name="profileImageUrl"
                    placeholder="Or enter image URL..."
                    value={profile.profileImageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Curriculum Vitae (Firebase Storage PDF)
              </label>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span className="truncate">{profile.resumeUrl ? 'Resume PDF Uploaded' : 'No resume uploaded yet'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingResume ? 'Uploading...' : 'Upload PDF'}</span>
                    <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                  </label>
                  {profile.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability & Contact Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Availability & Contact Information
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Freelance / Work Availability Badge
              </div>
              <div className="text-[11px] text-slate-400">
                Controls the live glowing status badge on the Hero section
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="availabilityEnabled"
                checked={profile.availabilityEnabled}
                onChange={(e) => setProfile({ ...profile, availabilityEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Availability Badge Text
            </label>
            <input
              type="text"
              name="availabilityText"
              value={profile.availabilityText}
              onChange={handleChange}
              placeholder="e.g. Available for Freelance & Full-time Roles"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Years of Experience (Stat)
              </label>
              <input
                type="text"
                name="yearsOfExperience"
                value={profile.yearsOfExperience || ''}
                onChange={handleChange}
                placeholder="4+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Projects Completed (Stat)
              </label>
              <input
                type="text"
                name="completedProjects"
                value={profile.completedProjects || ''}
                onChange={handleChange}
                placeholder="25+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Happy Clients (Stat)
              </label>
              <input
                type="text"
                name="happyClients"
                value={profile.happyClients || ''}
                onChange={handleChange}
                placeholder="15+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
