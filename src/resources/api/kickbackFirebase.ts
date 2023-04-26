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
  query,
} from 'firebase/firestore';
import { FB_DB } from '../../../firebaseConfig';

export default class KickbackFirebase {
  private readonly collection: string;

  private readonly database: Firestore;

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

  public async create(data: any): Promise<string> {
    const dbRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const returnId: DocumentReference<DocumentData> = doc(dbRef);

    console.log('newDocRef: ', returnId.id);

    try {
      const documentData = {
        id: returnId.id,
        ...data,
      };
      const docRef = await addDoc(dbRef, documentData);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.log('Error adding document: ', e);
    }

    return returnId.id;
  }

  public async getAll(): Promise<DocumentData[]> {
    const dbRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(dbRef);
    
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
