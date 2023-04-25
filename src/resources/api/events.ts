import { Firestore } from 'firebase/firestore';
import { EventModel, UpdatedEvent } from '../schema/event.model';
import KickbackFirebase from './kickbackFirebase';

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
      database: testingFirestore
    });
  }

  async create(data: EventModel): Promise<string> {
    return super.create(data);
  }

  async edit(id: string, data: UpdatedEvent): Promise<void> {
    return super.edit(id, data);
  }
}
