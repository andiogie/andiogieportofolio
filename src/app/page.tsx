
"use client";

import React from 'react';
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
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function PortfolioPage() {
  const db = useFirestore();
  const profileDocRef = db ? doc(db, 'profiles', 'main') : null;
  const { data: cloudProfile, loading } = useDoc(profileDocRef);

  // Merge cloud data with static constants as fallback
  const profile = cloudProfile ? { ...PROFILE_DATA, ...cloudProfile } : PROFILE_DATA;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
