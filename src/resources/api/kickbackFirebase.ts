import {
  addDoc,
  collection,
  CollectionReference,
  doc,
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
      id: "",
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

    // if (data.length === 0) {
    //   // throw new Error(`No document found with id: ${id}`);
    //   console.log(`No document found with id: ${id}`);
    // }

    return data[0];
  }

  // public async getAllLimit(
  //   userId: string,
  //   fieldName: string,
  //   startAfterDoc: undefined | any = undefined,
  //   max = 4
  // ): Promise<DocumentData[]> {
  //   const dbRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
  //   let q: Query<DocumentData> = query(
  //     dbRef,
  //     where(fieldName, '==', userId),
  //     orderBy('createdAt', 'asc'),
  //     limit(max)
  //   );
  //
  //   console.log(
  //     `getAllLimit: userId: ${userId}, fieldName: ${fieldName}, startAfterDoc: ${startAfterDoc}, max: ${max}`
  //   );
  //
  //   if (startAfterDoc) {
  //     console.log('startAfterDoc: ', startAfterDoc);
  //     q = query(q, startAfter(startAfterDoc));
  //   }
  //
  //   const querySnapshot = await getDocs(q);
  //   const newDocs: DocumentData[] = [];
  //
  //   console.log('New data: ', querySnapshot.docs.length);
  //
  //   querySnapshot.forEach((curr) => {
  //     newDocs.push(curr.data());
  //   });
  //
  //   return newDocs;
  // }

  public async edit(id: string, data: any): Promise<any> {
    const docRef: DocumentReference<DocumentData> = doc(this.database, this.collection, id);
    await updateDoc(docRef, data);
    return data;
  }
}
