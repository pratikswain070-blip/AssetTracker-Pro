
import { AssetRecord, UserAccount, UserRole } from '../types';
import { STORAGE_KEY, USERS_STORAGE_KEY, MOCK_DATA, DEFAULT_USERS } from '../constants';

export const dbService = {
  // Assets Management
  getAssets: (): AssetRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
      return MOCK_DATA;
    }
    return JSON.parse(data);
  },

  saveAssets: (assets: AssetRecord[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  },

  addAsset: (asset: Omit<AssetRecord, 'id' | 'createdAt'>): AssetRecord => {
    const assets = dbService.getAssets();
    const newAsset: AssetRecord = {
      ...asset,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    assets.unshift(newAsset);
    dbService.saveAssets(assets);
    return newAsset;
  },

  updateAsset: (id: string, updatedAsset: Partial<AssetRecord>): AssetRecord => {
    const assets = dbService.getAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Asset not found');
    
    assets[index] = { ...assets[index], ...updatedAsset };
    dbService.saveAssets(assets);
    return assets[index];
  },

  deleteAsset: (id: string): void => {
    const assets = dbService.getAssets();
    const filtered = assets.filter(a => a.id !== id);
    dbService.saveAssets(filtered);
  },

  // Users Management
  getUsers: (): UserAccount[] => {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    let users: UserAccount[] = [];
    
    try {
      users = data ? JSON.parse(data) : [];
    } catch (e) {
      users = [];
    }

    // MIGRATION: Check if the required 'pramod' account exists or if passwords are missing (stale data)
    const hasPramod = users.some(u => u.email === 'pramod@galaxyinfosolution');
    const hasPasswords = users.length > 0 && users.every(u => !!u.password);

    if (!data || !hasPramod || !hasPasswords) {
      // If data is stale or missing the new admin, reset to defaults to ensure access
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    
    return users;
  },

  saveUsers: (users: UserAccount[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  upsertUser: (email: string, role: UserRole, password?: string): UserAccount => {
    const users = dbService.getUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingIndex > -1) {
      users[existingIndex].role = role;
      if (password) users[existingIndex].password = password;
      dbService.saveUsers(users);
      return users[existingIndex];
    } else {
      const newUser: UserAccount = {
        email: email.toLowerCase(),
        password: password || '1234', // Default if not provided
        role,
        addedAt: new Date().toISOString()
      };
      users.push(newUser);
      dbService.saveUsers(users);
      return newUser;
    }
  },

  deleteUser: (email: string): void => {
    const users = dbService.getUsers();
    const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    dbService.saveUsers(filtered);
  },

  getUserByEmail: (email: string): UserAccount | null => {
    const users = dbService.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  authenticate: (email: string, password: string): UserAccount | null => {
    // We call getUsers() here to ensure the latest storage (and Pramod's account) is loaded
    const users = dbService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
};
