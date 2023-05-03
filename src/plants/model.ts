import { Schema, model, Types } from "mongoose";

export interface PlantDocument {
  species: Types.ObjectId;
  quantity: number;
}

const plantSchema = new Schema<PlantDocument>({
  species: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
});

export const PlantModel = model<PlantDocument>("Plants", plantSchema);
