import { Timestamp } from 'firebase/firestore';

export interface UserModel {
  email: string;
  name: string;
}

export interface UserReturn {
  id: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdatedUser {
  email?: string;
  name?: string;
}
