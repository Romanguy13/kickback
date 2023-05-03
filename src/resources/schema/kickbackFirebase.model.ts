import { Firestore } from 'firebase/firestore';

export interface KBFBConstructor {
  defaultCollection: string;
  database?: Firestore;
}

export interface KBFBCreate {
  overrideId?: string;
  disableId?: boolean;
}
