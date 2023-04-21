export interface GroupModel {
  id: string;
  groupId: string;
  hostId: string;
  name: string;
}

export interface GroupMemberModel {
  userId: string;
  groupId: string;
}
