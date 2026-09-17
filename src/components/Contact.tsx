import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Profile, SocialLink } from '../types';
import { DynamicIcon } from '../utils/icons';
import { formatSocialUrl } from '../utils/api';
import { sendContactMessage } from '../firebase/services';

interface ContactProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

export const Contact: React.FC<ContactProps> = ({ profile, socialLinks }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      await sendContactMessage(formData);
      setSubmitStatus('success');
      setStatusMessage('Thank you! Your message has been saved to Cloud Firestore and Vinayak will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setSubmitStatus('error');
      setStatusMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let's Build Something Great Together
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Have an interesting project, job opportunity, or just want to connect? Send a message and I'll get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-5">
                {profile.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</div>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-brand-500 transition-colors break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone / WhatsApp</div>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-brand-500 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</div>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                        {profile.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Social Links */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Active Social Profiles
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {socialLinks.map((social) => (
                      <a
                        key={social.id}
                        href={formatSocialUrl(social.platform, social.url)}
                        target={social.platform.toLowerCase() === 'email' ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        aria-label={social.label || social.platform}
                        className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-brand-500 dark:hover:bg-brand-500 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                      >
                        <DynamicIcon name={social.icon || social.platform} size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm">
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Send a Message
              </h3>

              {submitStatus === 'success' && (
                <div className="p-4 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">{statusMessage}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, or requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending to Firestore...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
