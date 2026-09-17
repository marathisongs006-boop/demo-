import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all required keys exist from seed
        for (const key of Object.keys(initialSeedData)) {
          if (!this.data[key]) {
            this.data[key] = initialSeedData[key];
          }
        }
      } else {
        this.data = JSON.parse(JSON.stringify(initialSeedData));
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database, using seed data fallback:', err);
      this.data = JSON.parse(JSON.stringify(initialSeedData));
      this.save();
    }
  }

  save() {
    try {
      const tempFile = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DATA_FILE);
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  get(collection) {
    return this.data[collection] || null;
  }

  set(collection, value) {
    this.data[collection] = value;
    this.save();
    return this.data[collection];
  }

  find(collection, predicate) {
    const list = this.data[collection] || [];
    return list.find(predicate);
  }

  filter(collection, predicate) {
    const list = this.data[collection] || [];
    return list.filter(predicate);
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    this.data[collection].push(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, updates) {
    if (collection === 'profile' || collection === 'siteSettings' || collection === 'admin') {
      this.data[collection] = {
        ...this.data[collection],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data[collection];
    }

    const list = this.data[collection] || [];
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return list[index];
  }

  delete(collection, id) {
    const list = this.data[collection] || [];
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    this.save();
    return true;
  }

  reorder(collection, orderedIds) {
    const list = this.data[collection] || [];
    const itemMap = new Map(list.map(item => [item.id, item]));
    
    const reordered = [];
    orderedIds.forEach((id, index) => {
      const item = itemMap.get(id);
      if (item) {
        item.sortOrder = index + 1;
        reordered.push(item);
        itemMap.delete(id);
      }
    });

    // Append any remaining items that were not in orderedIds
    itemMap.forEach(item => {
      item.sortOrder = reordered.length + 1;
      reordered.push(item);
    });

    this.data[collection] = reordered;
    this.save();
    return this.data[collection];
  }
}

export const db = new Database();
