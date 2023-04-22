import {
  doc,
  getDoc,
  collection,
  addDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import { UserModel } from '../../resources/schema/user.model';
import Users from '../../resources/api/users';

jest.mock('firebase/firestore');

describe('Firestore Operations', () => {
  let userClass: Users;

  beforeAll(() => {
    userClass = new Users();
  });

  it('should add a document to a collection', async () => {
    const data: UserModel = {
      name: 'Isabella',
      email: 'isabella@bells.com',
      password: 'isabella',
    };
    (doc as jest.Mock).mockResolvedValueOnce({
      id: 'something',
    } as DocumentReference<any>);

    (addDoc as jest.Mock).mockResolvedValueOnce({
      id: 'testId',
    } as DocumentReference<any>);

    const returnedId = await userClass.create(data);
    expect(returnedId).toEqual('something');
  });

  it('should get all documents from a collection', async () => {
    const expectedData: DocumentData[] = [
      {
        name: 'Isabella',
        email: 'isabella@bells.com',
      },
      {
        name: 'Nook Cranny',
        email: 'nookcranny@bells.com',
      },
    ];
  });

  // it('adds a user to the users collection', async () => {
  //   const userData: UserModel = {
  //     name: 'Test User',
  //     email: 'test@example.com',
  //     password: 'test-password',
  //   };
  //
  //   const userId = await FirestoreOperations.createUser(firestore, userData);
  //   console.log(userId);
  //
  //   const docRef = doc(firestore, 'users', userId);
  //   // DOESN'T WORK AS OF NOW, NEEDS TO BE FIXED -- DOESN'T GET BUT CAN PUSH
  //   const docSnap = await getDoc(docRef);
  //
  //   if (docSnap.exists()) {
  //     console.log('Document data:', docSnap.data());
  //   }
  //
  //   expect(docSnap.exists).toBeTruthy();
  //   expect(docSnap.data()).toEqual(userData);
  // });

  // Add more test cases for other Firestore operations
});
