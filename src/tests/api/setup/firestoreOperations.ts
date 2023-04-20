import { Firestore } from 'firebase/firestore';
import Users from '../../../resources/api/users';
import { UserModel } from '../../../resources/schema/user.model';

export default class FirestoreOperations {
  static async createUser(firestore: Firestore, userData: UserModel): Promise<string> {
    return new Users(firestore).create(userData);
  }
}
