import { IBaseType } from "../../../app/lib/types/baseType";
import { IBaseUser, IUser } from "../control/types";

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignUp extends ILogin {
  firstName: string;
  lastName: string;
}

export interface IGetSelf extends IUser, IBaseType {}

export interface IVerificationCodePayload {
  code: string;
  id: string;
}

export interface IResetPasswordPayload extends IVerificationCodePayload {
  password: string;
}

export interface IAuthResponse {
  user: IBaseUser;
  token: string;
}

