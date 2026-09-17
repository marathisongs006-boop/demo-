export interface Profile {
  id?: string;
  fullName: string;
  professionalTitle: string;
  shortIntro: string;
  aboutText: string;
  profileImageUrl: string;
  profileImageStoragePath?: string;
  resumeUrl: string;
  resumeStoragePath?: string;
  availabilityEnabled: boolean;
  availabilityText: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience?: string;
  completedProjects?: string;
  happyClients?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  icon?: string;
  percentage: number;
  category: 'Frontend' | 'Backend' | 'Tools' | string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  storagePath?: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: 'WhatsApp' | 'Instagram' | 'Facebook' | 'LinkedIn' | 'GitHub' | 'YouTube' | 'X/Twitter' | 'Email' | string;
  url: string;
  label: string;
  icon?: string;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  copyrightText: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface PublicData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  services: Service[];
  socialLinks: SocialLink[];
  siteSettings: SiteSettings;
}
