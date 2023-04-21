import { Firestore } from 'firebase/firestore';
import { FB_DB } from '../../../firebaseConfig';

export default class Events {
  private readonly database;

  /**
   * Creates a new instance of the Users class.
   * @param testingFirestore : Firestore An optional Firestore instance to use for testing.
   *        NOTE: This is only used for testing purposes, therefore an emulator is required.
   * @constructor Creates a new instance of the Users class.
   */
  constructor(testingFirestore?: Firestore) {
    this.database = testingFirestore || FB_DB;
  }
}
