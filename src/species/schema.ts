import { Type } from "@sinclair/typebox";

export const BaseSpeciesSchema = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  scientificName: Type.String(),
  description: Type.String(),
});
