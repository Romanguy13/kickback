import { Timestamp } from 'firebase/firestore';

export interface GroupModel {
  name: string;
}

export interface GroupReturnModel extends GroupModel {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupMemberModel {
  userId: string;
  groupId: string;
}

export interface updateGroupModel {
  name?: string;
}
