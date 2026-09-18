// URL Helpers for Social Links and dynamic URL formatting

// Formats social platform URLs properly (WhatsApp phone numbers, email mailto, etc.)
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
