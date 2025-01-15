import { Model } from "mongoose";

export interface IUser {
  _id: any;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  image: string;
  role: "super-admin" | "admin" | "moderator" | "salesman" | "user";
  status: "In-progress" | "Block";
  isDeleted: boolean;
  passwordChangeAt: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExists(email: string): Promise<IUser | null>;
  isPasswordMatch(planText: string, hash: string): Promise<IUser | null>;
}
