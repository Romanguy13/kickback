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
  Query,
  DocumentSnapshot,
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

    console.log('newDocRef: ', returnId.id);

    const documentData = {
      id: returnId.id,
      ...data,
    };

    if (extra) {
      if (extra.overrideId) {
        documentData.id = extra.overrideId;
      }
      if (extra.disableId) {
        delete documentData.id;
      }
    }

    const docRef: DocumentReference<any> = await addDoc(dbRef, documentData);

    console.log(documentData.id);

    return extra && extra.disableId ? '' : documentData.id;
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
    const docRef: DocumentReference<DocumentData> = doc(this.database, this.collection, id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return undefined;
  }

  public async edit(id: string, data: any): Promise<any> {
    const docRef: DocumentReference<DocumentData> = doc(this.database, this.collection, id);
    await updateDoc(docRef, data);
    return data;
  }
}
