/**
 * @fileOverview Centralized constants for the portfolio to ensure consistency across components.
 */

export const PROFILE_DATA = {
  name: "Andi Ogie",
  title: "Middleware Integration Specialist & Laravel Developer",
  bio: "A highly dedicated Middleware Specialist and Fullstack Developer with extensive experience in architecting seamless integrations and building robust web applications.",
  email: "andiogie@gmail.com",
  phone: "+62 838 9740 5021",
  location: "Jakarta, Indonesia",
  brandName: "DevOgie",
  photoUrl: "https://images.unsplash.com/photo-1737574107736-9e02ca5d5387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzIwMTc1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  socials: {
    linkedin: "https://www.linkedin.com/in/andiogie/",
    github: "https://github.com/andiogie",
    facebook: "https://www.facebook.com/ogie.aa",
    instagram: "https://www.instagram.com/andi.ogie/",
    tiktok: "https://www.tiktok.com/@andi.ogie"
  },
  education: [
    {
      id: "edu1",
      institution: "Gunadarma University",
      degree: "Bachelor of Information Technology",
      duration: "2015 - 2019",
      location: "Depok, Indonesia"
    }
  ],
  skills: [
    {
      id: "cat1",
      title: "Middleware & API",
      items: [
        { id: "s1", name: "webMethods", level: 95 },
        { id: "s2", name: "TIBCO", level: 85 },
        { id: "s3", name: "Oracle WebLogic", level: 80 },
        { id: "s4", name: "IBM API Connect", level: 85 },
      ]
    },
    {
      id: "cat2",
      title: "Development Stack",
      items: [
        { id: "s5", name: "PHP Laravel", level: 92 },
        { id: "s6", name: "Java", level: 75 },
        { id: "s7", name: "React / NextJS", level: 88 },
        { id: "s8", name: "Tailwind CSS", level: 95 },
      ]
    },
    {
      id: "cat3",
      title: "Data & Infrastructure",
      items: [
        { id: "s9", name: "Oracle DB", level: 85 },
        { id: "s10", name: "PostgreSQL", level: 80 },
        { id: "s11", name: "JIRA / Agile", level: 90 },
        { id: "s12", name: "AWS", level: 75 },
      ]
    }
  ],
  experiences: [
    {
      id: "1",
      company: "MNC Bank",
      role: "API Platform Engineer",
      duration: "2023 - Present",
      desc: "Managed high-traffic API ecosystem, ensuring 99.9% uptime and security for banking operations.",
      type: "Internal"
    },
    {
      id: "2",
      company: "Bank UOB",
      role: "IT Application Support & Delivery",
      duration: "2021 - 2023",
      desc: "Led application delivery cycles and provided critical support for core banking systems.",
      type: "Internal"
    },
    {
      id: "3",
      company: "PT Indocyber Global Teknologi",
      role: "webMethods Developer",
      duration: "2020 - 2021",
      desc: "Designed and implemented B2B integrations using Software AG webMethods suite.",
      type: "Vendor"
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Futsal Booking System",
      type: "Web Application",
      category: "Side Project",
      imageUrl: "https://images.unsplash.com/photo-1770368787779-8472da646193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxkYXNoYm9hcmQlMjBzb2Z0d2FyZXxlbnwwfHx8fDE3NzIwNjk4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      techFront: "HTML + Tailwind + Bootstrap",
      techBack: "Laravel API",
      techDb: "MySQL",
      link: "https://futsalmanagementsystem-production.up.railway.app/",
      status: "Private Deployment",
      desc: "A comprehensive booking platform for futsal courts with real-time availability tracking."
    },
    {
      id: "p2",
      title: "School Management System",
      type: "ERP Platform",
      category: "Side Project",
      imageUrl: "https://images.unsplash.com/photo-1762330915716-69ffffeeee95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxlZHVjYXRpb24lMjBhcHB8ZW58MHx8fHwxNzcyMDc4OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      techFront: "HTML + Bootstrap",
      techBack: "Laravel",
      techDb: "MySQL",
      link: "#",
      status: "Development",
      desc: "An ERP solution for schools to manage student data, grades, and administrative tasks."
    },
    {
      id: "p3",
      title: "API Gateway Integration",
      type: "Middleware Solution",
      category: "Official Project",
      imageUrl: "https://images.unsplash.com/photo-1610056494249-5d7f111cf78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW50ZWdyYXRpb258ZW58MHx8fHwxNzcyMDc4OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      techFront: "React Dashboard",
      techBack: "webMethods / IBM API Connect",
      techDb: "Oracle DB",
      link: "#",
      status: "Completed",
      desc: "Architected and implemented enterprise-level API gateway for secure financial transactions."
    }
  ],
  certifications: [
    {
      id: "c1",
      name: "Software AG webMethods Certifications",
      issuer: "Software AG",
      year: "2023",
      color: "from-blue-500/20 to-blue-600/20",
      pdfUrl: "#"
    },
    {
      id: "c2",
      name: "AWS reStart Program",
      issuer: "Amazon Web Services",
      year: "2022",
      color: "from-orange-500/20 to-orange-600/20",
      pdfUrl: "#"
    },
    {
      id: "c3",
      name: "TIBCO Spotfire Professional",
      issuer: "TIBCO Software",
      year: "2021",
      color: "from-red-500/20 to-red-600/20",
      pdfUrl: "#"
    }
  ]
};
