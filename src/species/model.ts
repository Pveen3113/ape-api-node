import { Schema, model } from "mongoose";

export interface SpeciesDocument {
  name: string;
  scientificName: string;
  description: string;
}

const speciesSchema = new Schema<SpeciesDocument>({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  description: { type: String, required: true },
});

export const SpeciesModel = model<SpeciesDocument>("Species", speciesSchema);
