import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './db.js';
import { requireAuth, generateToken, comparePassword, hashPassword } from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed: Images (JPG, PNG, WEBP, SVG, GIF) and PDF documents.'));
    }
  }
});

// Helper for dynamic social links: filter only enabled platforms with non-empty URL
const filterActiveSocials = (socials) => {
  if (!Array.isArray(socials)) return [];
  return socials
    .filter(item => item.visible && item.url && item.url.trim() !== '')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
};

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

// Aggregated public data endpoint (Fast Single Fetch)
app.get('/api/public-data', (req, res) => {
  try {
    const profile = db.get('profile');
    const skills = (db.get('skills') || [])
      .filter(s => s.visible)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const projects = (db.get('projects') || [])
      .filter(p => p.visible)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const experience = (db.get('experience') || [])
      .filter(e => e.visible)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const services = (db.get('services') || [])
      .filter(s => s.visible)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const socialLinks = filterActiveSocials(db.get('socialLinks'));
    const siteSettings = db.get('siteSettings');

    res.json({
      profile,
      skills,
      projects,
      experience,
      services,
      socialLinks,
      siteSettings
    });
  } catch (err) {
    console.error('Error fetching public data:', err);
    res.status(500).json({ error: 'Failed to retrieve portfolio data.' });
  }
});

