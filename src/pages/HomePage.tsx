import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { Services } from '../components/Services';
import { ResumeCTA } from '../components/ResumeCTA';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { PublicData } from '../types';
import { getPublicData } from '../firebase/services';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<PublicData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const res = await getPublicData();
        setData(res);
        if (res.siteSettings?.siteTitle) {
          document.title = res.siteSettings.siteTitle;
        }
      } catch (err: any) {
        console.error('Failed to load portfolio from Firestore:', err);
        setError(err.message || 'Failed to load portfolio from Cloud Firestore.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfbf9] dark:bg-[#0b0f19] text-slate-900 dark:text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-brand-500/25 animate-bounce">
          VP
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          <span>Connecting to Firebase Firestore...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfbf9] dark:bg-[#0b0f19] px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-4">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Firestore Connection Notice</h2>
        <p className="text-slate-500 max-w-md mt-2 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-md hover:bg-brand-600 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar profile={data.profile} />

      <main className="flex-1">
        {/* 2. Hero */}
        <Hero profile={data.profile} socialLinks={data.socialLinks} />

        {/* 3. About Preview */}
        <About profile={data.profile} />

        {/* 4. Skills Preview */}
        <Skills skills={data.skills} />

        {/* 5. Projects Preview */}
        <Projects projects={data.projects} />

        {/* 6. Experience Preview */}
        <Experience experience={data.experience} />

        {/* 7. Services */}
        <Services services={data.services} />

        {/* 8. Resume CTA */}
        <ResumeCTA profile={data.profile} />

        {/* 9. Contact */}
        <Contact profile={data.profile} socialLinks={data.socialLinks} />
      </main>

      {/* 10. Footer */}
      <Footer
        profile={data.profile}
        socialLinks={data.socialLinks}
        siteSettings={data.siteSettings}
      />
    </div>
  );
};
