export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

export interface IAuth {
  loggedIn: boolean;
  token: string;
}

