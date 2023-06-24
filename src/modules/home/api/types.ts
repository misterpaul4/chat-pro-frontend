import { IBaseType } from "../../../app/lib/types/baseType";
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

interface IThreadMessagePayload {
  message: string;
  starred?: boolean;
}

export interface IChatRequestPayload {
  receiverId: string;
  inbox: IThreadMessagePayload;
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

export interface IMessage extends IBaseType, IThreadMessagePayload {
  sender: IUser;
  senderId: string;
  replyingTo?: string;
  read: boolean;
  threadId: string;
}

export interface IThread extends IBaseType {
  createdBy: string;
  updatedBy: string;
  title: string;
  description: string;
  type: string;
  messages: IMessage[];
  users: IUser[];
}

export type IInbox = IThread[];

export enum ThreadTypeEnum {
  Private = "Private",
  Group = "Group",
  Request = "Request",
  Self = "Self",
}

export interface IMassUpdateContacts {
  contactIds: string[];
  blocked?: boolean;
  favourite?: boolean;
}

export interface ICreateMessage {
  threadId: string;
  message: string;
}

export interface IsTypingPayload {
  isTyping: boolean;
  threadId: string;
}

export interface ITypingResponse {
  isTyping: boolean;
  threadId: string;
  clientId: string;
}

export interface IOnlineStatus {
  user: string;
  isOnline: boolean;
}

// key is threadId
export type $typing = { [key in string]: ITypingResponse["clientId"] };

export type $onlineStatus = string[];

export interface IThreadMemory {
  pos: number;
  mSize: number;
  message: string | undefined | null;
  replyingTo?: IMessage;
}