// Contact Form Submission
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newMessage = db.insert('contactMessages', {
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'General Portfolio Inquiry').trim(),
      message: message.trim(),
      status: 'unread'
    });

    res.status(201).json({ success: true, message: 'Message sent successfully! Vinayak will get back to you soon.' });
  } catch (err) {
    console.error('Error processing contact message:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email/username and password are required.' });
    }

    const admin = db.get('admin');
    const isEmailMatch = (email.toLowerCase().trim() === admin.email.toLowerCase().trim()) || 
                         (email.toLowerCase().trim() === 'admin');

    if (!isEmailMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const token = generateToken({ email: admin.email, name: admin.name });

    res.json({
      success: true,
      token,
      user: {
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const admin = db.get('admin');
  res.json({
    email: admin.email,
    name: admin.name
  });
});

app.post('/api/auth/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const admin = db.get('admin');
    const isValid = await comparePassword(currentPassword, admin.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const newHash = await hashPassword(newPassword);
    db.update('admin', 'default', { passwordHash: newHash });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// ==========================================
// 3. ADMIN MANAGEMENT ROUTES (PROTECTED)
// ==========================================

// Media / File Upload (Images & PDF Resumes)
app.post('/api/admin/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', requireAuth, (req, res) => {
  const projects = db.get('projects') || [];
  const skills = db.get('skills') || [];
  const services = db.get('services') || [];
  const messages = db.get('contactMessages') || [];
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  res.json({
    totalProjects: projects.length,
    publishedProjects: projects.filter(p => p.visible).length,
    totalSkills: skills.length,
    totalServices: services.length,
    totalMessages: messages.length,
    unreadMessages,
    recentMessages: messages.slice(-5).reverse(),
    profile: db.get('profile')
  });
});

// PROFILE
app.get('/api/admin/profile', requireAuth, (req, res) => {
  res.json(db.get('profile'));
});

app.put('/api/admin/profile', requireAuth, (req, res) => {
  const updated = db.update('profile', 'default', req.body);
  res.json(updated);
});

// SKILLS
app.get('/api/admin/skills', requireAuth, (req, res) => {
  const skills = (db.get('skills') || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(skills);
});

app.post('/api/admin/skills', requireAuth, (req, res) => {
  const list = db.get('skills') || [];
  const newItem = db.insert('skills', {
    ...req.body,
    sortOrder: list.length + 1
  });
  res.status(201).json(newItem);
});

app.put('/api/admin/skills/:id', requireAuth, (req, res) => {
  const updated = db.update('skills', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Skill not found.' });
  res.json(updated);
});

app.delete('/api/admin/skills/:id', requireAuth, (req, res) => {
  const success = db.delete('skills', req.params.id);
  if (!success) return res.status(404).json({ error: 'Skill not found.' });
  res.json({ success: true, id: req.params.id });
});

app.post('/api/admin/skills/reorder', requireAuth, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required.' });
  const reordered = db.reorder('skills', ids);
  res.json(reordered);
});

// PROJECTS
app.get('/api/admin/projects', requireAuth, (req, res) => {
  const projects = (db.get('projects') || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(projects);
});

app.post('/api/admin/projects', requireAuth, (req, res) => {
  const list = db.get('projects') || [];
  const newItem = db.insert('projects', {
    ...req.body,
    sortOrder: list.length + 1
  });
  res.status(201).json(newItem);
});

app.put('/api/admin/projects/:id', requireAuth, (req, res) => {
  const updated = db.update('projects', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found.' });
  res.json(updated);
});

app.post('/api/admin/projects/:id/duplicate', requireAuth, (req, res) => {
  const project = db.find('projects', p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const list = db.get('projects') || [];
  const duplicate = db.insert('projects', {
    ...project,
    id: undefined,
    title: `${project.title} (Copy)`,
    slug: `${project.slug}-copy-${Date.now()}`,
    featured: false,
    sortOrder: list.length + 1,
    createdAt: new Date().toISOString()
  });

  res.status(201).json(duplicate);
});

app.delete('/api/admin/projects/:id', requireAuth, (req, res) => {
  const success = db.delete('projects', req.params.id);
  if (!success) return res.status(404).json({ error: 'Project not found.' });
  res.json({ success: true, id: req.params.id });
});

app.post('/api/admin/projects/reorder', requireAuth, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required.' });
  const reordered = db.reorder('projects', ids);
  res.json(reordered);
});

// EXPERIENCE
app.get('/api/admin/experience', requireAuth, (req, res) => {
  const exp = (db.get('experience') || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(exp);
});

app.post('/api/admin/experience', requireAuth, (req, res) => {
  const list = db.get('experience') || [];
  const newItem = db.insert('experience', {
    ...req.body,
    sortOrder: list.length + 1
  });
  res.status(201).json(newItem);
});

app.put('/api/admin/experience/:id', requireAuth, (req, res) => {
  const updated = db.update('experience', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Experience entry not found.' });
  res.json(updated);
});

app.delete('/api/admin/experience/:id', requireAuth, (req, res) => {
  const success = db.delete('experience', req.params.id);
  if (!success) return res.status(404).json({ error: 'Experience entry not found.' });
  res.json({ success: true, id: req.params.id });
});

app.post('/api/admin/experience/reorder', requireAuth, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required.' });
  const reordered = db.reorder('experience', ids);
  res.json(reordered);
});

// SERVICES
app.get('/api/admin/services', requireAuth, (req, res) => {
  const services = (db.get('services') || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(services);
});

app.post('/api/admin/services', requireAuth, (req, res) => {
  const list = db.get('services') || [];
  const newItem = db.insert('services', {
    ...req.body,
    sortOrder: list.length + 1
  });
  res.status(201).json(newItem);
});

app.put('/api/admin/services/:id', requireAuth, (req, res) => {
  const updated = db.update('services', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found.' });
  res.json(updated);
});

app.delete('/api/admin/services/:id', requireAuth, (req, res) => {
  const success = db.delete('services', req.params.id);
  if (!success) return res.status(404).json({ error: 'Service not found.' });
  res.json({ success: true, id: req.params.id });
});

app.post('/api/admin/services/reorder', requireAuth, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required.' });
  const reordered = db.reorder('services', ids);
  res.json(reordered);
});

// SOCIAL LINKS (Dynamic System)
app.get('/api/admin/socials', requireAuth, (req, res) => {
  const socials = (db.get('socialLinks') || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(socials);
});

app.put('/api/admin/socials', requireAuth, (req, res) => {
  const { socials } = req.body;
  if (!Array.isArray(socials)) return res.status(400).json({ error: 'socials array required.' });

  // Process WhatsApp format if needed
  const formatted = socials.map((item, idx) => {
    return {
      ...item,
      sortOrder: idx + 1
    };
  });

  db.set('socialLinks', formatted);
  res.json(formatted);
});

app.put('/api/admin/socials/:id', requireAuth, (req, res) => {
  const updated = db.update('socialLinks', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Social link not found.' });
  res.json(updated);
});

// SITE SETTINGS
app.get('/api/admin/settings', requireAuth, (req, res) => {
  res.json(db.get('siteSettings'));
});

app.put('/api/admin/settings', requireAuth, (req, res) => {
  const updated = db.update('siteSettings', 'default', req.body);
  res.json(updated);
});

// CONTACT MESSAGES INBOX
app.get('/api/admin/messages', requireAuth, (req, res) => {
  const messages = (db.get('contactMessages') || []).slice().reverse();
  res.json(messages);
});

app.patch('/api/admin/messages/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const updated = db.update('contactMessages', req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'Message not found.' });
  res.json(updated);
});

app.delete('/api/admin/messages/:id', requireAuth, (req, res) => {
  const success = db.delete('contactMessages', req.params.id);
  if (!success) return res.status(404).json({ error: 'Message not found.' });
  res.json({ success: true, id: req.params.id });
});

// Production: serve React frontend static build
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Vinayak Padole Portfolio Server running on http://localhost:${PORT}`);
});
