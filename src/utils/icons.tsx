import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  if (!name) {
    return <LucideIcons.Sparkles className={className} size={size} />;
  }

  // Handle common mappings and variations
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  let IconComponent: React.ComponentType<any> = LucideIcons.Sparkles;

  if (lower.includes('react') || lower.includes('code')) {
    IconComponent = LucideIcons.Code2;
  } else if (lower.includes('typescript') || lower.includes('filecode')) {
    IconComponent = LucideIcons.FileCode;
  } else if (lower.includes('javascript') || lower.includes('braces')) {
    IconComponent = LucideIcons.Braces;
  } else if (lower.includes('tailwind') || lower.includes('palette') || lower.includes('css')) {
    IconComponent = LucideIcons.Palette;
  } else if (lower.includes('html') || lower.includes('layout')) {
    IconComponent = LucideIcons.Layout;
  } else if (lower.includes('next') || lower.includes('globe') || lower.includes('web')) {
    IconComponent = LucideIcons.Globe;
  } else if (lower.includes('node') || lower.includes('server') || lower.includes('backend')) {
    IconComponent = LucideIcons.Server;
  } else if (lower.includes('api') || lower.includes('network')) {
    IconComponent = LucideIcons.Network;
  } else if (lower.includes('database') || lower.includes('mongo') || lower.includes('sql')) {
    IconComponent = LucideIcons.Database;
  } else if (lower.includes('git') || lower.includes('branch')) {
    IconComponent = LucideIcons.GitBranch;
  } else if (lower.includes('figma') || lower.includes('design') || lower.includes('layers')) {
    IconComponent = LucideIcons.Layers;
  } else if (lower.includes('seo') || lower.includes('perf') || lower.includes('zap') || lower.includes('speed')) {
    IconComponent = LucideIcons.Zap;
  } else if (lower.includes('github')) {
    IconComponent = LucideIcons.Github;
  } else if (lower.includes('linkedin')) {
    IconComponent = LucideIcons.Linkedin;
  } else if (lower.includes('whatsapp') || lower.includes('message')) {
    IconComponent = LucideIcons.MessageSquare;
  } else if (lower.includes('twitter') || lower.includes('x')) {
    IconComponent = LucideIcons.Twitter;
  } else if (lower.includes('instagram')) {
    IconComponent = LucideIcons.Instagram;
  } else if (lower.includes('facebook')) {
    IconComponent = LucideIcons.Facebook;
  } else if (lower.includes('youtube')) {
    IconComponent = LucideIcons.Youtube;
  } else if (lower.includes('mail') || lower.includes('email')) {
    IconComponent = LucideIcons.Mail;
  } else if (lower.includes('phone')) {
    IconComponent = LucideIcons.Phone;
  } else if (lower.includes('map') || lower.includes('location')) {
    IconComponent = LucideIcons.MapPin;
  } else if (lower.includes('check')) {
    IconComponent = LucideIcons.CheckCircle2;
  } else if (lower.includes('external') || lower.includes('link')) {
    IconComponent = LucideIcons.ExternalLink;
  } else {
    // Try to match exact lucide icon name
    const found = (LucideIcons as any)[name];
    if (found) {
      IconComponent = found;
    }
  }

  return <IconComponent className={className} size={size} />;
};
