import {
  collection,
  addDoc,
  doc,
  Firestore,
  DocumentData,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { UserModel } from '../schema/user.model';
import { FB_DB } from '../../../firebaseConfig';

interface User extends UserModel {
  id: string;
}

export default class Users {
  private readonly database;

  /**
   * Creates a new instance of the Users class.
   * @param testingFirestore : Firestore An optional Firestore instance to use for testing.
   *        NOTE: This is only used for testing purposes, therefore an emulator is required.
   * @constructor Creates a new instance of the Users class.
   */
  constructor(testingFirestore?: Firestore) {
    this.database = testingFirestore || FB_DB;
  }

  async create(data: UserModel): Promise<string> {
    const dbRef: CollectionReference<DocumentData> = collection(this.database, 'users');
    const newDocRef: DocumentReference<DocumentData> = doc(dbRef);

    try {
      const documentData: User = {
        id: newDocRef.id,
        ...data,
      };
      const docRef = await addDoc(dbRef, documentData);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }

    return newDocRef.id;
  }
}
