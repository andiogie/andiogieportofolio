
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { PROFILE_DATA } from '@/lib/constants';

interface SkillsProps {
  initialData?: any[];
}

export function Skills({ initialData }: SkillsProps) {
  const [skillCategories, setSkillCategories] = useState(initialData || PROFILE_DATA.skills);

  useEffect(() => {
    if (initialData) setSkillCategories(initialData);
  }, [initialData]);

  if (!skillCategories || skillCategories.length === 0) return null;

  return (
    <section id="skills" className="py-24">
      <div className="mb-16 text-center">
        <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-2">Capabilities</h2>
        <h3 className="text-4xl lg:text-5xl font-headline font-bold">Technical Expertise</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category: any, idx: number) => (
          <motion.div
            key={category.id || category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-3xl"
          >
            <h4 className="text-xl font-headline font-bold mb-8 text-primary/80">{category.title}</h4>
            <div className="space-y-6">
              {category.items.map((skill: any) => (
                <div key={skill.id || skill.name}>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>{skill.name}</span>
                    <span className="text-primary">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2 bg-white/5" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
