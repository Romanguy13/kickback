import {
  doc,
  addDoc,
  DocumentReference,
  DocumentData,
  getDocs,
  QuerySnapshot,
  getDoc,
  DocumentSnapshot,
} from 'firebase/firestore';
import Events from '../../resources/api/events';
import { EventReturn, UpdatedEvent, EventModel } from '../../resources/schema/event.model';

jest.mock('firebase/firestore');

describe('Firestore Operations', () => {
  let eventClass: Events;

  beforeAll(() => {
    eventClass = new Events();
  });

  it('should add a document to a collection of events', async () => {
    const data: EventModel = {
      hostId: 'something',
      name: 'Isabella',
      location: 'Santa Barbara',
      date: '2021-10-10',
    };

    (doc as jest.Mock).mockReturnValue({
      id: 'something',
    } as DocumentReference<DocumentData>);

    (addDoc as jest.Mock).mockResolvedValue({
      id: 'testId',
    } as DocumentReference<DocumentData>);

    const returnedId = await eventClass.create(data);

    console.log(returnedId);
    expect(returnedId).toEqual('something');
  });

  it('Error while adding document', async () => {
    const data: EventModel = {
      hostId: 'something',
      name: 'Isabella',
      location: 'Santa Barbara',
      date: '2021-10-10',
    };

    (doc as jest.Mock).mockReturnValue({
      id: 'something',
    } as DocumentReference<DocumentData>);
    
    (addDoc as jest.Mock).mockRejectedValue({
      new: Error('Error while adding document'),
    } as unknown as DocumentReference<DocumentData>);

    const returnedId = await eventClass.create(data);
    console.log(returnedId);
  });

  it('should get all documents from a collection', async () => {
    const expectedData: EventReturn[] = [
      {
        id: 'doc1',
        hostId: 'something',
        name: 'Isabella',
        location: 'Santa Barbara',
        date: '2021-10-10',
      },
      {
        id: 'doc2',
        hostId: 'something2',
        name: 'Isabella2',
        location: 'Santa Barbara2',
        date: '2021-10-10',
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

    const returnedData = await eventClass.getAll();

    expect(returnedData).toEqual(expectedData);
  });

  it('should be able to edit an existing document', async () => {
    const updatedData: UpdatedEvent = {
      name: 'Isabella Bells',
    };
    await eventClass.edit('doc1', updatedData);
  });

  it('should be able to get one document by id', async () => {
    const expectedData: EventReturn = {
      id: 'doc1',
      hostId: 'something',
      name: 'Isabella',
      location: 'Santa Barbara',
      date: '2021-10-10',
    };

    (doc as jest.Mock).mockReturnValue({
      id: 'something',
    } as DocumentReference<DocumentData>);

    (getDoc as jest.Mock).mockResolvedValue({
      id: 'doc1',
      data: () => expectedData,
      exists: () => true,
    } as unknown as DocumentSnapshot<DocumentData>);
    
    const returnedData = await eventClass.get('doc1');
    expect(returnedData).toEqual(expectedData);
  });

  it('get document by non existent id', async () => {
    (doc as jest.Mock).mockReturnValue({
      id: 'something',
    } as DocumentReference<DocumentData>);

    (getDoc as jest.Mock).mockResolvedValue({
      id: 'doc1',
      exists: () => false,
    } as unknown as DocumentSnapshot<DocumentData>);
    
    const returnedData = await eventClass.get('doc1');
    expect(returnedData).toEqual(undefined);
  });

});
