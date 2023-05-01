import KickbackFirebase from "./kickbackFirebase";
import {Firestore} from "firebase/firestore";
import {GroupModel} from "../schema/group.model";

export default class Groups extends KickbackFirebase {
    /**
     * Creates a new instance of the Users class.
     * @param testingFirestore : Firestore An optional Firestore instance to use for testing.
     *        NOTE: This is only used for testing purposes, therefore an emulator is required.
     * @constructor Creates a new instance of the Users class.
     */
    constructor(testingFirestore?: Firestore) {
        // this.database = testingFirestore || FB_DB;
        super({
            defaultCollection: 'groups',
            database: testingFirestore
        });
    }

    async create(data: GroupModel): Promise<string> {
        return super.create(data);
    }
}
