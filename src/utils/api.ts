// API Client for Vinayak Padole Portfolio
const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('vp_admin_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('vp_admin_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('vp_admin_token');
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && window.location.pathname.startsWith('/admin')) {
      removeAuthToken();
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    throw new Error(data.error || `HTTP Error ${response.status}`);
  }

  return data;
}

// Upload file helper
export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiRequest<{ success: boolean; url: string; filename: string }>('/admin/upload', {
    method: 'POST',
    body: formData
  });

  return res;
}

// Helpers for WhatsApp and dynamic links
export function formatSocialUrl(platform: string, url: string): string {
  if (!url) return '#';
  const cleanUrl = url.trim();

  if (platform.toLowerCase() === 'whatsapp') {
    // If it's already a full wa.me link
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    // Clean phone number (strip spaces, dashes, parentheses)
    const cleanPhone = cleanUrl.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}`;
  }

  if (platform.toLowerCase() === 'email') {
    if (cleanUrl.startsWith('mailto:')) return cleanUrl;
    return `mailto:${cleanUrl}`;
  }

  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('mailto:')) {
    return `https://${cleanUrl}`;
  }

  return cleanUrl;
}
