
"use client";

import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/portfolio/Hero';
import { Skills } from '@/components/portfolio/Skills';
import { Education } from '@/components/portfolio/Education';
import { Experience } from '@/components/portfolio/Experience';
import { Projects } from '@/components/portfolio/Projects';
import { Certifications } from '@/components/portfolio/Certifications';
import { Contact } from '@/components/portfolio/Contact';
import { Navigation } from '@/components/portfolio/Navigation';
import { ResumeTemplate } from '@/components/portfolio/ResumeTemplate';
import { PROFILE_DATA } from '@/lib/constants';

const STORAGE_KEY = 'andi_ogie_portfolio_v1';

export default function PortfolioPage() {
  const [profile, setProfile] = useState(PROFILE_DATA);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile({ ...PROFILE_DATA, ...parsed });
        } catch (e) {
          console.error("Local data corrupted, using constants");
          setProfile(PROFILE_DATA);
        }
      }
    };
    loadData();

    // Listen for changes if user edits in another tab
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none no-print">
        <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[25rem] h-[25rem] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="no-print">
        <Navigation initialData={profile} />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Hero initialData={profile} />
          <Skills initialData={profile.skills} />
          <Education initialData={profile.education} />
          <Experience initialData={profile.experiences} />
          <Projects initialData={profile.projects} />
          <Certifications initialData={profile.certifications} />
          <Contact initialData={profile} />
        </main>

        <footer className="py-12 border-t border-white/5 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} {profile.name}. Built with Passion & Precision.</p>
        </footer>
      </div>

      <ResumeTemplate data={profile} />
    </div>
  );
}
