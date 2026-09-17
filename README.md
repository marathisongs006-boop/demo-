# Vinayak Padole Portfolio — Firebase Production Architecture

## 🚀 Firebase Configuration
- **Project ID**: `vinayak006-1a9fb`
- **Authorized Admin UID**: `gVWdJNbS5WVqcUqYc2KC4P0HrR32`
- **Storage Bucket**: `vinayak006-1a9fb.firebasestorage.app`

---

## 🔒 Security Architecture
- **Authentication**: Firebase Authentication with session persistence.
- **Admin Guard**: Strictly enforces `user.uid === "gVWdJNbS5WVqcUqYc2KC4P0HrR32"`. Any other UID is immediately denied access.
- **Database**: Cloud Firestore is the single source of truth for all editable content.
- **Storage**: Firebase Storage for media and resumes with cleanup on deletion.
- **Rules**: `firestore.rules` and `storage.rules` included in root.

---

## 🗄️ Firestore Collections Structure
1. `/profile/default` — Full name, title, bio, contact details, availability toggle, portrait URL & resume URL.
2. `/skills/{id}` — Skill name, percentage, category, icon, featured, visible, sortOrder.
3. `/projects/{id}` — Project title, slug, description, fullDescription, technologies, demo/github URLs, thumbnailUrl, storagePath, featured, visible.
4. `/experience/{id}` — Role, company, dates, current flag, description, visible.
5. `/services/{id}` — Service title, description, icon, visible.
6. `/socialLinks/{id}` — Dynamic platforms (WhatsApp, LinkedIn, GitHub, etc.), URLs, visibility toggle.
7. `/siteSettings/default` — Browser title, SEO meta description, accent color, theme mode, copyright.
8. `/contactMessages/{id}` — Public contact form submissions with server timestamps.

---

## 📋 One-Time Firebase Console Steps
1. **Enable Cloud Firestore**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/vinayak006-1a9fb/firestore) ➔ Click **Create database** ➔ Select production mode ➔ Select your region.
   - Paste rules from `firestore.rules` into the **Rules** tab.
2. **Enable Firebase Storage**:
   - Go to [Firebase Console Storage](https://console.firebase.google.com/project/vinayak006-1a9fb/storage) ➔ Click **Get started**.
   - Paste rules from `storage.rules` into the **Rules** tab.
3. **Enable Firebase Email/Password Auth**:
   - Go to [Firebase Console Authentication](https://console.firebase.google.com/project/vinayak006-1a9fb/authentication) ➔ Sign-in method ➔ Enable **Email/Password**.
   - Ensure the user with UID `gVWdJNbS5WVqcUqYc2KC4P0HrR32` is created.
4. **Run Data Migration**:
   ```bash
   node scripts/migrate-to-firebase.js
   ```
