export interface UserModel {
  email: string;
  name: string;
}

export interface UserReturn extends UserModel {
  id: string;
}

export interface UpdatedUser {
  email?: string;
  name?: string;
}
