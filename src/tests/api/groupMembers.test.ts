import {GroupMemberModel} from "../../resources/schema/group.model";
import KickbackFirebase from "../../resources/api/kickbackFirebase";
import GroupMembers from "../../resources/api/groupMembers";

jest.mock('firebase/firestore');
jest.mock('../../resources/api/kickbackFirebase');

const groupMemberClass = new GroupMembers();

test('Create a new group member', async () => {
    const groupMember : GroupMemberModel = {
        userId: 'something',
        groupId: 'else',
    };

    (KickbackFirebase.prototype.create as jest.Mock).mockResolvedValue('randomDocId');

    const groupId: string = await groupMemberClass.create(groupMember);

    expect(groupId).toEqual('randomDocId');
});