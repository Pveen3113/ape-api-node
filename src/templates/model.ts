import { Schema, model } from "mongoose";

export enum FileType {
  Certificate = "CERTIFICATE",
  Note = "NOTE",
}

export interface TemplateDocument {
  url: string;
  fileType: FileType;
  xCoordinate: number;
  yCoordinate: number;
}

const templateSchema = new Schema<TemplateDocument>({
  url: { type: String, required: true },
  fileType: { type: String, enum: FileType, required: true },
  xCoordinate: { type: Number, required: true },
  yCoordinate: { type: Number, required: true },
});

export const TemplateModel = model<TemplateDocument>("Templates", templateSchema);
