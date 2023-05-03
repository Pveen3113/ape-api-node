import { Schema, model, Types } from "mongoose";

export enum PaymentStatus {
  ORDERED = "ORDERED",
  PENDING = "PENDING",
  PAID = "PAID",
}

export interface PaymentDocument {
  order: Types.ObjectId;
  clientSecret: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
}

const paymentSchema = new Schema<PaymentDocument>({
  order: { type: Schema.Types.ObjectId, required: true },
  clientSecret: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.ORDERED,
  },
  totalAmount: { type: Number, required: true },
});

export const PaymentModel = model<PaymentDocument>("Payments", paymentSchema);
