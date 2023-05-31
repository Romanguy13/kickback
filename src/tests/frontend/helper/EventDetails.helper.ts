import { Timestamp } from 'firebase/firestore';
import Users from '../../../resources/api/users';
import GroupMembers from '../../../resources/api/groupMembers';
import { UserReturn } from '../../../resources/schema/user.model';

const groupMemberReturn = [
  {
    userId: '1',
    groupId: '1',
  },
  {
    userId: '2',
    groupId: '1',
  },
  {
    userId: '3',
    groupId: '1',
  },
  {
    userId: '4',
    groupId: '1',
  },
];

export default function preLoadData() {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue(groupMemberReturn);

  // Load all users based off groupMemberReturn
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: '1',
    name: 'Chief Keef',
    email: 'ckeef@kickback.com',
    createdAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
    updatedAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
  } as UserReturn);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: '2',
    name: 'keshi',
    email: 'keshi@kickback.com',
    createdAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
    updatedAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
  } as UserReturn);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: '3',
    name: 'Richy Rich',
    email: 'rrich@kickback.com',
    createdAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
    updatedAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
  } as UserReturn);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: '4',
    name: 'Kung Fu Kenny',
    email: 'kenny@kickback.com',
    createdAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
    updatedAt: Timestamp.fromDate(new Date('2021-09-01T00:00:00.000Z')),
  } as UserReturn);
}
