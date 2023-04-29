import {Firestore} from "firebase/firestore";
import KickbackFirebase from "./kickbackFirebase";
import {GroupMemberModel} from "../schema/group.model";

export default class GroupMembers extends KickbackFirebase {
    /**
     * Creates a new instance of the GroupMembers class.
     * @param testingFirestore : Firestore An optional Firestore instance to use for testing.
     *        NOTE: This is only used for testing purposes, therefore an emulator is required.
     * @constructor Creates a new instance of the Users class.
     */
    constructor(testingFirestore?: Firestore) {
        super({
            defaultCollection: 'groupMembers',
            database: testingFirestore,
        });
    }

    async create(data: GroupMemberModel): Promise<string> {
        return super.create(data, undefined, true);
    }
}