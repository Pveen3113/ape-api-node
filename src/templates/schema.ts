import { Type } from "@sinclair/typebox";
import { FileType } from "./model";

export const BaseTemplateSchema = Type.Object({
  _id: Type.String(),
  url: Type.String(),
  fileType: Type.Enum(FileType, { type: "string" }),
  xCoordinate: Type.Number(),
  yCoordinate: Type.Number(),
});
