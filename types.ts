
export enum EntryType {
  INWARD = 'INWARD',
  OUTWARD = 'OUTWARD'
}

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface UserAccount {
  email: string;
  password: string; // Added password field
  role: UserRole;
  addedAt: string;
}

export interface AssetRecord {
  id: string;
  productName: string;
  quantity: number;
  units: string;
  address: string;
  entryType: EntryType;
  handledBy: string;
  remarks: string;
  createdAt: string;
}

export interface AppState {
  currentUser: UserAccount | null;
  assets: AssetRecord[];
  users: UserAccount[];
}
