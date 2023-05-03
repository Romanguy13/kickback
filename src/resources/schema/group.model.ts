export interface GroupModel {
  name: string;
}

export interface GroupMemberModel {
  userId: string;
  groupId: string;
}

export interface updateGroupModel {
  name?: string;
}
