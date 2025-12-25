export type Role = 'user' | 'professional' | 'admin';

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: Role;
  telephone?: string;
  token?: string;
}
