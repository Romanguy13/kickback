import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
} from 'firebase/firestore';
import KickbackFirebase from '../../resources/api/kickbackFirebase';

jest.mock('firebase/firestore');

const kickbackFB = new KickbackFirebase({ defaultCollection: 'test' });
const randomData = {
  name: 'Isabella',
};
test('Able to create a document', async () => {
  // Make sure that there is no connection with the database
  (collection as jest.Mock).mockReturnValue({
    id: 'randomCollectionId',
    path: 'randomCollectionPath',
    parent: null,
  } as unknown as CollectionReference<DocumentData>);

  (doc as jest.Mock).mockReturnValue({
    id: 'randomDocId',
  } as DocumentReference<DocumentData>);

  (addDoc as jest.Mock).mockResolvedValue({
    id: 'randomAddDocId',
  } as DocumentReference<any>);

  const returnedId: string = await kickbackFB.create(randomData);
  expect(returnedId).toEqual('randomAddDocId');
});

test('Able to delete a document', async () => {
  // Delete a document
  (collection as jest.Mock).mockReturnValue({
    id: 'randomCollectionId',
    path: 'randomCollectionPath',
    parent: null,
  } as unknown as CollectionReference<DocumentData>);
  (doc as jest.Mock).mockReturnValue({
    id: 'randomDocId',
  } as DocumentReference<DocumentData>);
  (getDoc as jest.Mock).mockResolvedValue({
    id: 'randomGetDocId',
  } as DocumentSnapshot<DocumentData>);
  (updateDoc as jest.Mock).mockResolvedValue({
    id: 'randomUpdateDocId',
  } as DocumentReference<any>);
  await kickbackFB.delete('randomId');
  expect(updateDoc).toBeCalled();

});


test('Creating a document - Overriding ID', async () => {
  // Make sure that there is no connection with the database
  (collection as jest.Mock).mockReturnValue({
    id: 'randomCollectionId',
    path: 'randomCollectionPath',
    parent: null,
  } as unknown as CollectionReference<DocumentData>);

  (doc as jest.Mock).mockReturnValue({
    id: 'randomDocId',
  } as DocumentReference<DocumentData>);

  (addDoc as jest.Mock).mockResolvedValue({
    id: 'randomAddDocId',
  } as DocumentReference<any>);

  (updateDoc as jest.Mock).mockResolvedValue({
    id: 'randomUpdateDocId',
  } as DocumentReference<any>);

  const returnedId = await kickbackFB.create(randomData, { overrideId: 'overrideId' });
  expect(returnedId).toEqual('randomAddDocId');
});

test('Delete a document - Disabling ID', async () => {
  // Make sure that there is no connection with the database
  (collection as jest.Mock).mockReturnValue({
    id: 'randomCollectionId',
    path: 'randomCollectionPath',
    parent: null,
  } as unknown as CollectionReference<DocumentData>);

  (doc as jest.Mock).mockReturnValue({
    id: 'randomDocId',
  } as DocumentReference<DocumentData>);

  (addDoc as jest.Mock).mockResolvedValue({
    id: 'randomAddDocId',
  } as DocumentReference<any>);

  const returnedId = await kickbackFB.create(randomData, { disableId: true });
  expect(returnedId).toEqual('');
});

test('Able to get all documents from a collection', async () => {
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
    forEach: (callback: (snapshot: DocumentData) => void) => {
      callback({
        name: 'data-1',
        data: () => ({ name: 'Isabella' }),
      });
    },
  } as unknown as QuerySnapshot<DocumentData>);

  const data: DocumentData[] = await kickbackFB.getAll('userId', 'collectionId');
  expect(data).toEqual([
    {
      name: 'Isabella',
    },
  ]);
});

test('Able to get specific document from collection', async () => {
  (doc as jest.Mock).mockReturnValue({
    id: 'randomDocId',
  } as DocumentReference<DocumentData>);

  (getDoc as jest.Mock).mockResolvedValue({
    data: () => ({ name: 'Isabella' }),
    exists: () => true,
  } as unknown as DocumentSnapshot<DocumentData>);

  const data: DocumentData | undefined = await kickbackFB.get('someId');
  expect(data).toEqual({
    name: 'Isabella',
  });
});

test('Edit a document', async () => {
  (doc as jest.Mock).mockReturnValue({
    id: 'randomDocId',
  } as DocumentReference<DocumentData>);

  (updateDoc as jest.Mock).mockResolvedValue({});

  const data: DocumentData | undefined = await kickbackFB.edit('someId', { name: 'Isabella' });
  expect(data).toEqual({ name: 'Isabella' });
});
