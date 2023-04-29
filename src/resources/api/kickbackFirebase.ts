import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
  getDocs,
  QuerySnapshot,
  where,
  query, Query,
} from 'firebase/firestore';
import { FB_DB } from '../../../firebaseConfig';

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

  public async create(data: any, overrideId?: string | undefined, disableId?: boolean): Promise<string> {
    const dbRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const returnId: DocumentReference<DocumentData> = doc(dbRef);

    console.log('newDocRef: ', returnId.id);

    const documentData = {
      ...data,
    };

    if (overrideId) {
      documentData.id = overrideId;
    } else if (!disableId) {
      documentData.id = returnId.id;
    }

    const docRef = await addDoc(dbRef, documentData);

    if (!docRef) {
        throw new Error('Error creating document');
    }

    console.log('Document written with ID: ', docRef.id);

    return documentData.id;
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

  public async get(id: string): Promise<DocumentData | undefined> {
    const docRef = doc(this.database, this.collection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return undefined;
  }

  public async edit(id: string, data: any): Promise<any> {
    const docRef = doc(this.database, this.collection, id);
    await updateDoc(docRef, data);
    return data;
  }
}
