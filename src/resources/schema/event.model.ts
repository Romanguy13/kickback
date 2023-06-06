import { Timestamp } from 'firebase/firestore';

export interface InviteeStatus {
  id: string;
  status: boolean | null;
}

export interface PaidStatus {
  id: string;
  status: boolean;
}

export interface EventModel {
  hostId: string;
  name: string;
  location: string;
  datetime: Timestamp;
  gId: string;
  inviteeStatus: InviteeStatus[];
  paidStatus: PaidStatus[];
  receipt?: string;
}

export interface EventReturn extends EventModel {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdatedEvent {
  name?: string;
  location?: string;
  datetime?: Timestamp;
  inviteeStatus?: InviteeStatus[];
  paidStatus?: PaidStatus[];
  receipt?: string;
}
