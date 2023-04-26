// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { UpdatedUser, UserModel } from '../schema/user.model';
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

  async create(data: UserModel): Promise<string> {
    return super.create(data);
  }

  async edit(id: string, data: UpdatedUser): Promise<void> {
    return super.edit(id, data);
  }

  async getUserIdByEmail(email: string): Promise<string> {
    const users = await super.getAll();
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error(`User with email ${email} does not exist`);
    } else {
      return user.id;
    }
  }
}
