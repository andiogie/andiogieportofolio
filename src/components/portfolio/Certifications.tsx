
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { PROFILE_DATA } from '@/lib/constants';

interface CertificationsProps {
  initialData?: any[];
}

export function Certifications({ initialData }: CertificationsProps) {
  const [certs, setCerts] = useState(initialData || PROFILE_DATA.certifications);

  useEffect(() => {
    if (initialData) setCerts(initialData);
  }, [initialData]);

  const handleDownload = (url: string) => {
    if (!url || url === '#') return;
    window.open(url, '_blank');
  };

  return (
    <section id="certifications" className="py-24">
      <div className="mb-16 text-center">
        <h2 className="text-primary font-headline font-semibold tracking-wider uppercase mb-2">Validation</h2>
        <h3 className="text-4xl lg:text-5xl font-headline font-bold">Certifications</h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.map((cert: any, idx: number) => (
          <motion.div
            key={cert.id || idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative glass-card p-8 rounded-3xl overflow-hidden bg-gradient-to-br ${cert.color || 'from-primary/10 to-accent/10'}`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-headline font-bold leading-tight">{cert.name}</h4>
              <p className="text-sm font-medium text-white/60">{cert.issuer} • {cert.year}</p>
              
              <button 
                onClick={() => handleDownload(cert.pdfUrl)}
                disabled={!cert.pdfUrl || cert.pdfUrl === '#'}
                className="flex items-center gap-2 mt-4 px-6 py-2 glass rounded-full text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cert.pdfUrl && cert.pdfUrl.startsWith('data:') ? (
                  <Download className="w-3 h-3" />
                ) : (
                  <ExternalLink className="w-3 h-3" />
                )}
                View Credential
              </button>
            </div>
            
            <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 text-white pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
