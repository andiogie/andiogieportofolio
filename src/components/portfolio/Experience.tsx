
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { PROFILE_DATA } from '@/lib/constants';

interface ExperienceProps {
  initialData?: any[];
}

export function Experience({ initialData }: ExperienceProps) {
  const [experiences, setExperiences] = useState(initialData || PROFILE_DATA.experiences);

  useEffect(() => {
    if (initialData) setExperiences(initialData);
  }, [initialData]);

  return (
    <section id="experience" className="py-24">
      <div className="mb-16">
        <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-2">Professional Journey</h2>
        <h3 className="text-4xl lg:text-5xl font-headline font-bold">Work Experience</h3>
      </div>

      <div className="relative space-y-12">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
        
        {experiences.map((exp: any, idx: number) => (
          <motion.div
            key={exp.id || idx}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-12 h-12 rounded-full glass border border-primary items-center justify-center z-10 bg-background">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            
            <div className="md:ml-20 flex-1 glass-card p-8 rounded-3xl w-full">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h4 className="text-2xl font-headline font-bold text-white">{exp.role}</h4>
                  <p className="text-primary font-medium flex items-center gap-2">
                    {exp.company} <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">{exp.type}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-white/5 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {exp.duration}
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{exp.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
