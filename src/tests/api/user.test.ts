import { Firestore, doc, getDoc } from 'firebase/firestore';
import FirestoreOperations from './setup/firestoreOperations';
import createTestFirestore from './setup/firestoreTestUtil';
import { UserModel } from '../../resources/schema/user.model';

describe('Firestore Operations', () => {
  // eslint-disable-next-line no-shadow
  let firestore: Firestore;

  beforeEach(() => {
    firestore = createTestFirestore();
  });

  it('adds a user to the users collection', async () => {
    const userData: UserModel = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test-password',
    };

    const userId = await FirestoreOperations.createUser(firestore, userData);
    console.log(userId);

    const docRef = doc(firestore, 'users', userId);
    // DOESNT WORK AS OF NOW, NEEDS TO BE FIXED -- DOESNT GET BUT CAN PUSH
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    }

    expect(docSnap.exists).toBeTruthy();
    expect(docSnap.data()).toEqual(userData);
  });

  // Add more test cases for other Firestore operations
});
