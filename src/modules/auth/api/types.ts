import { IBaseType } from "../../../app/lib/types/baseType";
import { IUser } from "../control/types";

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignUp extends ILogin {
  firstName: string;
  lastName: string;
}

export interface IGetSelf extends IUser, IBaseType {}

