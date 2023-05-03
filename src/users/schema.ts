import { Type } from "@sinclair/typebox";
import { Roles } from "./model";

export const createUserBodySchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  country: Type.String(),
  role: Type.Enum(Roles, { type: "string" }),
  firebaseToken: Type.String({
    description: "This token should be retrieved from client SDK",
  }),
});

export const loginUserBodySchema = Type.Object({
  email: Type.String(),
  firebaseToken: Type.String({
    description: "This token should be retrieved from client SDK",
  }),
});

export const createUserAccountSuccessSchema = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  role: Type.String(),
  token: Type.String(),
  refreshToken: Type.String(),
});

export const loginUserSuccessSchema = Type.Object({
  token: Type.String(),
  refreshToken: Type.String(),
});
