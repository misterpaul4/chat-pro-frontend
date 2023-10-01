import { IBaseUser } from "../modules/auth/control/types";

const dt = new Date();

export const TEMP_USER: IBaseUser = {
  email: "test@email.com",
  firstName: "test_firstName",
  lastName: "test_lastName",
  id: "032f3992-f4a4-4d88-a855-441ffd6fddc3",
  createdAt: dt.toISOString(),
  updatedAt: dt.toISOString(),
};

