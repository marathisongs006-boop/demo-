# Vinayak Padole Portfolio — Firebase + Vercel Production Architecture

## 🚀 Production Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React 18 + Vite + TypeScript + Tailwind CSS    |
| Database    | Firebase Cloud Firestore                        |
| Auth        | Firebase Authentication                         |
| Storage     | Firebase Storage (images & resumes)             |
| Hosting     | Vercel (static SPA deployment)                 |

---

## 🔒 Security Architecture

- **Authentication**: Firebase Authentication with session persistence.
- **Admin Guard**: Strictly enforces authorized UID check. Any other UID is denied access.
- **Database**: Cloud Firestore is the single source of truth for all editable content.
- **Storage**: Firebase Storage for media and resumes with cleanup on deletion.
- **Rules**: `firestore.rules` and `storage.rules` included in root.
- **No secrets committed**: `.env` is in `.gitignore`. Firebase client config is safe to commit (Firebase Web SDK design).

---

## 🌐 Vercel Deployment

### Build Config (vercel.json)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Rewrites**: All routes rewrite to `/index.html` (React Router BrowserRouter support)

### Deploy Steps
1. Push this repository to GitHub.
2. Import into Vercel → Select repository.
3. Vercel auto-detects Vite framework.
4. Click **Deploy** — no environment variables needed (Firebase config is in `src/firebase/config.ts`).

---

## 🗄️ Firestore Collections Structure

| Collection          | Document ID | Purpose                                                            |
|---------------------|-------------|--------------------------------------------------------------------|
| `/profile`          | `default`   | Full name, title, bio, contact details, portrait URL & resume URL  |
| `/skills/{id}`      | Auto        | Skill name, percentage, category, icon, featured, visible         |
| `/projects/{id}`    | Auto        | Project title, description, tech stack, URLs, thumbnail, visible  |
| `/experience/{id}`  | Auto        | Role, company, dates, current flag, description, visible          |
| `/services/{id}`    | Auto        | Service title, description, icon, visible                          |
| `/socialLinks/{id}` | Auto        | Dynamic platforms (WhatsApp, LinkedIn, GitHub, etc.), visibility   |
| `/siteSettings`     | `default`   | Browser title, SEO meta description, accent color, copyright       |
| `/contactMessages`  | Auto        | Public contact form submissions with server timestamps            |

---

## 📋 Firebase Console Setup

1. **Enable Cloud Firestore** → Paste rules from `firestore.rules`.
2. **Enable Firebase Storage** → Paste rules from `storage.rules`.
3. **Enable Firebase Email/Password Auth** → Create admin user.
4. **Run Data Migration** (one-time): `node scripts/migrate-to-firebase.js`
