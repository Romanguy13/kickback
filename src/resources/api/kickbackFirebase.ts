import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  deleteDoc,
  DocumentData,
  DocumentReference,
  Firestore,
  limit,
  updateDoc,
  getDocs,
  QuerySnapshot,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  query,
  Query,
  startAfter,
  deleteField,
} from 'firebase/firestore';
import { FB_DB } from '../../../firebaseConfig';
import { KBFBCreate } from '../schema/kickbackFirebase.model';

export default class KickbackFirebase {
  protected readonly collection: string;

  protected readonly database: Firestore;

  constructor({
    defaultCollection,
    database,
  }: {
    defaultCollection: string;
    database?: Firestore;
  }) {
    this.collection = defaultCollection;
    this.database = database || FB_DB;
  }

  public async create(data: any, extra?: KBFBCreate): Promise<string> {
    const dbRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const returnId: DocumentReference<DocumentData> = doc(dbRef);

    const documentData = {
      id: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    };

    const id = await addDoc(dbRef, documentData);

    if (extra) {
      if (extra.overrideId) {
        // documentData.id = extra.overrideId;
        await updateDoc(id, { id: extra.overrideId });
      }
      if (extra.disableId) {
        // delete documentData.id;
        await updateDoc(id, {
          id: deleteField(),
        });
      }
    } else {
      await updateDoc(id, { id: id.id });
    }

    console.log('documentData ID: ', documentData.id);
    console.log('returnId ID: ', returnId.id);

    // Adds doc to collection
    // await addDoc(dbRef, documentData);

    return extra && extra.disableId ? '' : id.id;
  }

  // Takes in a event ID and looks for it in the database to delete
  public async delete(eventId: string): Promise<void> {
    const eventRef: DocumentReference<DocumentData> = doc(this.database, this.collection, eventId);

    console.log('Event to be deleted: ', eventRef);
    console.log('Event to be deleted ID: ', eventRef.id);

    try {
      await deleteDoc(eventRef);

      console.log('Event deleted successfully');
      return;
    } catch (error) {
      console.error('Error deleting event:', error);

      throw new Error('Failed to delete event');
    }
  }
  

  public async getAll(userId: string, fieldName: string): Promise<DocumentData[]> {
    const dbRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const q: Query<DocumentData> = query(dbRef, where(fieldName, '==', userId));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    const documents: DocumentData[] = [];

    querySnapshot.forEach((tempDoc) => {
      documents.push(tempDoc.data());
    });

    return documents;
  }

  public async get(id: string): Promise<DocumentData> {
    const data: DocumentData[] = await this.getAll(id, 'id');

    return data[0];
  }

  public async edit(id: string, data: any): Promise<any> {
    const newData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    const docRef: DocumentReference<DocumentData> = doc(this.database, this.collection, id);
    await updateDoc(docRef, newData);
    return newData;
  }

}
