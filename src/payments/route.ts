import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { HydratedDocument } from "mongoose";
import { stripeConfig } from "../config/stripe";
import { ErrorCodes, ERROR_TITLE } from "../vars/errorCodes";
import {
  PaymentDocument,
  PaymentModel,
  PaymentStatus,
} from "./model";
import {
  errorResponse,
  errorSchema,
  successResponse,
  successResponseSchema,
} from "../utils/response";
import { BasePaymentSchema } from "./schema";

export const paymentRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: successResponseSchema(Type.Array(BasePaymentSchema)),
          "4xx": errorSchema,
        },
      },
    },
    async (_, reply) => {
      const allPayments: HydratedDocument<PaymentDocument>[] | null =
        await PaymentModel.find({}).exec();

      if (!allPayments) {
        return reply.status(204).send(successResponse([]));
      }

      reply.status(200).send(successResponse(allPayments));
    }
  );

  fastify.get(
    "/:paymentId",
    {
      schema: {
        params: Type.Object({
          paymentId: Type.String(),
        }),
        response: {
          200: successResponseSchema(BasePaymentSchema),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { paymentId } = request.params;
      const payment: HydratedDocument<PaymentDocument> | null =
        await PaymentModel.findById(paymentId).exec();

      if (!payment) {
        return reply
          .status(400)
          .send(
            errorResponse(
              ErrorCodes.INVALID_PAYMENT_ID,
              ERROR_TITLE[ErrorCodes.INVALID_PAYMENT_ID]
            )
          );
      }

      reply.status(200).send(successResponse(payment));
    }
  );

  fastify.patch(
    "/:paymentId/initialize-payment",
    {
      schema: {
        params: Type.Object({
          paymentId: Type.String(),
        }),
        response: {
          200: successResponseSchema(BasePaymentSchema),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { paymentId } = request.params;
      const payment: HydratedDocument<PaymentDocument> | null =
        await PaymentModel.findById(paymentId);

      if (!payment) {
        return reply
          .status(400)
          .send(
            errorResponse(
              ErrorCodes.INVALID_PAYMENT_ID,
              ERROR_TITLE[ErrorCodes.INVALID_PAYMENT_ID]
            )
          );
      }

      const paymentIntent = await stripeConfig.paymentIntents.create({
        currency: "MYR",
        amount: payment.totalAmount,
        automatic_payment_methods: { enabled: true },
      });

      payment.set("clientSecret", paymentIntent.client_secret);

      payment.save();

      return reply.status(201).send(successResponse(payment));
    }
  );

  fastify.get(
    "/config",
    {
      schema: {
        response: {
          200: successResponseSchema(
            Type.Object({
              publishableKey: Type.String(),
            })
          ),
        },
      },
      preValidation: [fastify.verifyJWT],
    },

    async (_, reply) => {
      return reply.status(200).send(
        successResponse({
          publishableKey:
            "pk_test_51MjZnWCABlc2vtOjDbON4aXHb0L8R0GPKXjTKidF6KI7bp3amwUDHPsWQfv0NuMQP2HQcF5vAMm2wJVhecuy5sZz008VLpwdx5",
        })
      );
    }
  );

  fastify.post(
    "/webhook",
    {
      config: {
        // add the rawBody to this route. if false, rawBody will be disabled when global is true
        rawBody: true,
      },
    },
    async (request, reply) => {
      const sig = request.headers["stripe-signature"];

      let event;
      if (!request.rawBody || !sig) return;
      try {
        event = stripeConfig.webhooks.constructEvent(
          request.rawBody,
          sig,
          "whsec_a6eb80b0c3136514482973fd8c9046910adb34b948992b98841336c7e43a830b"
        );
      } catch (err) {
        return reply.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          // @ts-ignore
          const successClientSecret = paymentIntent["client_secret"];
          const payment: HydratedDocument<PaymentDocument> | null =
            await PaymentModel.findOne({
              clientSecret: successClientSecret,
            }).exec();
          if (!payment) {
            break;
          }
          payment.set("paymentStatus", PaymentStatus.PENDING);
          payment.save();
          break;
        case "payment_method.attached":
          const paymentMethod = event.data.object;
          console.log("PaymentMethod was attached to a Customer!");
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a response to acknowledge receipt of the event
      reply.send({ received: true });
    }
  );
};
