import { IUser } from "../auth/control/types";
import { IThread } from "./api/types";

export const getPrivateThreadRecipient: (
  threadUsers: IThread["users"],
  userId: string
) => IUser = (threadUsers, userId) =>
  threadUsers.find((th) => th.id !== userId) as IUser;

