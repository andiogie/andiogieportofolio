
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Send, ChevronDown } from 'lucide-react';
import { PROFILE_DATA } from '@/lib/constants';

interface HeroProps {
  initialData?: any;
}

export function Hero({ initialData }: HeroProps) {
  const [profile, setProfile] = useState(initialData || PROFILE_DATA);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData) setProfile(initialData);
  }, [initialData]);

  const typingText = [
    profile.title,
    "Middleware Integration Specialist",
    "Laravel Backend Developer",
    "API Platform Engineer"
  ];

  useEffect(() => {
    const currentFullText = typingText[textIndex];
    const speed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentFullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % typingText.length);
      } else {
        const nextText = isDeleting 
          ? currentFullText.substring(0, displayText.length - 1)
          : currentFullText.substring(0, displayText.length + 1);
        setDisplayText(nextText);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, profile.title]);

  const handleDownloadCV = () => {
    window.print();
  };

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-24 sm:pt-32 pb-12">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center lg:text-left order-2 lg:order-1"
        >
          <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-4 text-xs sm:text-sm">Welcome to my Digital Space</h2>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-headline font-bold mb-6 leading-tight">
            I'm <span className="text-gradient">{profile.name}</span>
          </h1>
          <div className="min-h-[4rem] lg:h-12 mb-8">
            <span className="text-xl sm:text-2xl lg:text-4xl font-headline text-white/80">
              {displayText}<span className="animate-pulse text-primary">|</span>
            </span>
          </div>
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
            {profile.bio}
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 px-4 sm:px-0">
            <button 
              onClick={handleDownloadCV}
              className="flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(230,51,230,0.5)] w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" /> Download CV
            </button>
            <a 
              href="#contact"
              className="flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 glass-card font-bold rounded-2xl hover:bg-white/10 transition-all border-white/20 w-full sm:w-auto justify-center"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" /> Contact Me
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center order-1 lg:order-2 px-6 sm:px-0"
        >
          <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[520px] aspect-square">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-accent/50 to-primary rounded-[3rem] lg:rounded-[4rem] rotate-12 opacity-30 blur-3xl animate-pulse" />
            
            <div className="absolute inset-0 border-4 border-primary/20 rounded-[3rem] lg:rounded-[4rem] rotate-3 scale-105" />
            <div className="absolute inset-0 border-2 border-white/10 rounded-[3rem] lg:rounded-[4rem] -rotate-6 scale-95" />
            
            <div className="relative w-full h-full rounded-[3rem] lg:rounded-[4rem] overflow-hidden glass shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-muted/20 border border-white/20">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl sm:text-6xl font-bold bg-gradient-to-br from-white/5 to-white/10">
                  {profile.name?.charAt(0)}
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 sm:p-8">
                <div className="glass px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/10 backdrop-blur-md">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Based in {profile.location}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="mt-16 sm:mt-24 flex justify-center no-print"
      >
        <a href="#skills" className="flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <span className="font-medium tracking-widest uppercase text-[10px]">Scroll for Skills</span>
          <ChevronDown className="w-5 h-5 text-primary" />
        </a>
      </motion.div>
    </section>
  );
}
