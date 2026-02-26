
"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import Link from 'next/link';
import { PROFILE_DATA } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
];

interface NavigationProps {
  initialData?: any;
}

export function Navigation({ initialData }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(initialData || PROFILE_DATA);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (initialData) setProfile(initialData);
  }, [initialData]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 glass border-b border-white/10' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-bold text-gradient">
          {profile.brandName || PROFILE_DATA.brandName}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
              {item.name}
            </a>
          ))}
          <Link href="/admin/login" className="flex items-center gap-2 px-4 py-2 text-xs font-semibold glass-card rounded-full hover:bg-primary/20 transition-all">
            <Shield className="w-3 h-3" /> Admin
          </Link>
        </div>

        {/* Mobile Toggle using Sheet for reliability */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="glass rounded-xl h-10 w-10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0d0a0d] border-l border-white/10 p-6 w-[300px]">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="text-gradient font-headline font-bold text-2xl">
                  {profile.brandName || PROFILE_DATA.brandName}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                  Navigation Menu
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="text-xl font-headline font-semibold py-3 border-b border-white/5 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                
                <Link
                  href="/admin/login"
                  onClick={handleLinkClick}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-4 text-center glass-card rounded-2xl font-bold text-primary border-primary/20"
                >
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <p className="text-[10px] text-muted-foreground text-center uppercase tracking-tighter">
                  © {new Date().getFullYear()} {profile.name}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
