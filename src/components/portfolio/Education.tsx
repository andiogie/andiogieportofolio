
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { PROFILE_DATA } from '@/lib/constants';

interface EducationProps {
  initialData?: any[];
}

export function Education({ initialData }: EducationProps) {
  const [education, setEducation] = useState(initialData || PROFILE_DATA.education || []);

  useEffect(() => {
    if (initialData) setEducation(initialData);
  }, [initialData]);

  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-24">
      <div className="mb-16">
        <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-2">Academic Foundation</h2>
        <h3 className="text-4xl lg:text-5xl font-headline font-bold">Education</h3>
      </div>

      <div className="grid gap-8">
        {education.map((edu: any, idx: number) => (
          <motion.div
            key={edu.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative glass-card p-8 rounded-3xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-primary transition-colors">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-headline font-bold text-white">{edu.institution}</h4>
                  <p className="text-primary font-medium">{edu.degree}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {edu.duration}
                </div>
                {edu.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {edu.location}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
