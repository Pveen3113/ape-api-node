import { Schema, model } from "mongoose";

export enum Roles {
  APE_KL = "APE_KL",
  APE_SANDAKAN = "APE_SANDAKAN",
  SUKAU = "SUKAU",
  CUSTOMER = "CUSTOMER",
}

export interface UserDocument {
  name: string;
  email: string;
  role: Roles;
  country: string;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: Roles, required: true },
  country: { type: String, required: true },
});

export const UserModel = model<UserDocument>("User", userSchema);
