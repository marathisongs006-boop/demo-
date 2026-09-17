export const initialSeedData = {
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@vinayakpadole.dev',
    // Hash for "Admin@Vinayak2026!"
    passwordHash: '$2a$10$wT0lGzOhyO1m6WdkhzC8A.eWb6t3V7HhW1H374h.wQZtMpm7O1jvy',
    name: 'Vinayak Padole'
  },
  profile: {
    id: 'default',
    fullName: 'Vinayak Padole',
    professionalTitle: 'Web Developer',
    shortIntro: 'I build modern, responsive and user-friendly websites and web applications.',
    aboutText: 'I am a passionate Web Developer with a strong focus on crafting performant, accessible, and elegant digital experiences. Combining modern frontend frameworks with solid architectural principles, I specialize in building responsive web applications that solve real-world problems and deliver exceptional user experiences.',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    resumeUrl: '',
    availabilityEnabled: true,
    availabilityText: 'Available for Freelance & Full-time Roles',
    email: 'contact@vinayakpadole.dev',
    phone: '+91 98765 43210',
    location: 'Maharashtra, India',
    yearsOfExperience: '4+',
    completedProjects: '25+',
    happyClients: '15+',
    updatedAt: new Date().toISOString()
  },
  skills: [
    {
      id: 'skill-1',
      name: 'React.js',
      icon: 'Code2',
      percentage: 95,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: 1
    },
    {
      id: 'skill-2',
      name: 'TypeScript',
      icon: 'FileCode',
      percentage: 90,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: 2
    },
    {
      id: 'skill-3',
      name: 'JavaScript (ES6+)',
      icon: 'Braces',
      percentage: 96,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: 3
    },
    {
      id: 'skill-4',
      name: 'Tailwind CSS',
      icon: 'Palette',
      percentage: 94,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: 4
    },
    {
      id: 'skill-5',
      name: 'HTML5 & CSS3',
      icon: 'Layout',
      percentage: 98,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: 5
    },
    {
      id: 'skill-6',
      name: 'Next.js',
      icon: 'Globe',
      percentage: 88,
      category: 'Frontend',
      featured: true,
      visible: true,
      sortOrder: 6
    },
    {
      id: 'skill-7',
      name: 'Node.js & Express',
      icon: 'Server',
      percentage: 88,
      category: 'Backend',
      featured: true,
      visible: true,
      sortOrder: 7
    },
    {
      id: 'skill-8',
      name: 'RESTful API Design',
      icon: 'Network',
      percentage: 92,
      category: 'Backend',
      featured: true,
      visible: true,
      sortOrder: 8
    },
    {
      id: 'skill-9',
      name: 'PostgreSQL & MongoDB',
      icon: 'Database',
      percentage: 84,
      category: 'Backend',
      featured: true,
      visible: true,
      sortOrder: 9
    },
    {
      id: 'skill-10',
      name: 'Git & Version Control',
      icon: 'GitBranch',
      percentage: 92,
      category: 'Tools',
      featured: true,
      visible: true,
      sortOrder: 10
    },
    {
      id: 'skill-11',
      name: 'Figma & UI Design',
      icon: 'Layers',
      percentage: 82,
      category: 'Tools',
      featured: true,
      visible: true,
      sortOrder: 11
    },
    {
      id: 'skill-12',
      name: 'Performance & SEO',
      icon: 'Zap',
      percentage: 90,
      category: 'Tools',
      featured: true,
      visible: true,
      sortOrder: 12
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'NexStore - Modern E-Commerce Platform',
      slug: 'nexstore-ecommerce-platform',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
      description: 'A full-featured digital commerce application with responsive product catalog, cart management, and seamless checkout experience.',
      fullDescription: 'NexStore is an enterprise-grade e-commerce application designed for high conversion and smooth shopping experiences. Built with React, Tailwind CSS, and Node.js REST APIs, featuring real-time inventory lookup, instant client-side filtering, and responsive mobile-optimized cart workflows.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST API', 'Stripe'],
      liveUrl: 'https://example.com/demo/nexstore',
      githubUrl: 'https://github.com/example/nexstore',
      featured: true,
      visible: true,
      sortOrder: 1,
      createdAt: '2026-01-15T10:00:00.000Z'
    },
    {
      id: 'proj-2',
      title: 'PulseAnalytics - SaaS Performance Dashboard',
      slug: 'pulseanalytics-saas-dashboard',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      description: 'Comprehensive business analytics portal with interactive visual charts, customizable widget layouts, and live metric tracking.',
      fullDescription: 'PulseAnalytics provides real-time visibility into business performance and user analytics. Features rich SVG data visualization charts, customizable date rangers, dynamic dark/light theme switching, and instant metrics export capabilities.',
      technologies: ['React', 'Tailwind CSS', 'Chart.js', 'TypeScript', 'Express', 'JWT'],
      liveUrl: 'https://example.com/demo/pulseanalytics',
      githubUrl: 'https://github.com/example/pulseanalytics',
      featured: true,
      visible: true,
      sortOrder: 2,
      createdAt: '2026-03-20T14:30:00.000Z'
    },
    {
      id: 'proj-3',
      title: 'TaskFlow - Collaborative Workflow Suite',
      slug: 'taskflow-collaborative-workflow',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
      description: 'Agile team management and Kanban board application with drag-and-drop task organization, priority tags, and activity timelines.',
      fullDescription: 'TaskFlow streamlines team productivity through an intuitive Kanban interface, custom tags, real-time status updates, and milestone tracking. Built with accessible React components and lightning-fast state synchronization.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      liveUrl: 'https://example.com/demo/taskflow',
      githubUrl: 'https://github.com/example/taskflow',
      featured: true,
      visible: true,
      sortOrder: 3,
      createdAt: '2026-05-10T09:15:00.000Z'
    },
    {
      id: 'proj-4',
      title: 'Zenith - Dev Blog & Technical Documentation',
      slug: 'zenith-dev-docs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      description: 'Lightning-fast developer portal and markdown documentation hub with syntax highlighting, search index, and reading time calculators.',
      fullDescription: 'A modern content hub built for technical publications with sub-second page loads, automated table of contents, full-text fuzzy search, and optimized OpenGraph social sharing preview cards.',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'Markdown', 'SEO'],
      liveUrl: 'https://example.com/demo/zenith-docs',
      githubUrl: 'https://github.com/example/zenith-docs',
      featured: false,
      visible: true,
      sortOrder: 4,
      createdAt: '2026-07-02T16:45:00.000Z'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Web Developer',
      company: 'TechCraft Solutions',
      startDate: '2024-03',
      endDate: '',
      current: true,
      description: 'Lead the frontend engineering team in building scalable React web applications, establishing responsive design systems, and improving client loading performance by 40%.',
      visible: true,
      sortOrder: 1
    },
    {
      id: 'exp-2',
      role: 'Web Developer',
      company: 'Innovate Digital Agency',
      startDate: '2022-06',
      endDate: '2024-02',
      current: false,
      description: 'Developed responsive client websites, interactive web dashboards, and integrated RESTful backend APIs with modern JavaScript and Tailwind CSS.',
      visible: true,
      sortOrder: 2
    },
    {
      id: 'exp-3',
      role: 'Frontend Developer Intern',
      company: 'Apex Code Labs',
      startDate: '2021-08',
      endDate: '2022-05',
      current: false,
      description: 'Collaborated on user interface development, cross-browser compatibility testing, and created reusable UI component libraries.',
      visible: true,
      sortOrder: 3
    }
  ],
  services: [
    {
      id: 'serv-1',
      title: 'Web Application Development',
      description: 'Building modern, fast, and scalable web applications from scratch using React, TypeScript, and robust backend architectures.',
      icon: 'Code',
      visible: true,
      sortOrder: 1
    },
    {
      id: 'serv-2',
      title: 'Responsive UI / UX Design',
      description: 'Crafting pixel-perfect, mobile-first interfaces that deliver smooth interactions and intuitive navigation across all screen sizes.',
      icon: 'Layout',
      visible: true,
      sortOrder: 2
    },
    {
      id: 'serv-3',
      title: 'REST API & Backend Integration',
      description: 'Designing and connecting secure REST APIs, authentication workflows, database persistence, and external service webhooks.',
      icon: 'Server',
      visible: true,
      sortOrder: 3
    },
    {
      id: 'serv-4',
      title: 'Performance & SEO Optimization',
      description: 'Auditing and optimizing web speed, Core Web Vitals, metadata, search indexability, and cross-browser accessibility.',
      icon: 'Zap',
      visible: true,
      sortOrder: 4
    }
  ],
  socialLinks: [
    {
      id: 'soc-github',
      platform: 'GitHub',
      url: 'https://github.com/vinayakpadole',
      label: 'GitHub',
      icon: 'Github',
      visible: true,
      sortOrder: 1
    },
    {
      id: 'soc-linkedin',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/vinayakpadole',
      label: 'LinkedIn',
      icon: 'Linkedin',
      visible: true,
      sortOrder: 2
    },
    {
      id: 'soc-whatsapp',
      platform: 'WhatsApp',
      url: '+919876543210',
      label: 'WhatsApp',
      icon: 'MessageSquare',
      visible: true,
      sortOrder: 3
    },
    {
      id: 'soc-twitter',
      platform: 'X/Twitter',
      url: 'https://twitter.com/vinayakpadole',
      label: 'X (Twitter)',
      icon: 'Twitter',
      visible: false,
      sortOrder: 4
    },
    {
      id: 'soc-instagram',
      platform: 'Instagram',
      url: '',
      label: 'Instagram',
      icon: 'Instagram',
      visible: false,
      sortOrder: 5
    },
    {
      id: 'soc-facebook',
      platform: 'Facebook',
      url: '',
      label: 'Facebook',
      icon: 'Facebook',
      visible: false,
      sortOrder: 6
    },
    {
      id: 'soc-youtube',
      platform: 'YouTube',
      url: '',
      label: 'YouTube',
      icon: 'Youtube',
      visible: false,
      sortOrder: 7
    },
    {
      id: 'soc-email',
      platform: 'Email',
      url: 'contact@vinayakpadole.dev',
      label: 'Email',
      icon: 'Mail',
      visible: true,
      sortOrder: 8
    }
  ],
  siteSettings: {
    siteTitle: 'Vinayak Padole | Professional Web Developer',
    metaDescription: 'Vinayak Padole - Web Developer Portfolio. Building modern, responsive, and user-friendly web applications.',
    theme: 'system',
    accentColor: '#f97316',
    copyrightText: '© 2026 Vinayak Padole. All rights reserved.',
    updatedAt: new Date().toISOString()
  },
  contactMessages: [
    {
      id: 'msg-seed-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      subject: 'Frontend Project Inquiry',
      message: 'Hi Vinayak, I saw your portfolio and was impressed by your work. We are looking for a Web Developer for a 3-month project.',
      createdAt: '2026-09-15T10:20:00.000Z',
      status: 'unread'
    }
  ]
};
