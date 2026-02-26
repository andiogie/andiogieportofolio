
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Facebook, Instagram, Music2 } from 'lucide-react';
import { PROFILE_DATA } from '@/lib/constants';

interface ContactProps {
  initialData?: any;
}

export function Contact({ initialData }: ContactProps) {
  const [profile, setProfile] = useState(initialData || PROFILE_DATA);

  useEffect(() => {
    if (initialData) setProfile(initialData);
  }, [initialData]);

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin />, href: profile.socials?.linkedin || '#' },
    { name: 'GitHub', icon: <Github />, href: profile.socials?.github || '#' },
    { name: 'Facebook', icon: <Facebook />, href: profile.socials?.facebook || '#' },
    { name: 'Instagram', icon: <Instagram />, href: profile.socials?.instagram || '#' },
    { name: 'TikTok', icon: <Music2 />, href: profile.socials?.tiktok || '#' },
  ];

  const whatsappUrl = `https://wa.me/${profile.phone?.replace(/\D/g, '') || ''}`;

  return (
    <section id="contact" className="py-24">
      <div className="glass-card rounded-[3rem] p-8 lg:p-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-2">Get In Touch</h2>
            <h3 className="text-4xl lg:text-5xl font-headline font-bold mb-8">Let's build something amazing together</h3>
            
            <div className="space-y-8 mt-12">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-xl font-bold hover:text-primary transition-colors">{profile.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone / WhatsApp</p>
                  <a href={whatsappUrl} target="_blank" className="text-xl font-bold hover:text-primary transition-colors">{profile.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:bg-primary transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-xl font-bold">{profile.location || 'Jakarta, Indonesia'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h4 className="text-2xl font-headline font-bold mb-8">Connect on Social Media</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  className="flex flex-col items-center justify-center gap-3 p-6 glass-card rounded-2xl hover:scale-105 transition-all text-muted-foreground hover:text-white"
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    {social.icon}
                  </div>
                  <span className="text-sm font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
