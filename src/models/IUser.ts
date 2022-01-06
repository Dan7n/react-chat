export interface IUser {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  id: string;
  createdAt: Date;
  emailVerified?: boolean;
  conversations?: [];
}
