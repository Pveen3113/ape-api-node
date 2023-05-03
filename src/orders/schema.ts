import { Type } from "@sinclair/typebox";
import { PlantingStage } from "./model";

export const BaseOrderSchema = Type.Object({
  _id: Type.String(),
  user: Type.String(),
  approved: Type.Boolean(),
  plants: Type.Array(Type.String()),
  greetings: Type.String(),
  plantingStage: Type.Enum(PlantingStage, { type: "string" }),
  payment: Type.String(),
});

export const ExtendedOrderSchema = Type.Object({
  _id: Type.String(),
  user: Type.Object({
    name: Type.String(),
    country: Type.String(),
  }),
  approved: Type.Boolean(),
  plants: Type.Array(Type.String()),
  greetings: Type.String(),
  plantingStage: Type.Enum(PlantingStage, { type: "string" }),
  payment: Type.String(),
  coordinates: Type.Optional(Type.String()),
});
