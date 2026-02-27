
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Code, 
  LogOut, 
  Plus, 
  Sparkles,
  Monitor,
  Save,
  Trash2,
  Edit,
  Loader2,
  GraduationCap,
  Award,
  Info,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  ImageIcon,
  Wrench,
  Settings,
  ExternalLink,
  Menu,
  X,
  Upload,
  Camera,
  AlertTriangle,
  Globe,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Music2,
  Layers,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { aiAssistedDescriptionGeneration } from '@/ai/flows/ai-assisted-description-generation';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { PROFILE_DATA } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useFirestore, useDoc, isConfigValid } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const { toast } = useToast();
  const db = useFirestore();
  const profileDocRef = db ? doc(db, 'profiles', 'main') : null;
  const { data: cloudProfile, loading: isLoadingData } = useDoc(profileDocRef);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectImageRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiLoading, setAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<any>(null);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [currentProj, setCurrentProj] = useState<any>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<any>(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<any>(null);

  const [profile, setProfile] = useState(PROFILE_DATA);

  useEffect(() => {
    if (cloudProfile) {
      setProfile({ ...PROFILE_DATA, ...cloudProfile });
    }
  }, [cloudProfile]);

  const persistData = async (updatedProfile: any) => {
    if (!isConfigValid) {
      toast({
        variant: "destructive",
        title: "Firebase Configuration Missing",
        description: "Please check your environment variables in Vercel.",
      });
      return;
    }

    if (!db || !profileDocRef) return;
    
    setIsSaving(true);
    try {
      await setDoc(profileDocRef, updatedProfile, { merge: true });
      setIsSaving(false);
      toast({
        title: "Success!",
        description: "Portfolio updated successfully.",
      });
    } catch (error: any) {
      setIsSaving(false);
      console.error("Save Error:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    }
  };

  const handleAiRefine = async (type: 'work-experience' | 'portfolio-project', currentItem: any, setter: any) => {
    setAiLoading(true);
    try {
      const result = await aiAssistedDescriptionGeneration({
        originalDescription: currentItem.desc,
        contextType: type,
        contextDetails: {
          companyName: currentItem.company,
          position: currentItem.role,
          projectName: currentItem.title,
        }
      });
      setter({ ...currentItem, desc: result.generatedDescription });
      toast({ title: "AI Refinement Complete" });
    } catch (err) {
      toast({ variant: "destructive", title: "AI Refinement Failed" });
    } finally {
      setAiLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'project') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Max size is 800KB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'profile') {
          const updatedProfile = { ...profile, photoUrl: base64String };
          setProfile(updatedProfile);
          persistData(updatedProfile);
        } else {
          setCurrentProj({ ...currentProj, imageUrl: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCollection = (collectionName: string, item: any, setIsModalOpen: any) => {
    const collection = [...(profile[collectionName as keyof typeof profile] as any[] || [])];
    const index = collection.findIndex((i: any) => i.id === item.id);
    
    if (index > -1) collection[index] = item;
    else collection.push(item);

    const updatedProfile = { ...profile, [collectionName]: collection };
    setProfile(updatedProfile);
    persistData(updatedProfile);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (collectionName: string, id: string) => {
    if (!confirm("Delete this item?")) return;
    const collection = (profile[collectionName as keyof typeof profile] as any[] || []).filter((i: any) => i.id !== id);
    const updatedProfile = { ...profile, [collectionName]: collection };
    setProfile(updatedProfile);
    persistData(updatedProfile);
  };

  const handleAddSkillCategory = () => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      title: 'New Skill Category',
      items: []
    };
    const updatedProfile = { ...profile, skills: [...profile.skills, newCategory] };
    setProfile(updatedProfile);
    toast({ title: "Category Added", description: "You can now add skills to this category." });
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0a0d] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-headline font-bold text-xl">Connecting to Cloud...</p>
      </div>
    );
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold overflow-hidden border border-white/10 shrink-0">
          {profile.photoUrl ? <img src={profile.photoUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <h2 className="font-headline font-bold text-sm truncate">{profile.name}</h2>
          <p className="text-[10px] uppercase text-primary font-bold">Cloud Dashboard</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {TABS.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => {
              setActiveTab(tab.id);
              setIsMobileMenuOpen(false);
            }} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
          </button>
        ))}
        
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted-foreground transition-all mt-4 border-t border-white/5 pt-6">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>

      <div className="flex-1" />

      <div className="px-4 mb-6 mt-auto">
        <Button variant="ghost" size="sm" className="glass gap-2" onClick={() => window.open('/', '_blank')}>
          <Monitor className="w-4 h-4" /> Live Site
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0d0a0d] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 glass border-r border-white/5 flex-col p-6 sticky top-0 h-screen z-20">
        <NavContent />
      </aside>

      {/* Mobile Top Nav */}
      <div className="lg:hidden sticky top-0 z-30 w-full glass border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="glass h-10 w-10 rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0d0a0d] border-r border-white/10 p-6 pt-12 text-white">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="text-white font-headline font-bold text-xl uppercase tracking-tighter">Admin Console</SheetTitle>
                <SheetDescription className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Manage your profile sections</SheetDescription>
              </SheetHeader>
              <NavContent />
            </SheetContent>
          </Sheet>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold overflow-hidden">
            {profile.photoUrl ? <img src={profile.photoUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
          </div>
          <span className="font-headline font-bold text-sm">Console</span>
        </div>
        <Button variant="ghost" size="sm" className="glass" onClick={() => window.open('/', '_blank')}>
          <Monitor className="w-4 h-4 mr-2" /> Live
        </Button>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
        {!isConfigValid && (
          <Alert variant="destructive" className="mb-8 border-destructive/50 bg-destructive/10 text-white">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Firebase Not Connected</AlertTitle>
            <AlertDescription>
              Environment variables are missing. Please configure them in your Vercel Dashboard and redeploy.
            </AlertDescription>
          </Alert>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold uppercase tracking-tight">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-muted-foreground">Manage your portfolio in real-time</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <Button variant="outline" className="gap-2 glass flex-1 md:flex-none" onClick={() => window.open('/', '_blank')}><Monitor className="w-4 h-4" /> View Site</Button>
            {activeTab === 'education' && <Button onClick={() => { setCurrentEdu({ id: Date.now().toString(), institution: '', degree: '', duration: '', location: '' }); setIsEduModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> New Education</Button>}
            {activeTab === 'experience' && <Button onClick={() => { setCurrentExp({ id: Date.now().toString(), company: '', role: '', duration: '', desc: '', type: 'Internal' }); setIsExpModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> New Experience</Button>}
            {activeTab === 'projects' && <Button onClick={() => { setCurrentProj({ id: Date.now().toString(), title: '', type: 'Web App', category: 'Personal Project', imageUrl: '', techFront: '', techBack: '', techDb: '', link: '', status: 'Active', desc: '' }); setIsProjModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> New Project</Button>}
            {activeTab === 'certifications' && <Button onClick={() => { setCurrentCert({ id: Date.now().toString(), name: '', issuer: '', year: new Date().getFullYear().toString(), color: 'from-primary/10 to-accent/10', pdfUrl: '#' }); setIsCertModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> New Certificate</Button>}
          </div>
        </header>

        <div className="pb-24 lg:pb-10">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass border-primary/20"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Projects</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.projects?.length || 0}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.experiences?.length || 0}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.education?.length || 0}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Certificates</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.certifications?.length || 0}</CardContent></Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={(e) => { e.preventDefault(); persistData(profile); }} className="space-y-8">
              <Card className="glass">
                <CardHeader><CardTitle className="text-xl font-headline font-bold">Identity & Branding</CardTitle></CardHeader>
                <CardContent className="space-y-10">
                  <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="relative group shrink-0 mx-auto lg:mx-0">
                      <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-[3rem] overflow-hidden glass border-4 border-primary/20 shadow-2xl bg-muted/20 relative">
                        {profile.photoUrl ? (
                          <img src={profile.photoUrl} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-white/5">
                            <Camera className="w-12 h-12 opacity-20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button 
                             type="button" 
                             variant="secondary" 
                             onClick={() => fileInputRef.current?.click()}
                             className="gap-2"
                           >
                             <Upload className="w-4 h-4" /> Change Photo
                           </Button>
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => handlePhotoUpload(e, 'profile')} accept="image/*" className="hidden" />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label><Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="glass h-12" /></div>
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Professional Title</Label><Input value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} className="glass h-12" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Brand Name</Label><Input value={profile.brandName} onChange={(e) => setProfile({...profile, brandName: e.target.value})} className="glass h-12" /></div>
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Location</Label><Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="glass h-12" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email</Label><Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="glass h-12" /></div>
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="glass h-12" /></div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Professional Bio</Label>
                        <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="glass min-h-[140px] leading-relaxed" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader><CardTitle className="text-xl font-headline font-bold">Social Media Links</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground"><Linkedin className="w-3 h-3" /> LinkedIn</Label>
                    <Input value={profile.socials?.linkedin || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} className="glass h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground"><Github className="w-3 h-3" /> GitHub</Label>
                    <Input value={profile.socials?.github || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, github: e.target.value}})} className="glass h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground"><Facebook className="w-3 h-3" /> Facebook</Label>
                    <Input value={profile.socials?.facebook || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, facebook: e.target.value}})} className="glass h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground"><Instagram className="w-3 h-3" /> Instagram</Label>
                    <Input value={profile.socials?.instagram || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, instagram: e.target.value}})} className="glass h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground"><Music2 className="w-3 h-3" /> TikTok</Label>
                    <Input value={profile.socials?.tiktok || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, tiktok: e.target.value}})} className="glass h-12" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end sticky bottom-6 z-10">
                <Button type="submit" disabled={isSaving} className="bg-primary text-white px-10 shadow-2xl h-16 rounded-full font-bold text-lg hover:scale-105 transition-all">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8">
              {profile.skills.map((cat: any) => (
                <Card key={cat.id} className="glass">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-primary" />
                      <Input 
                        value={cat.title} 
                        onChange={(e) => {
                          const updated = profile.skills.map(c => c.id === cat.id ? { ...c, title: e.target.value } : c);
                          setProfile({ ...profile, skills: updated });
                        }}
                        className="glass font-bold text-lg bg-transparent border-none focus:ring-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        const updated = profile.skills.map(c => {
                          if (c.id === cat.id) return { ...c, items: [...(c.items || []), { id: Date.now().toString(), name: 'New Skill', level: 50 }] };
                          return c;
                        });
                        setProfile({ ...profile, skills: updated });
                      }} className="text-primary hover:bg-primary/10"><Plus className="w-4 h-4 mr-1" /> Skill</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                         const updated = profile.skills.filter(c => c.id !== cat.id);
                         setProfile({ ...profile, skills: updated });
                      }} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(cat.items || []).map((skill: any) => (
                      <div key={skill.id} className="flex flex-col md:flex-row items-center gap-6 p-4 glass rounded-2xl">
                        <div className="flex-1 w-full md:w-auto">
                          <Input 
                            value={skill.name} 
                            onChange={(e) => {
                              const updated = profile.skills.map(c => c.id === cat.id ? { ...c, items: c.items.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s) } : c);
                              setProfile({ ...profile, skills: updated });
                            }}
                            className="glass h-8 text-sm"
                          />
                        </div>
                        <div className="flex-[2] w-full md:w-auto flex items-center gap-4">
                          <Slider value={[skill.level]} max={100} step={1} onValueChange={(vals) => {
                             const updated = profile.skills.map(c => c.id === cat.id ? { ...c, items: c.items.map(s => s.id === skill.id ? { ...s, level: vals[0] } : s) } : c);
                             setProfile({ ...profile, skills: updated });
                          }} className="flex-1" />
                          <span className="text-xs font-bold text-primary w-10 text-right">{skill.level}%</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                           const updated = profile.skills.map(c => c.id === cat.id ? { ...c, items: c.items.filter(s => s.id !== skill.id) } : c);
                           setProfile({ ...profile, skills: updated });
                        }} className="text-destructive hover:bg-destructive/10 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-6 z-10">
                <Button onClick={handleAddSkillCategory} variant="outline" className="glass h-14 rounded-full px-8 font-bold gap-2">
                  <Plus className="w-5 h-5" /> Add Skill Category
                </Button>
                
                <Button onClick={() => persistData(profile)} disabled={isSaving} className="bg-primary text-white px-10 shadow-2xl h-14 rounded-full font-bold">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {['experience', 'education', 'projects', 'certifications'].includes(activeTab) && (
            <div className="grid gap-4">
              {activeTab === 'education' && (profile.education || []).map((edu: any) => (
                <Card key={edu.id} className="glass flex justify-between items-center p-6">
                  <div><h4 className="font-bold">{edu.institution}</h4><p className="text-xs text-muted-foreground">{edu.degree} • {edu.duration}</p></div>
                  <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { setCurrentEdu(edu); setIsEduModalOpen(true); }} className="text-primary hover:bg-primary/10"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteItem('education', edu.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></div>
                </Card>
              ))}
              {activeTab === 'experience' && (profile.experiences || []).map((exp: any) => (
                <Card key={exp.id} className="glass flex justify-between items-center p-6">
                  <div><h4 className="font-bold">{exp.role} at {exp.company}</h4><p className="text-xs text-muted-foreground">{exp.duration}</p></div>
                  <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { setCurrentExp(exp); setIsExpModalOpen(true); }} className="text-primary hover:bg-primary/10"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteItem('experiences', exp.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></div>
                </Card>
              ))}
              {activeTab === 'projects' && (profile.projects || []).map((proj: any) => (
                <Card key={proj.id} className="glass flex justify-between items-center p-6">
                  <div>
                    <h4 className="font-bold text-left">{proj.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground text-left">{proj.category} • {proj.status}</p>
                      {proj.techDb && <span className="text-[10px] text-primary font-bold flex items-center gap-1"><Database className="w-3 h-3" /> {proj.techDb}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { setCurrentProj(proj); setIsProjModalOpen(true); }} className="text-primary hover:bg-primary/10"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteItem('projects', proj.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></div>
                </Card>
              ))}
              {activeTab === 'certifications' && (profile.certifications || []).map((cert: any) => (
                <Card key={cert.id} className="glass flex justify-between items-center p-6">
                  <div><h4 className="font-bold">{cert.name}</h4><p className="text-xs text-muted-foreground">{cert.issuer} • {cert.year}</p></div>
                  <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { setCurrentCert(cert); setIsCertModalOpen(true); }} className="text-primary hover:bg-primary/10"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteItem('certifications', cert.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <Dialog open={isEduModalOpen} onOpenChange={setIsEduModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Education</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Institution</Label><Input value={currentEdu?.institution || ''} onChange={(e) => setCurrentEdu({...currentEdu, institution: e.target.value})} placeholder="e.g. Gunadarma University" className="glass" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Degree</Label><Input value={currentEdu?.degree || ''} onChange={(e) => setCurrentEdu({...currentEdu, degree: e.target.value})} placeholder="e.g. Bachelor of IT" className="glass" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Duration</Label><Input value={currentEdu?.duration || ''} onChange={(e) => setCurrentEdu({...currentEdu, duration: e.target.value})} placeholder="e.g. 2015 - 2019" className="glass" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Location</Label><Input value={currentEdu?.location || ''} onChange={(e) => setCurrentEdu({...currentEdu, location: e.target.value})} placeholder="e.g. Depok, Indonesia" className="glass" /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('education', currentEdu, setIsEduModalOpen)}>Save Education</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isExpModalOpen} onOpenChange={setIsExpModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Company</Label><Input value={currentExp?.company || ''} onChange={(e) => setCurrentExp({...currentExp, company: e.target.value})} placeholder="Company Name" className="glass" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Role</Label><Input value={currentExp?.role || ''} onChange={(e) => setCurrentExp({...currentExp, role: e.target.value})} placeholder="Job Title" className="glass" /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Duration</Label><Input value={currentExp?.duration || ''} onChange={(e) => setCurrentExp({...currentExp, duration: e.target.value})} placeholder="e.g. 2021 - Present" className="glass" /></div>
              <div className="relative space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Job Description</Label>
                <Textarea value={currentExp?.desc || ''} onChange={(e) => setCurrentExp({...currentExp, desc: e.target.value})} placeholder="Describe your responsibilities..." className="glass min-h-[150px]" />
                <Button 
                  onClick={() => handleAiRefine('work-experience', currentExp, setCurrentExp)} 
                  disabled={aiLoading}
                  className="absolute bottom-2 right-2 gap-2 bg-primary/20 hover:bg-primary text-xs"
                  size="sm"
                >
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Refine AI
                </Button>
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('experiences', currentExp, setIsExpModalOpen)}>Save Experience</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isProjModalOpen} onOpenChange={setIsProjModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white border-white/10 max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl glass overflow-hidden relative shrink-0 group">
                    {currentProj?.imageUrl ? (
                      <img src={currentProj.imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-white/5">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => projectImageRef.current?.click()}>
                        <Upload className="w-3 h-3 mr-2" /> Upload
                      </Button>
                    </div>
                  </div>
                  <input type="file" ref={projectImageRef} onChange={(e) => handlePhotoUpload(e, 'project')} accept="image/*" className="hidden" />

                  <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Title</Label>
                        <Input value={currentProj?.title || ''} onChange={(e) => setCurrentProj({...currentProj, title: e.target.value})} placeholder="Project Title" className="glass" />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Category</Label>
                        <Select 
                          value={currentProj?.category || 'Personal Project'} 
                          onValueChange={(val) => setCurrentProj({...currentProj, category: val})}
                        >
                          <SelectTrigger className="glass">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="glass bg-[#161116] text-white">
                            <SelectItem value="Personal Project">Personal Project</SelectItem>
                            <SelectItem value="Official Project">Official Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Type</Label>
                        <Input value={currentProj?.type || ''} onChange={(e) => setCurrentProj({...currentProj, type: e.target.value})} placeholder="e.g. Web App" className="glass" />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</Label>
                        <Input value={currentProj?.status || ''} onChange={(e) => setCurrentProj({...currentProj, status: e.target.value})} placeholder="e.g. Completed" className="glass" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Frontend Tech</Label>
                    <Input value={currentProj?.techFront || ''} onChange={(e) => setCurrentProj({...currentProj, techFront: e.target.value})} placeholder="e.g. React" className="glass" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Backend Tech</Label>
                    <Input value={currentProj?.techBack || ''} onChange={(e) => setCurrentProj({...currentProj, techBack: e.target.value})} placeholder="e.g. Node.js" className="glass" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Database</Label>
                    <Input value={currentProj?.techDb || ''} onChange={(e) => setCurrentProj({...currentProj, techDb: e.target.value})} placeholder="e.g. PostgreSQL" className="glass" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Project Link</Label>
                    <Input value={currentProj?.link || ''} onChange={(e) => setCurrentProj({...currentProj, link: e.target.value})} placeholder="https://..." className="glass" />
                  </div>
                  <div className="relative space-y-1.5 text-left">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Description</Label>
                    <Textarea value={currentProj?.desc || ''} onChange={(e) => setCurrentProj({...currentProj, desc: e.target.value})} placeholder="Describe the project..." className="glass min-h-[120px]" />
                    <Button 
                      onClick={() => handleAiRefine('portfolio-project', currentProj, setCurrentProj)} 
                      disabled={aiLoading}
                      className="absolute bottom-2 right-2 gap-2 bg-primary/20 hover:bg-primary text-xs"
                      size="sm"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Refine AI
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sticky bottom-0 bg-[#161116] pt-2">
              <Button onClick={() => handleSaveCollection('projects', currentProj, setIsProjModalOpen)} className="w-full sm:w-auto">Save Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Certificate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 text-left">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Certificate Name</Label>
                <Input value={currentCert?.name || ''} onChange={(e) => setCurrentCert({...currentCert, name: e.target.value})} placeholder="e.g. AWS Certified Developer" className="glass" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Issuer</Label>
                <Input value={currentCert?.issuer || ''} onChange={(e) => setCurrentCert({...currentCert, issuer: e.target.value})} placeholder="e.g. Amazon Web Services" className="glass" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Year</Label>
                <Input value={currentCert?.year || ''} onChange={(e) => setCurrentCert({...currentCert, year: e.target.value})} placeholder="e.g. 2024" className="glass" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Link Preview / Credential URL</Label>
                <Input value={currentCert?.pdfUrl || ''} onChange={(e) => setCurrentCert({...currentCert, pdfUrl: e.target.value})} placeholder="https://..." className="glass" />
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('certifications', currentCert, setIsCertModalOpen)}>Save Certificate</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

const TABS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'skills', icon: Wrench, label: 'Skills' },
  { id: 'education', icon: GraduationCap, label: 'Education' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'projects', icon: Code, label: 'Projects' },
  { id: 'certifications', icon: Award, label: 'Certificates' }
];
