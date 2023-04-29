// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  query,
  where,
  Query,
  getDocs, QuerySnapshot, QueryDocumentSnapshot
} from 'firebase/firestore';
import {UpdatedUser, UserModel, UserReturn} from '../schema/user.model';
import KickbackFirebase from './kickbackFirebase';

// import { FB_DB } from '../../../firebaseConfig';

export default class Users extends KickbackFirebase {
  /**
   * Creates a new instance of the Users class.
   * @param testingFirestore : Firestore An optional Firestore instance to use for testing.
   *        NOTE: This is only used for testing purposes, therefore an emulator is required.
   * @constructor Creates a new instance of the Users class.
   */
  constructor(testingFirestore?: Firestore) {
    super({
      defaultCollection: 'users',
      database: testingFirestore,
    });
  }

  async create(data: UserModel, overrideId?: string): Promise<string> {
    return super.create(data, overrideId);
  }

  async edit(id: string, data: UpdatedUser): Promise<void> {
    return super.edit(id, data);
  }

  async getUserByEmail(email: string): Promise<UserReturn> {
    const userRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const q: Query<DocumentData> = query(userRef, where('email', '==', email.toLowerCase()));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const user: QueryDocumentSnapshot<DocumentData> = querySnapshot.docs[0];

    if (!user) {
        throw new Error(`User with email ${email} does not exist`);
    }

    return user.data() as UserReturn;
  }
}
