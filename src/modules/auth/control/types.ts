import { IBaseType } from "../../../app/lib/types/baseType";

export interface IBaseUser {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends IBaseType, IBaseUser {}

export interface IAuth {
  loggedIn: boolean;
  token: string;
}

