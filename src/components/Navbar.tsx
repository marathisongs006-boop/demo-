import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, FileText, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Profile } from '../types';

interface NavbarProps {
  profile: Profile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800'
          : 'bg-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              VP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                {profile.fullName || 'Vinayak Padole'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {profile.professionalTitle || 'Web Developer'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Resume CTA */}
            {profile.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-brand-500" />
                Resume
              </a>
            ) : (
              <a
                href="#resume-cta"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-brand-500" />
                Resume
              </a>
            )}

            {/* Hire Me / Contact CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02]"
            >
              Contact Me
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu & Theme Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-500"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2">
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                <FileText className="w-4 h-4 text-brand-500" />
                View Resume
              </a>
            )}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md"
            >
              Contact Me
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
