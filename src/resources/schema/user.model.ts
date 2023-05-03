export interface UserModel {
  email: string;
  name: string;
}

export interface UserReturn {
  id: string;
  email: string;
  name: string;
}

export interface UpdatedUser {
  email?: string;
  name?: string;
}
