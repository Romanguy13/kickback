import {
  doc,
  addDoc,
  DocumentReference,
  DocumentData,
  getDocs,
  QuerySnapshot,
} from 'firebase/firestore';
import { UpdatedUser, UserModel, UserReturn } from '../../resources/schema/user.model';
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
    };

    (doc as jest.Mock).mockReturnValue({
      id: 'something',
    } as DocumentReference<DocumentData>);

    (addDoc as jest.Mock).mockResolvedValue({
      id: 'testId',
    } as DocumentReference<DocumentData>);

    const returnedId = await userClass.create(data);

    console.log(returnedId);
    expect(returnedId).toEqual('something');
  });

  it('Error while adding document', async () => {
    const data: UserModel = {
      name: 'Isabella',
      email: 'isabella@books.com',
    };

    (doc as jest.Mock).mockReturnValue({
      id: 'something',
    } as DocumentReference<DocumentData>);

    (addDoc as jest.Mock).mockRejectedValue(new Error('Error while adding document'));

    await expect(userClass.create(data)).rejects.toThrow('Error while adding document');
  });

  it('should get all documents from a collection', async () => {
    const expectedData: UserReturn[] = [
      {
        id: 'doc1',
        name: 'Isabella',
        email: 'isabella@bells.com',
      },
      {
        id: 'doc2',
        name: 'Nook Crannny',
        email: 'nookcranny@bells.com',
      },
    ];

    const querySnapshot = [
      {
        id: 'doc1',
        data: () => expectedData[0],
      },
      {
        id: 'doc2',
        data: () => expectedData[1],
      },
    ];

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: querySnapshot,
      size: expectedData.length,
      empty: false,
      forEach: (callback: (value: DocumentData, index: number, array: DocumentData[]) => void) =>
        querySnapshot.forEach(callback),
    } as unknown as QuerySnapshot<DocumentData>);

    const returnedData = await userClass.getAll('something', 'else');

    expect(returnedData).toEqual(expectedData);
  });

  it('should be able to edit an existing document', async () => {
    const updatedData: UpdatedUser = {
      name: 'Isabella Bells',
    };
    await userClass.edit('doc1', updatedData);
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
