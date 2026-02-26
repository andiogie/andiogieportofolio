
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
  Image as ImageIcon,
  Wrench,
  Settings,
  ExternalLink,
  Menu,
  X,
  Upload,
  Camera
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

const STORAGE_KEY = 'andi_ogie_portfolio_v1';

const TABS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'skills', icon: Wrench, label: 'Skills' },
  { id: 'education', icon: GraduationCap, label: 'Education' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'projects', icon: Code, label: 'Projects' },
  { id: 'certifications', icon: Award, label: 'Certifications' }
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiLoading, setAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<any>(null);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [currentProj, setCurrentProj] = useState<any>(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<any>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<any>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [currentSkillCat, setCurrentSkillCat] = useState<any>(null);

  const [profile, setProfile] = useState(PROFILE_DATA);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const merged = { ...PROFILE_DATA, ...parsed };
          setProfile(merged);
        } catch (e) {
          setProfile(PROFILE_DATA);
        }
      } else {
        setProfile(PROFILE_DATA);
      }
      setIsLoadingData(false);
    };
    loadData();
  }, []);

  const persistData = (updatedProfile: any) => {
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Changes Saved",
        description: "Your portfolio content has been updated locally.",
      });
    }, 500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 2MB for local storage performance.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile({ ...profile, photoUrl: base64String });
        toast({
          title: "Photo Prepared",
          description: "Click 'Save Profile Changes' to make it permanent.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiRefinement = async (type: 'work-experience' | 'portfolio-project') => {
    setAiLoading(true);
    try {
      const result = await aiAssistedDescriptionGeneration({
        contextType: type,
        contextDetails: {
          companyName: type === 'work-experience' ? currentExp?.company : undefined,
          position: type === 'work-experience' ? currentExp?.role : undefined,
          projectName: type === 'portfolio-project' ? currentProj?.title : undefined,
          technologiesUsed: type === 'portfolio-project' ? `${currentProj?.techFront}, ${currentProj?.techBack}` : undefined,
        },
        originalDescription: type === 'work-experience' ? currentExp?.desc : currentProj?.desc
      });
      if (type === 'work-experience') setCurrentExp({ ...currentExp, desc: result.generatedDescription });
      else setCurrentProj({ ...currentProj, desc: result.generatedDescription });
      toast({ title: "AI Refined", description: "Description updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Generation Error", description: "Check your GEMINI_API_KEY." });
    } finally {
      setAiLoading(false);
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
    if (!confirm("Are you sure you want to delete this item?")) return;
    const collection = (profile[collectionName as keyof typeof profile] as any[] || []).filter((i: any) => i.id !== id);
    const updatedProfile = { ...profile, [collectionName]: collection };
    setProfile(updatedProfile);
    persistData(updatedProfile);
  };

  const handleAddSkillToCategory = (catId: string) => {
    const updatedSkills = profile.skills.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: [...cat.items, { id: Date.now().toString(), name: 'New Skill', level: 50 }]
        };
      }
      return cat;
    });
    const updatedProfile = { ...profile, skills: updatedSkills };
    setProfile(updatedProfile);
    persistData(updatedProfile);
  };

  const handleUpdateSkillItem = (catId: string, skillId: string, field: string, value: any) => {
    const updatedSkills = profile.skills.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.map(s => s.id === skillId ? { ...s, [field]: value } : s)
        };
      }
      return cat;
    });
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleDeleteSkillItem = (catId: string, skillId: string) => {
    const updatedSkills = profile.skills.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.filter(s => s.id !== skillId)
        };
      }
      return cat;
    });
    const updatedProfile = { ...profile, skills: updatedSkills };
    setProfile(updatedProfile);
    persistData(updatedProfile);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0a0d] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-headline font-bold text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  const NavContent = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3 px-4 mb-2 lg:mb-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold overflow-hidden border border-white/10 shrink-0">
          {profile.photoUrl ? <img src={profile.photoUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
        </div>
        <div>
          <h2 className="font-headline font-bold text-sm truncate max-w-[120px]">{profile.name}</h2>
          <p className="text-[10px] uppercase text-primary font-bold">Admin Console</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
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
      </nav>

      <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted-foreground transition-all">
        <LogOut className="w-5 h-5" /> Back to Site
      </button>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0d0a0d] text-white">
      <div className="lg:hidden flex items-center justify-between p-4 glass border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs font-bold">
            {profile.name?.charAt(0)}
          </div>
          <span className="font-headline font-bold text-sm tracking-tight">Admin Panel</span>
        </div>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl glass h-10 w-10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0d0a0d] border-r border-white/5 p-6 w-[280px]">
            <SheetHeader className="sr-only text-left mb-6">
              <SheetTitle className="text-primary font-bold">Admin Navigation</SheetTitle>
              <SheetDescription>Access different dashboard management sections</SheetDescription>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:flex w-72 glass border-r border-white/5 flex-col p-6 space-y-6 sticky top-0 h-screen z-20">
        <NavContent />
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold uppercase tracking-tight">{activeTab}</h1>
            <p className="text-sm text-muted-foreground">Manage your portfolio data locally</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <Button variant="outline" className="gap-2 glass flex-1 md:flex-none" onClick={() => window.open('/', '_blank')}><Monitor className="w-4 h-4" /> View Site</Button>
            {activeTab === 'skills' && <Button onClick={() => { setCurrentSkillCat({ id: Date.now().toString(), title: '', items: [] }); setIsSkillModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> Add Category</Button>}
            {activeTab === 'education' && <Button onClick={() => { setCurrentEdu({ id: Date.now().toString(), institution: '', degree: '', duration: '', location: '' }); setIsEduModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> Add Education</Button>}
            {activeTab === 'experience' && <Button onClick={() => { setCurrentExp({ id: Date.now().toString(), company: '', role: '', duration: '', desc: '', type: 'Internal' }); setIsExpModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> Add Experience</Button>}
            {activeTab === 'projects' && <Button onClick={() => { setCurrentProj({ id: Date.now().toString(), title: '', type: 'Web App', category: 'Side Project', imageUrl: '', techFront: '', techBack: '', techDb: '', link: '', status: 'Active', desc: '' }); setIsProjModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> Add Project</Button>}
            {activeTab === 'certifications' && <Button onClick={() => { setCurrentCert({ id: Date.now().toString(), name: '', issuer: '', year: '', pdfUrl: '' }); setIsCertModalOpen(true); }} className="gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> Add Certification</Button>}
          </div>
        </header>

        <div className="pb-24 lg:pb-10">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass border-primary/20"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Projects</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.projects?.length || 0}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experiences</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.experiences?.length || 0}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.skills?.reduce((acc, cat) => acc + cat.items.length, 0) || 0}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Certifications</CardTitle></CardHeader><CardContent className="text-3xl font-headline font-bold">{profile.certifications?.length || 0}</CardContent></Card>
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
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        Profile Image
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label><Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="glass h-12" /></div>
                        <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Professional Title</Label><Input value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} className="glass h-12" /></div>
                      </div>
                      <div className="space-y-2"><Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Brand/Logo Name</Label><Input value={profile.brandName} onChange={(e) => setProfile({...profile, brandName: e.target.value})} className="glass h-12" /></div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Professional Bio Summary</Label>
                        <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="glass min-h-[140px] leading-relaxed" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2"><Label>Email</Label><Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="glass" /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="glass" /></div>
                  <div className="space-y-2"><Label>Location</Label><Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="glass" /></div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader><CardTitle className="text-lg">Social Media URLs</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>LinkedIn</Label><Input value={profile.socials?.linkedin || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} className="glass" /></div>
                  <div className="space-y-2"><Label>GitHub</Label><Input value={profile.socials?.github || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, github: e.target.value}})} className="glass" /></div>
                  <div className="space-y-2"><Label>Instagram</Label><Input value={profile.socials?.instagram || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, instagram: e.target.value}})} className="glass" /></div>
                  <div className="space-y-2"><Label>Facebook</Label><Input value={profile.socials?.facebook || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, facebook: e.target.value}})} className="glass" /></div>
                  <div className="space-y-2"><Label>TikTok</Label><Input value={profile.socials?.tiktok || ''} onChange={(e) => setProfile({...profile, socials: {...profile.socials, tiktok: e.target.value}})} className="glass" /></div>
                </CardContent>
              </Card>

              <div className="flex justify-end sticky bottom-6 z-10">
                <Button type="submit" disabled={isSaving} className="bg-primary px-10 shadow-2xl h-16 rounded-full text-white font-bold text-lg hover:scale-105 transition-all">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                  Save Profile Changes
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
                      <Settings className="w-5 h-5 text-primary" />
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
                      <Button variant="ghost" size="sm" onClick={() => handleAddSkillToCategory(cat.id)} className="text-primary hover:bg-primary/10"><Plus className="w-4 h-4 mr-1" /> Skill</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteItem('skills', cat.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cat.items.map((skill: any) => (
                      <div key={skill.id} className="flex flex-col md:flex-row items-center gap-6 p-4 glass rounded-2xl">
                        <div className="flex-1 w-full md:w-auto">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Skill Name</Label>
                          <Input 
                            value={skill.name} 
                            onChange={(e) => handleUpdateSkillItem(cat.id, skill.id, 'name', e.target.value)}
                            className="glass h-8 text-sm"
                          />
                        </div>
                        <div className="flex-[2] w-full md:w-auto space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Proficiency</Label>
                            <span className="text-xs font-bold text-primary">{skill.level}%</span>
                          </div>
                          <Slider value={[skill.level]} max={100} step={1} onValueChange={(vals) => handleUpdateSkillItem(cat.id, skill.id, 'level', vals[0])} className="py-2" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSkillItem(cat.id, skill.id)} className="text-destructive hover:bg-destructive/10 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-end sticky bottom-6 z-10">
                <Button onClick={() => persistData(profile)} disabled={isSaving} className="bg-primary px-8 shadow-2xl h-14 rounded-full text-white">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Save Skills Changes
                </Button>
              </div>
            </div>
          )}

          {['education', 'experience', 'projects', 'certifications'].includes(activeTab) && (
            <div className="grid gap-4">
              {activeTab === 'education' && (profile.education || []).map((edu: any) => (
                <Card key={edu.id} className="glass flex justify-between items-center p-6">
                  <div><h4 className="font-bold">{edu.institution}</h4><p className="text-sm text-muted-foreground">{edu.degree}</p></div>
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
                  <div><h4 className="font-bold">{proj.title}</h4><p className="text-xs text-muted-foreground">{proj.category} • {proj.status}</p></div>
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

        <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white">
            <DialogHeader>
              <DialogTitle>New Skill Category</DialogTitle>
              <DialogDescription>Create a new category to organize your technical skills.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4"><div className="space-y-2"><Label>Category Title</Label><Input value={currentSkillCat?.title || ''} onChange={(e) => setCurrentSkillCat({...currentSkillCat, title: e.target.value})} className="glass" placeholder="e.g. Frontend Development" /></div></div>
            <DialogFooter><Button onClick={() => handleSaveCollection('skills', currentSkillCat, setIsSkillModalOpen)}>Create Category</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEduModalOpen} onOpenChange={setIsEduModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white">
            <DialogHeader>
              <DialogTitle>Education Entry</DialogTitle>
              <DialogDescription>Add or edit details about your academic background.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Institution</Label><Input value={currentEdu?.institution || ''} onChange={(e) => setCurrentEdu({...currentEdu, institution: e.target.value})} className="glass" /></div>
              <div className="space-y-2"><Label>Degree</Label><Input value={currentEdu?.degree || ''} onChange={(e) => setCurrentEdu({...currentEdu, degree: e.target.value})} className="glass" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Duration</Label><Input value={currentEdu?.duration || ''} onChange={(e) => setCurrentEdu({...currentEdu, duration: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Location</Label><Input value={currentEdu?.location || ''} onChange={(e) => setCurrentEdu({...currentEdu, location: e.target.value})} className="glass" /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('education', currentEdu, setIsEduModalOpen)}>Save Education</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isExpModalOpen} onOpenChange={setIsExpModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Experience Entry</DialogTitle>
              <DialogDescription>Manage your professional history and responsibilities.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company</Label><Input value={currentExp?.company || ''} onChange={(e) => setCurrentExp({...currentExp, company: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Role</Label><Input value={currentExp?.role || ''} onChange={(e) => setCurrentExp({...currentExp, role: e.target.value})} className="glass" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Duration</Label><Input value={currentExp?.duration || ''} onChange={(e) => setCurrentExp({...currentExp, duration: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Type</Label><Input value={currentExp?.type || ''} onChange={(e) => setCurrentExp({...currentExp, type: e.target.value})} className="glass" /></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><Label>Description</Label><Button size="sm" variant="ghost" onClick={() => handleAiRefinement('work-experience')} disabled={aiLoading} className="text-[10px] gap-1 text-primary hover:bg-primary/10"><Sparkles className="w-3 h-3" /> AI Refine</Button></div>
                <Textarea value={currentExp?.desc || ''} onChange={(e) => setCurrentExp({...currentExp, desc: e.target.value})} className="glass min-h-[150px]" />
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('experiences', currentExp, setIsExpModalOpen)}>Save Experience</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isProjModalOpen} onOpenChange={setIsProjModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Project Entry</DialogTitle>
              <DialogDescription>Add details about your personal or professional projects.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={currentProj?.title || ''} onChange={(e) => setCurrentProj({...currentProj, title: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Category (Side/Official)</Label><Input value={currentProj?.category || ''} onChange={(e) => setCurrentProj({...currentProj, category: e.target.value})} className="glass" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Frontend</Label><Input value={currentProj?.techFront || ''} onChange={(e) => setCurrentProj({...currentProj, techFront: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Backend</Label><Input value={currentProj?.techBack || ''} onChange={(e) => setCurrentProj({...currentProj, techBack: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Database</Label><Input value={currentProj?.techDb || ''} onChange={(e) => setCurrentProj({...currentProj, techDb: e.target.value})} className="glass" /></div>
              </div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={currentProj?.imageUrl || ''} onChange={(e) => setCurrentProj({...currentProj, imageUrl: e.target.value})} className="glass" /></div>
              <div className="space-y-2"><Label>Project Link</Label><Input value={currentProj?.link || ''} onChange={(e) => setCurrentProj({...currentProj, link: e.target.value})} className="glass" /></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><Label>Description</Label><Button size="sm" variant="ghost" onClick={() => handleAiRefinement('portfolio-project')} disabled={aiLoading} className="text-[10px] gap-1 text-primary hover:bg-primary/10"><Sparkles className="w-3 h-3" /> AI Refine</Button></div>
                <Textarea value={currentProj?.desc || ''} onChange={(e) => setCurrentProj({...currentProj, desc: e.target.value})} className="glass min-h-[100px]" />
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('projects', currentProj, setIsProjModalOpen)}>Save Project</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
          <DialogContent className="glass bg-[#161116] text-white">
            <DialogHeader>
              <DialogTitle>Certification Entry</DialogTitle>
              <DialogDescription>Record your professional certificates and credentials.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Certification Name</Label><Input value={currentCert?.name || ''} onChange={(e) => setCurrentCert({...currentCert, name: e.target.value})} className="glass" /></div>
              <div className="space-y-2"><Label>Issuer</Label><Input value={currentCert?.issuer || ''} onChange={(e) => setCurrentCert({...currentCert, issuer: e.target.value})} className="glass" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Year</Label><Input value={currentCert?.year || ''} onChange={(e) => setCurrentCert({...currentCert, year: e.target.value})} className="glass" /></div>
                <div className="space-y-2"><Label>Credential Link</Label><Input value={currentCert?.pdfUrl || ''} onChange={(e) => setCurrentCert({...currentCert, pdfUrl: e.target.value})} className="glass" /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => handleSaveCollection('certifications', currentCert, setIsCertModalOpen)}>Save Certification</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
