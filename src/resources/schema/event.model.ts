import { Timestamp } from 'firebase/firestore';

export interface EventModel {
  hostId: string;
  name: string;
  location: string;
  datetime: Timestamp;
  gId: string;
  inviteeStatus: { id: string; status: boolean | null }[];
}

export interface EventReturn {
  id: string;
  hostId: string;
  name: string;
  location: string;
  datetime: Timestamp;
  gId: string;
  inviteeStatus: { id: string; status: boolean | null }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdatedEvent {
  name?: string;
  location?: string;
  datetime?: Timestamp;
  inviteeStatus?: { id: string; status: boolean | null }[];
}
