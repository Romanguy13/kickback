import { DocumentData, Firestore } from 'firebase/firestore';
import { EventModel, EventReturn, UpdatedEvent } from '../schema/event.model';
import KickbackFirebase from './kickbackFirebase';
import GroupMembers from './groupMembers';

export default class Events extends KickbackFirebase {
  // private readonly database;

  /**
   * Creates a new instance of the Users class.
   * @param testingFirestore : Firestore An optional Firestore instance to use for testing.
   *        NOTE: This is only used for testing purposes, therefore an emulator is required.
   * @constructor Creates a new instance of the Users class.
   */
  constructor(testingFirestore?: Firestore) {
    // this.database = testingFirestore || FB_DB;
    super({
      defaultCollection: 'events',
      database: testingFirestore,
    });
  }

  async create(data: EventModel): Promise<string> {
    return super.create(data);
  }

  async edit(id: string, data: UpdatedEvent): Promise<void> {
    return super.edit(id, data);
  }

  async getAll(userId: string): Promise<EventReturn[]> {
    const events: EventReturn[] = [];
    console.log('userId: ', userId);
    const groups: DocumentData[] = await new GroupMembers().getAll(userId, 'userId');
    console.log('groups: ', groups);

    const promises = groups.map(async (group: DocumentData) => {
      const groupEvents: DocumentData[] = await super.getAll(group.groupId, 'gId');
      console.log('groupEvents: ', groupEvents);
      groupEvents.forEach((event: DocumentData) => {
        events.push(event as EventReturn);
      });
    });

    await Promise.all(promises);

    console.log('events: ', events);

    return events;
  }
}
