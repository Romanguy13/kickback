export interface EventModel {
  hostId: string;
  hostEmail: string;
  name: string;
  location: string;
  date: string;
  time: string;
  invitedUsers: string[];
}

export interface EventReturn {
  id: string;
  hostId: string;
  hostEmail: string;
  name: string;
  location: string;
  date: string;
  time: string;
  invitedUsers: string[];
}

export interface UpdatedEvent {
  hostId?: string;
  hostEmail?: string;
  name?: string;
  location?: string;
  date?: string;
  time?: string;
  invitedUsers?: string[];
}


