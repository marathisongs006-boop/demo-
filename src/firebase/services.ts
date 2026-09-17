import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './config';
import {
  Profile,
  Skill,
  Project,
  Experience,
  Service,
  SocialLink,
  SiteSettings,
  ContactMessage,
  PublicData
} from '../types';

// Helper for dynamic social links: filter only enabled platforms with non-empty URL
export const filterActiveSocials = (socials: SocialLink[]): SocialLink[] => {
  if (!Array.isArray(socials)) return [];
  return socials
    .filter(item => item.visible && item.url && item.url.trim() !== '')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
};

// ==========================================
// 1. PUBLIC AGGREGATED DATA
// ==========================================
export async function getPublicData(): Promise<PublicData> {
  // 1. Profile
  const profileDoc = await getDoc(doc(db, 'profile', 'default'));
  const profile = profileDoc.exists() ? (profileDoc.data() as Profile) : {
    fullName: 'Vinayak Padole',
    professionalTitle: 'Web Developer',
    shortIntro: 'I build modern, responsive and user-friendly websites and web applications.',
    aboutText: '',
    profileImageUrl: '',
    resumeUrl: '',
    availabilityEnabled: true,
    availabilityText: 'Available for Freelance & Full-time Roles',
    email: '',
    phone: '',
    location: ''
  };

  // 2. Skills (visible only)
  const skillsSnap = await getDocs(collection(db, 'skills'));
  const skills: Skill[] = [];
  skillsSnap.forEach(d => {
    const data = d.data() as Skill;
    if (data.visible !== false) {
      skills.push({ ...data, id: d.id });
    }
  });
  skills.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // 3. Projects (visible only)
  const projectsSnap = await getDocs(collection(db, 'projects'));
  const projects: Project[] = [];
  projectsSnap.forEach(d => {
    const data = d.data() as Project;
    if (data.visible !== false) {
      projects.push({ ...data, id: d.id });
    }
  });
  projects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // 4. Experience (visible only)
  const expSnap = await getDocs(collection(db, 'experience'));
  const experience: Experience[] = [];
  expSnap.forEach(d => {
    const data = d.data() as Experience;
    if (data.visible !== false) {
      experience.push({ ...data, id: d.id });
    }
  });
  experience.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // 5. Services (visible only)
  const servSnap = await getDocs(collection(db, 'services'));
  const services: Service[] = [];
  servSnap.forEach(d => {
    const data = d.data() as Service;
    if (data.visible !== false) {
      services.push({ ...data, id: d.id });
    }
  });
  services.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // 6. Social Links (active only)
  const socSnap = await getDocs(collection(db, 'socialLinks'));
  const rawSocials: SocialLink[] = [];
  socSnap.forEach(d => {
    rawSocials.push({ ...(d.data() as SocialLink), id: d.id });
  });
  const socialLinks = filterActiveSocials(rawSocials);

  // 7. Site Settings
  const settingsDoc = await getDoc(doc(db, 'siteSettings', 'default'));
  const siteSettings: SiteSettings = settingsDoc.exists() ? (settingsDoc.data() as SiteSettings) : {
    siteTitle: 'Vinayak Padole | Professional Web Developer',
    metaDescription: 'Vinayak Padole - Web Developer Portfolio. Building modern, responsive and user-friendly web applications.',
    theme: 'system',
    accentColor: '#f97316',
    copyrightText: '© 2026 Vinayak Padole. All rights reserved.'
  };

  return {
    profile,
    skills,
    projects,
    experience,
    services,
    socialLinks,
    siteSettings
  };
}

