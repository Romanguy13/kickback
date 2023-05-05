import { Timestamp } from 'firebase/firestore';

export interface EventModel {
  hostId: string;
  name: string;
  location: string;
  date: string;
  time: string;
  gId: string;
}

export interface EventReturn {
  id: string;
  hostId: string;
  name: string;
  location: string;
  date: string;
  time: string;
  gId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdatedEvent {
  name?: string;
  location?: string;
  date?: string;
  time?: string;
}
