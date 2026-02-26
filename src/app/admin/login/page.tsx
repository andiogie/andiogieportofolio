"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authenticateAdmin } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await authenticateAdmin(formData);

      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        });
        router.push('/admin');
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid email or password. Check your environment variables.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0d0a0d]">
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[20rem] h-[20rem] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-primary/30">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold mb-2 uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Secure access to your portfolio console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="admin@devogie.com"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Secret Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                name="password"
                type="password"
                required
                disabled={isPending}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-[0_0_30px_rgba(230,51,230,0.3)] mt-6 disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Verify Identity <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-tight">
          Server-Side Encryption Active
        </p>
      </motion.div>
    </div>
  );
}
