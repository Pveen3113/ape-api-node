import { Type } from "@sinclair/typebox";
import { PaymentStatus } from "./model";


export const BasePaymentSchema = Type.Object({
  _id: Type.String(),
  order: Type.String(),
  clientSecret: Type.Optional(Type.String()),
  totalAmount: Type.Number(),
  paymentStatus: Type.Enum(PaymentStatus, { type: "string" }),
});
