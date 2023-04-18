import { IBaseType } from "../../../app/lib/types/baseType";
import { IBaseUser } from "../../auth/control/types";

export interface IContact extends IBaseType {
  blocked: boolean;
  contactId: string;
  userId: string;
  favourite: boolean;
  contact: IBaseUser;
}

