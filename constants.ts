
import { EntryType, AssetRecord, UserRole, UserAccount } from './types';

export const STORAGE_KEY = 'asset_track_pro_data';
export const USERS_STORAGE_KEY = 'asset_track_pro_users';

export const DEFAULT_USERS: UserAccount[] = [
  { 
    email: 'owner@company.com', 
    password: 'password', 
    role: UserRole.OWNER, 
    addedAt: new Date().toISOString() 
  },
  { 
    email: 'pramod@galaxyinfosolution', 
    password: '1234', 
    role: UserRole.ADMIN, 
    addedAt: new Date().toISOString() 
  },
  { 
    email: 'staff@company.com', 
    password: 'password', 
    role: UserRole.USER, 
    addedAt: new Date().toISOString() 
  },
];

export const MOCK_DATA: AssetRecord[] = [
  {
    id: '1',
    productName: 'Dell XPS 15 Laptop',
    quantity: 5,
    units: 'Units',
    address: 'Main Warehouse - Section A',
    entryType: EntryType.INWARD,
    handledBy: 'John Smith',
    remarks: 'Owner notes: High priority shipment.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    productName: 'Ergonomic Office Chair',
    quantity: 12,
    units: 'Pieces',
    address: 'IT Department - HQ',
    entryType: EntryType.OUTWARD,
    handledBy: 'Sarah Jenkins',
    remarks: 'Owner notes: Distributed to floor 3.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];
