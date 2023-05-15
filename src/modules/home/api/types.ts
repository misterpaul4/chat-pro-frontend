import {
  IBaseCrudResponseType,
  IBaseType,
} from "../../../app/lib/types/baseType";
import { IBaseUser, IUser } from "../../auth/control/types";

export interface IContact extends IBaseType {
  blocked: boolean;
  contactId: string;
  userId: string;
  favourite: boolean;
  contact: IBaseUser;
}

export interface IVerifyEmail {
  email: string;
}

export interface IChatRequestPayload {
  receiverId: string;
  message?: string;
}

export interface IChatRequest extends IChatRequestPayload, IBaseType {
  senderId: string;
  status: StatusEnum;
  sender: IUser;
  receiver: IUser;
}

export enum StatusEnum {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface IMessage extends IBaseType {
  message: string;
  starred: boolean;
  sender: IUser;
  receiver: IUser;
  senderId: string;
  replyingTo?: string;
  read: boolean;
  threadId: string;
}

export interface IThread extends IBaseType {
  title: string;
  description: string;
  type: ThreadTypeEnum;
  messages: IMessage[];
  users: IUser[];
}

export type IInbox = IThread[];

export type $activeContact = IChatRequest | IThread;

export enum ThreadTypeEnum {
  Private = "Private",
  Group = "Group",
  Request = "Request",
  Self = "Self",
}

