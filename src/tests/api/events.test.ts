import { DocumentData, serverTimestamp, Timestamp } from 'firebase/firestore';
import Events from '../../resources/api/events';
import { EventReturn, UpdatedEvent, EventModel } from '../../resources/schema/event.model';
import KickbackFirebase from '../../resources/api/kickbackFirebase';
import GroupMembers from '../../resources/api/groupMembers';
import { GroupMemberModel } from '../../resources/schema/group.model';

jest.mock('firebase/firestore');
jest.mock('../../resources/api/kickbackFirebase');
jest.mock('../../resources/api/groupMembers');

describe('Firestore Operations', () => {
  let eventClass: Events;

  beforeAll(() => {
    eventClass = new Events();
  });

  it('should add a document to a collection of events', async () => {
    const data: EventModel = {
      gId: '201',
      time: '12:00',
      hostId: 'something',
      name: 'Isabella',
      location: 'Santa Barbara',
      date: '2021-10-10',
    };

    (KickbackFirebase.prototype.create as jest.Mock).mockResolvedValue('something');

    const returnedId = await eventClass.create(data);

    expect(returnedId).toEqual('something');
  });

  it('should delete a document ', async () => {
    const data: EventModel = {
      gId: '201',
      time: '12:00',
      hostId: 'something',
      name: 'Isabella',
      location: 'Santa Barbara',
      date: '2021-10-10',
    };

    (KickbackFirebase.prototype.create as jest.Mock).mockResolvedValue('something');

    const returnedId = await eventClass.delete(data.gId);
    expect(returnedId).toEqual(undefined);
  });

  it('should get all documents from a collection', async () => {
    // Events hosted by the user
    const expectedData: EventReturn[] = [
      {
        gId: '201',
        time: '12:00',
        id: 'doc1',
        hostId: 'something',
        name: 'Isabella',
        location: 'Santa Barbara',
        date: '2021-10-10',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      },
      {
        gId: '202',
        time: '12:00',
        id: 'doc2',
        hostId: 'batman',
        name: 'Isabella2',
        location: 'Santa Barbara2',
        date: '2021-10-10',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      },
    ];
    // Groups that the user is in
    const groups: GroupMemberModel[] = [
      {
        groupId: '201',
        userId: 'something',
      },
      {
        groupId: '202',
        userId: 'something',
      },
    ];

    (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue(groups);
    (KickbackFirebase.prototype.getAll as jest.Mock).mockResolvedValueOnce([expectedData[0]]);
    (KickbackFirebase.prototype.getAll as jest.Mock).mockResolvedValueOnce([expectedData[1]]);

    const returnedData: EventReturn[] = await eventClass.getAllByUserId('something');

    console.log('Returned Data', returnedData);

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
      gId: '209',
      time: '12:00',
      id: 'doc1',
      hostId: 'something',
      name: 'Isabella',
      location: 'Santa Barbara',
      date: '2021-10-10',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    (KickbackFirebase.prototype.get as jest.Mock).mockReturnValueOnce(expectedData);

    const returnedData: DocumentData | undefined = await eventClass.get('doc1');
    expect(returnedData).toEqual(expectedData);
  });

  it('get document by non existent id', async () => {
    (KickbackFirebase.prototype.get as jest.Mock).mockReturnValueOnce(undefined);

    const returnedData = await eventClass.get('doc1');
    expect(returnedData).toEqual(undefined);
  });
});
