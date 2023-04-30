import {GroupModel} from "../../resources/schema/group.model";
import Groups from "../../resources/api/groups";
import KickbackFirebase from "../../resources/api/kickbackFirebase";

jest.mock('firebase/firestore');
jest.mock('../../resources/api/kickbackFirebase');

const groupClass = new Groups();

test('Create a new group', async () => {
    const newGroup : GroupModel = {
        name: 'Test Group',
    };

    (KickbackFirebase.prototype.create as jest.Mock).mockResolvedValue('randomDocId');

    const groupId: string = await groupClass.create(newGroup);

    expect(groupId).toEqual('randomDocId');
});