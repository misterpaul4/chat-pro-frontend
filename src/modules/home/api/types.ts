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
  receiverId: string;
  replyingTo?: string;
  read: boolean;
}

export interface IInbox extends IBaseCrudResponseType {
  data: IMessage[];
}

export interface IMessageReponse extends IBaseCrudResponseType {
  data: IMessage[];
}

export interface IShallowInbox extends IContact {
  contact: IShallowBaseUser;
}

interface IShallowBaseUser extends IBaseUser {
  sentMessages: IMessage[];
  receivedMessages: IMessage[];
}

export type $activeContact = IChatRequest | IContact;

