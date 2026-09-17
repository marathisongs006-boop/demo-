import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyB5xamh-zeyWN8g9NeSu1pFpIB2kop-uLU",
  authDomain: "vinayak006-1a9fb.firebaseapp.com",
  projectId: "vinayak006-1a9fb",
  storageBucket: "vinayak006-1a9fb.firebasestorage.app",
  messagingSenderId: "437698568842",
  appId: "1:437698568842:web:8426908dfb4cf256b10373"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const DATA_FILE = path.join(__dirname, '../server/data.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Default target admin email from data.json or command line
const adminEmail = process.argv[2] || 'vinayakpadole006@gmail.com';
const adminPassword = process.argv[3];

async function migrate() {
  console.log('🚀 Starting Safe Migration to Firebase Firestore & Storage...');

  // Try authenticating if credentials provided
  if (adminPassword) {
    console.log(`🔐 Authenticating as Admin (${adminEmail})...`);
    try {
      const userCred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log(`✅ Authenticated with UID: ${userCred.user.uid}`);
    } catch (authErr) {
      console.warn(`⚠️ Warning: Auth failed (${authErr.message}). Continuing unauthenticated or with open test rules...`);
    }
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ server/data.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const localData = JSON.parse(raw);

  // 1. Upload local images from uploads/ to Firebase Storage if referenced
  const uploadedMap = new Map();

  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR);
    console.log(`📁 Found ${files.length} local files in uploads/`);

    for (const fileName of files) {
      const filePath = path.join(UPLOADS_DIR, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.pdf') contentType = 'application/pdf';

      const storagePath = `migrated_uploads/${Date.now()}_${fileName}`;
      const storageRef = ref(storage, storagePath);

      console.log(`📤 Uploading ${fileName} to Firebase Storage path: ${storagePath}...`);
      try {
        const snap = await uploadBytes(storageRef, fileBuffer, { contentType });
        const downloadUrl = await getDownloadURL(snap.ref);
        uploadedMap.set(`/uploads/${fileName}`, { url: downloadUrl, storagePath });
        console.log(`✅ Uploaded ${fileName} -> ${downloadUrl}`);
      } catch (err) {
        console.warn(`⚠️ Warning: Could not upload ${fileName} to Storage:`, err.message);
      }
    }
  }

  // 2. Migrate Profile
  console.log('\n👤 Migrating Profile Document...');
  const profile = localData.profile || {};
  if (profile.profileImageUrl && uploadedMap.has(profile.profileImageUrl)) {
    const mapped = uploadedMap.get(profile.profileImageUrl);
    profile.profileImageUrl = mapped.url;
    profile.profileImageStoragePath = mapped.storagePath;
  }
  if (profile.resumeUrl && uploadedMap.has(profile.resumeUrl)) {
    const mapped = uploadedMap.get(profile.resumeUrl);
    profile.resumeUrl = mapped.url;
    profile.resumeStoragePath = mapped.storagePath;
  }
  await setDoc(doc(db, 'profile', 'default'), {
    ...profile,
    migratedAt: new Date().toISOString()
  });
  console.log('✅ Profile migrated to Firestore (/profile/default)');

  // 3. Migrate Skills
  console.log('\n⚡ Migrating Skills...');
  const skills = localData.skills || [];
  for (const skill of skills) {
    const skillId = skill.id || `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await setDoc(doc(db, 'skills', skillId), {
      ...skill,
      id: skillId,
      migratedAt: new Date().toISOString()
    });
    console.log(`  + Skill: ${skill.name}`);
  }
  console.log(`✅ ${skills.length} Skills migrated to Firestore (/skills)`);

  // 4. Migrate Projects
  console.log('\n💼 Migrating Projects...');
  const projects = localData.projects || [];
  for (const proj of projects) {
    const projId = proj.id || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    if (proj.thumbnailUrl && uploadedMap.has(proj.thumbnailUrl)) {
      const mapped = uploadedMap.get(proj.thumbnailUrl);
      proj.thumbnailUrl = mapped.url;
      proj.storagePath = mapped.storagePath;
    }
    await setDoc(doc(db, 'projects', projId), {
      ...proj,
      id: projId,
      migratedAt: new Date().toISOString()
    });
    console.log(`  + Project: ${proj.title}`);
  }
  console.log(`✅ ${projects.length} Projects migrated to Firestore (/projects)`);

  // 5. Migrate Experience
  console.log('\n🏢 Migrating Experience...');
  const expList = localData.experience || [];
  for (const exp of expList) {
    const expId = exp.id || `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await setDoc(doc(db, 'experience', expId), {
      ...exp,
      id: expId,
      migratedAt: new Date().toISOString()
    });
    console.log(`  + Experience: ${exp.role} @ ${exp.company}`);
  }
  console.log(`✅ ${expList.length} Experience records migrated to Firestore (/experience)`);

  // 6. Migrate Services
  console.log('\n🛠️ Migrating Services...');
  const services = localData.services || [];
  for (const serv of services) {
    const servId = serv.id || `serv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await setDoc(doc(db, 'services', servId), {
      ...serv,
      id: servId,
      migratedAt: new Date().toISOString()
    });
    console.log(`  + Service: ${serv.title}`);
  }
  console.log(`✅ ${services.length} Services migrated to Firestore (/services)`);

  // 7. Migrate Social Links
  console.log('\n🔗 Migrating Social Links...');
  const socials = localData.socialLinks || [];
  for (const soc of socials) {
    const socId = soc.id || `soc-${soc.platform.toLowerCase()}`;
    await setDoc(doc(db, 'socialLinks', socId), {
      ...soc,
      id: socId,
      migratedAt: new Date().toISOString()
    });
    console.log(`  + Social: ${soc.platform} (${soc.visible ? 'Visible' : 'Hidden'})`);
  }
  console.log(`✅ ${socials.length} Social links migrated to Firestore (/socialLinks)`);

  // 8. Migrate Site Settings
  console.log('\n⚙️ Migrating Site Settings...');
  const siteSettings = localData.siteSettings || {};
  await setDoc(doc(db, 'siteSettings', 'default'), {
    ...siteSettings,
    migratedAt: new Date().toISOString()
  });
  console.log('✅ Site Settings migrated to Firestore (/siteSettings/default)');

  // 9. Migrate Contact Messages
  console.log('\n📬 Migrating Contact Messages...');
  const messages = localData.contactMessages || [];
  for (const msg of messages) {
    const msgId = msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await setDoc(doc(db, 'contactMessages', msgId), {
      ...msg,
      id: msgId,
      migratedAt: new Date().toISOString()
    });
  }
  console.log(`✅ ${messages.length} Contact Messages migrated to Firestore (/contactMessages)`);

  console.log('\n🎉 ===================================================');
  console.log('🎉 ALL DATA SUCCESSFULLY MIGRATED TO FIREBASE FIRESTORE!');
  console.log('🎉 ===================================================\n');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('\n❌ Migration error:', err.message);
  process.exit(1);
});
