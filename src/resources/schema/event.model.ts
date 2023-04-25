export interface EventModel {
  hostId: string;
  name: string;
  location: string;
  date: string;
}

export interface EventReturn {
  id: string;
  hostId: string;
  name: string;
  location: string;
  date: string;
}

export interface UpdatedEvent {
  hostId?: string;
  name?: string;
  location?: string;
  date?: string;
}


