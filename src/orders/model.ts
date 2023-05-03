import { Schema, Types, model } from "mongoose";

export enum PlantingStage {
  Payment = "Payment",
  Preparation = "Preparation",
  Planting = "Planting",
  Processing = "Processing",
  Received = "Received",
}

export interface OrderDocument {
  user: Types.ObjectId;
  approved: boolean;
  plants: Types.Array<Types.ObjectId>;
  greetings: string;
  plantingStage: PlantingStage;
  payment: Types.ObjectId;
  coordinates: string;
  //TODO: certificate id
  //TODO: images
}

const orderSchema = new Schema<OrderDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  approved: { type: Boolean, default: false },
  plants: [{ type: Schema.Types.ObjectId, required: true, ref: "Plants" }],
  greetings: { type: String, required: true },
  plantingStage: {
    type: String,
    enum: PlantingStage,
    default: PlantingStage.Payment,
  },
  coordinates: { type: String },
  payment: { type: Schema.Types.ObjectId, ref: "Payments" },
});

export const OrderModel = model<OrderDocument>("Order", orderSchema);
