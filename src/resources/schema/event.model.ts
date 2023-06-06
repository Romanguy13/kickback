import { Timestamp } from 'firebase/firestore';

export interface EventModel {
  hostId: string;
  name: string;
  location: string;
  datetime: Timestamp;
  gId: string;
  inviteeStatus: { id: string; status: boolean | null }[];
  receipt?: string;
}

export interface InviteeStatus {
  id: string;
  status: boolean | null;
}

export interface EventReturn {
  id: string;
  hostId: string;
  name: string;
  location: string;
  datetime: Timestamp;
  gId: string;
  inviteeStatus: InviteeStatus[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  receipt?: string;
}

export interface UpdatedEvent {
  name?: string;
  location?: string;
  datetime?: Timestamp;
  inviteeStatus?: InviteeStatus[];
  receipt?: string;
}
