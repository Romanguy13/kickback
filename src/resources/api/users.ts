import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  query,
  where,
  Query,
  getDocs,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { UpdatedUser, UserModel, UserReturn } from '../schema/user.model';
import KickbackFirebase from './kickbackFirebase';
import { KBFBCreate } from '../schema/kickbackFirebase.model';

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

  async create(data: UserModel, extras?: KBFBCreate): Promise<string> {
    if (!extras) {
      return super.create(data);
    }
    return super.create(data, { overrideId: extras.overrideId });
  }

  async edit(id: string, data: UpdatedUser): Promise<void> {
    return super.edit(id, data);
  }

  async getUserByEmail(email: string): Promise<UserReturn> {
    const userRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const q: Query<DocumentData> = query(userRef, where('email', '==', email.toLowerCase()));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const user: QueryDocumentSnapshot<DocumentData>[] = querySnapshot.docs;

    if (!user) {
      throw new Error(`User with email ${email} does not exist`);
    }

    return user[0].data() as UserReturn;
  }

  async getUserDbIdByEmail(email: string): Promise<string> {
    const userRef: CollectionReference<DocumentData> = collection(this.database, this.collection);
    const q: Query<DocumentData> = query(userRef, where('email', '==', email.toLowerCase()));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const user: QueryDocumentSnapshot<DocumentData>[] = querySnapshot.docs;

    /* istanbul ignore next */
    if (!user) {
      /* istanbul ignore next */
      throw new Error(`User with email ${email} does not exist`);
    }

    return user[0].id;
  } 

}