// ==========================================
// 2. CONTACT MESSAGES
// ==========================================
export async function sendContactMessage(msg: { name: string; email: string; subject?: string; message: string }) {
  if (!msg.name || !msg.name.trim() || !msg.email || !msg.email.trim() || !msg.message || !msg.message.trim()) {
    throw new Error('Name, email, and message are required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(msg.email.trim())) {
    throw new Error('Please provide a valid email address.');
  }

  const docRef = await addDoc(collection(db, 'contactMessages'), {
    name: msg.name.trim(),
    email: msg.email.trim(),
    subject: (msg.subject || 'General Portfolio Inquiry').trim(),
    message: msg.message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
    serverTimestamp: serverTimestamp()
  });

  return { id: docRef.id, success: true };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const snap = await getDocs(collection(db, 'contactMessages'));
  const list: ContactMessage[] = [];
  snap.forEach(d => {
    list.push({ ...(d.data() as ContactMessage), id: d.id });
  });
  list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return list;
}

export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied') {
  await updateDoc(doc(db, 'contactMessages', id), {
    status,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteContactMessage(id: string) {
  await deleteDoc(doc(db, 'contactMessages', id));
}

// ==========================================
// 3. PROFILE MANAGEMENT
// ==========================================
export async function getProfile(): Promise<Profile> {
  const d = await getDoc(doc(db, 'profile', 'default'));
  if (d.exists()) {
    return d.data() as Profile;
  }
  return {
    fullName: 'Vinayak Padole',
    professionalTitle: 'Web Developer',
    shortIntro: 'I build modern, responsive and user-friendly websites and web applications.',
    aboutText: '',
    profileImageUrl: '',
    resumeUrl: '',
    availabilityEnabled: true,
    availabilityText: 'Available for Freelance & Full-time Roles',
    email: 'vinayakpadole006@gmail.com',
    phone: '+91 9130995714',
    location: 'Maharashtra, India'
  };
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const updatedData = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'profile', 'default'), updatedData, { merge: true });
  return updatedData as Profile;
}

// ==========================================
// 4. SKILLS CRUD
// ==========================================
export async function getSkills(): Promise<Skill[]> {
  const snap = await getDocs(collection(db, 'skills'));
  const list: Skill[] = [];
  snap.forEach(d => {
    list.push({ ...(d.data() as Skill), id: d.id });
  });
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return list;
}

export async function addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  const docRef = await addDoc(collection(db, 'skills'), {
    ...skill,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { ...skill, id: docRef.id };
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  await updateDoc(doc(db, 'skills', id), {
    ...skill,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, 'skills', id));
}

// ==========================================
// 5. PROJECTS CRUD
// ==========================================
export async function getProjects(): Promise<Project[]> {
  const snap = await getDocs(collection(db, 'projects'));
  const list: Project[] = [];
  snap.forEach(d => {
    list.push({ ...(d.data() as Project), id: d.id });
  });
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return list;
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { ...project, id: docRef.id };
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), {
    ...project,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteProject(id: string, storagePath?: string): Promise<void> {
  // Delete Firestore doc
  await deleteDoc(doc(db, 'projects', id));
  // Safely delete corresponding storage file if present
  if (storagePath) {
    try {
      await deleteFileFromStorage(storagePath);
    } catch (e) {
      console.warn('Storage file cleanup warning:', e);
    }
  }
}

export async function duplicateProject(project: Project): Promise<Project> {
  const newProj = {
    ...project,
    title: `${project.title} (Copy)`,
    slug: `${project.slug}-copy-${Date.now()}`,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  delete (newProj as any).id;
  const docRef = await addDoc(collection(db, 'projects'), newProj);
  return { ...newProj, id: docRef.id };
}

// ==========================================
// 6. EXPERIENCE CRUD
// ==========================================
export async function getExperience(): Promise<Experience[]> {
  const snap = await getDocs(collection(db, 'experience'));
  const list: Experience[] = [];
  snap.forEach(d => {
    list.push({ ...(d.data() as Experience), id: d.id });
  });
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return list;
}

export async function addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
  const docRef = await addDoc(collection(db, 'experience'), {
    ...exp,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { ...exp, id: docRef.id };
}

export async function updateExperience(id: string, exp: Partial<Experience>): Promise<void> {
  await updateDoc(doc(db, 'experience', id), {
    ...exp,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, 'experience', id));
}

// ==========================================
// 7. SERVICES CRUD
// ==========================================
export async function getServices(): Promise<Service[]> {
  const snap = await getDocs(collection(db, 'services'));
  const list: Service[] = [];
  snap.forEach(d => {
    list.push({ ...(d.data() as Service), id: d.id });
  });
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return list;
}

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
  const docRef = await addDoc(collection(db, 'services'), {
    ...service,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { ...service, id: docRef.id };
}

export async function updateService(id: string, service: Partial<Service>): Promise<void> {
  await updateDoc(doc(db, 'services', id), {
    ...service,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id));
}

// ==========================================
// 8. SOCIAL LINKS
// ==========================================
export async function getSocials(): Promise<SocialLink[]> {
  const snap = await getDocs(collection(db, 'socialLinks'));
  const list: SocialLink[] = [];
  snap.forEach(d => {
    list.push({ ...(d.data() as SocialLink), id: d.id });
  });
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return list;
}

export async function saveSocials(socials: SocialLink[]): Promise<SocialLink[]> {
  for (let idx = 0; idx < socials.length; idx++) {
    const s = socials[idx];
    const id = s.id || `soc-${s.platform.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const data = {
      ...s,
      sortOrder: idx + 1,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'socialLinks', id), data, { merge: true });
  }
  return socials;
}

export async function updateSocial(id: string, data: Partial<SocialLink>): Promise<void> {
  await updateDoc(doc(db, 'socialLinks', id), {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteSocial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'socialLinks', id));
}

// ==========================================
// 9. SITE SETTINGS
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  const d = await getDoc(doc(db, 'siteSettings', 'default'));
  if (d.exists()) {
    return d.data() as SiteSettings;
  }
  return {
    siteTitle: 'Vinayak Padole | Professional Web Developer',
    metaDescription: 'Vinayak Padole - Web Developer Portfolio. Building modern, responsive and user-friendly web applications.',
    theme: 'system',
    accentColor: '#f97316',
    copyrightText: '© 2026 Vinayak Padole. All rights reserved.'
  };
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const updated = {
    ...settings,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'siteSettings', 'default'), updated, { merge: true });
  return updated as SiteSettings;
}

// ==========================================
// 10. FIREBASE STORAGE (IMAGES & RESUMES)
// ==========================================
export async function uploadFileToStorage(
  file: File,
  folder: 'profile' | 'projects' | 'resumes' | string
): Promise<{ url: string; storagePath: string; filename: string }> {
  const ext = file.name.split('.').pop() || '';
  const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = `${Date.now()}_${cleanName}`;
  const storagePath = `${folder}/${uniqueName}`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type
  });

  const url = await getDownloadURL(snapshot.ref);

  return {
    url,
    storagePath,
    filename: file.name
  };
}

export async function deleteFileFromStorage(storagePath: string): Promise<void> {
  if (!storagePath) return;
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
