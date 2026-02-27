
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code2, Database, Layout, Sparkles, Building2, Info, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PROFILE_DATA } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface ProjectsProps {
  initialData?: any[];
}

export function Projects({ initialData }: ProjectsProps) {
  const [projects, setProjects] = useState(initialData || PROFILE_DATA.projects);

  useEffect(() => {
    if (initialData) setProjects(initialData);
  }, [initialData]);

  const sideProjects = projects.filter(p => (p as any).category === 'Personal Project' || (p as any).category === 'Side Project' || !(p as any).category);
  const officialProjects = projects.filter(p => (p as any).category === 'Official Project');

  const ProjectDetailDialog = ({ project }: { project: any }) => (
    <DialogContent className="glass bg-[#161116] border-white/10 text-white max-w-2xl rounded-3xl p-0 overflow-hidden">
      <div className="relative h-48 w-full">
        {project.imageUrl ? (
          <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-primary opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161116] to-transparent" />
      </div>
      <div className="p-8 -mt-12 relative z-10">
        <DialogHeader>
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">{project.type}</span>
          <DialogTitle className="text-3xl font-headline font-bold">{project.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6 text-left">
          <p className="text-muted-foreground leading-relaxed text-sm">
            {project.desc}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-white/40 font-bold">Frontend / Interface</p>
              <p className="text-sm font-medium">{project.techFront || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-white/40 font-bold">Backend / Middleware</p>
              <p className="text-sm font-medium">{project.techBack || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-white/40 font-bold">Database</p>
              <p className="text-sm font-medium">{project.techDb || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-white/40 font-bold">Status</p>
              <p className="text-sm font-medium text-primary">{project.status}</p>
            </div>
          </div>

          {project.link && project.link !== '#' && (
            <div className="pt-4">
              <Button asChild className="w-full h-12 rounded-xl font-bold gap-2">
                <a href={project.link} target="_blank">
                  Visit Project Site <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );

  const PersonalProjectGrid = ({ items }: any) => (
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-10 text-left">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-3xl font-headline font-bold">Personal Projects</h4>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((project: any, idx: number) => (
          <motion.div
            key={project.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-3xl overflow-hidden flex flex-col h-full text-left"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors z-10" />
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-bold border border-white/10 uppercase">{project.status}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{project.type}</span>
                <h4 className="text-xl font-headline font-bold">{project.title}</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {project.desc}
              </p>
              
              <div className="flex flex-col gap-3 mt-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full gap-2 text-xs font-bold hover:bg-primary/20 rounded-xl h-10">
                      View Details <Info className="w-3.5 h-3.5" />
                    </Button>
                  </DialogTrigger>
                  <ProjectDetailDialog project={project} />
                </Dialog>

                {project.link && project.link !== '#' && (
                  <a 
                    href={project.link} 
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-3 glass-card rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-sm"
                  >
                    Launch <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ProfessionalProjectList = ({ items }: any) => (
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-10 text-left">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-3xl font-headline font-bold">Professional Projects</h4>
      </div>

      <div className="space-y-4">
        {items.map((project: any, idx: number) => (
          <motion.div
            key={project.id || idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="group glass-card p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-all text-left"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                <Code2 className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-left">
                <h5 className="font-headline font-bold text-lg">{project.title}</h5>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-xs text-primary font-medium">{project.type}</span>
                  {project.techDb && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Database className="w-3 h-3" /> {project.techDb}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-xs font-bold hover:bg-primary hover:text-white transition-all rounded-xl h-10 px-6"
                  >
                    View Details <Info className="w-3.5 h-3.5" />
                  </Button>
                </DialogTrigger>
                <ProjectDetailDialog project={project} />
              </Dialog>
              
              {project.link && project.link !== '#' && (
                <a 
                  href={project.link} 
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center glass-card rounded-xl hover:bg-primary transition-all group/link"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/link:text-white" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="portfolio" className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 text-left">
        <div className="text-left">
          <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-2">My Work</h2>
          <h3 className="text-4xl lg:text-5xl font-headline font-bold">Project Portfolio</h3>
        </div>
        <a href="https://github.com/andiogie" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
          View GitHub Repository <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>
      </div>

      {sideProjects.length > 0 && (
        <PersonalProjectGrid items={sideProjects} />
      )}
      
      {officialProjects.length > 0 && (
        <ProfessionalProjectList items={officialProjects} />
      )}

      {projects.length === 0 && (
        <div className="text-center py-20 glass-card rounded-[3rem]">
          <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">No projects listed yet. Add them in the Admin Dashboard!</p>
        </div>
      )}
    </section>
  );
}
