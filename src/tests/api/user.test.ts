import {
  DocumentData,
  getDocs,
  QuerySnapshot,
  collection,
  CollectionReference,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { UpdatedUser, UserModel, UserReturn } from '../../resources/schema/user.model';
import Users from '../../resources/api/users';
import KickbackFirebase from '../../resources/api/kickbackFirebase';

jest.mock('firebase/firestore');
jest.mock('../../resources/api/kickbackFirebase');

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

    (KickbackFirebase.prototype.create as jest.Mock).mockResolvedValue('something');

    const returnedId = await userClass.create(data);

    expect(returnedId).toEqual('something');
  });

  it('should add a document to a collection - Given overrideId', async () => {
    const data: UserModel = {
      name: 'Isabella',
      email: 'isabella@bells.com',
    };

    (KickbackFirebase.prototype.create as jest.Mock).mockResolvedValue('overrideId');

    const returnedId = await userClass.create(data, { overrideId: 'overrideId' });

    expect(returnedId).toEqual('overrideId');
  });

  it('should get all documents from a collection', async () => {
    const expectedData: UserReturn[] = [
      {
        id: 'doc1',
        name: 'Isabella',
        email: 'isabella@bells.com',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      },
      {
        id: 'doc2',
        name: 'Nook Crannny',
        email: 'nookcranny@bells.com',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      },
    ];

    (KickbackFirebase.prototype.getAll as jest.Mock).mockResolvedValue(expectedData);

    const returnedData = await userClass.getAll('something', 'else');

    expect(returnedData).toEqual(expectedData);
  });

  it('should be able to edit an existing document', async () => {
    const updatedData: UpdatedUser = {
      name: 'Isabella Bells',
    };
    await userClass.edit('doc1', updatedData);
  });

  it('Should be able to get user by email', async () => {
    const expectedUser: UserReturn = {
      id: 'isa45',
      name: 'Isabella',
      email: 'isabella@kickback.com',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    // Make sure that there is no connection with the database
    (collection as jest.Mock).mockReturnValue({
      id: 'randomCollectionId',
      path: 'randomCollectionPath',
      parent: null,
    } as unknown as CollectionReference<DocumentData>);

    (query as jest.Mock).mockResolvedValue({
      id: 'randomQueryId',
    } as unknown as QuerySnapshot<DocumentData>);

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => expectedUser }],
    } as unknown as QuerySnapshot<DocumentData>);

    const returnedUser = await userClass.getUserByEmail('isabella@kickback.com');

    expect(returnedUser).toEqual(expectedUser);
  });

  it('Should NOT be able to get user by email', async () => {
    // Make sure that there is no connection with the database
    (collection as jest.Mock).mockReturnValue({
      id: 'randomCollectionId',
      path: 'randomCollectionPath',
      parent: null,
    } as unknown as CollectionReference<DocumentData>);

    (query as jest.Mock).mockResolvedValue({
      id: 'randomQueryId',
    } as unknown as QuerySnapshot<DocumentData>);

    (getDocs as jest.Mock).mockResolvedValue({
      docs: undefined,
    } as unknown as QuerySnapshot<DocumentData>);

    await expect(userClass.getUserByEmail('mimis@kickback.com')).rejects.toThrowError(
      'User with email mimis@kickback.com does not exist'
    );
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
