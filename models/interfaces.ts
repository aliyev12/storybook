import { Request } from "express";
import { IUser } from "./User";

export interface Req extends Request {
  user: IUser;
}
