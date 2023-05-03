import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
//import { ProductDocument, ProductModel } from "../../../model/Product";
import { OrderModel, OrderDocument, PlantingStage } from "./model";
import {
  errorResponse,
  errorSchema,
  successResponseSchema,
} from "../utils/response";
import { successResponse } from "../utils/response";
import { ErrorCodes, ERROR_TITLE } from "../vars/errorCodes";
import { HydratedDocument } from "mongoose";
import { BaseOrderSchema, ExtendedOrderSchema } from "./schema";
import { SpeciesDocument, SpeciesModel } from "../species/model";
import { PlantModel, PlantDocument } from "../plants/model";
import { PaymentModel, PaymentDocument } from "../payments/model";

export const orderRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          greetings: Type.String(),
          plants: Type.Array(
            Type.Object({
              species: Type.String(),
              quantity: Type.Number(),
            })
          ),
        }),
        response: {
          200: successResponseSchema(BaseOrderSchema),
          "4xx": errorSchema,
        },
      },
      preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const { plants, greetings } = request.body;
      const { id } = request.user;

      const allSpeciesIds = plants.map((plant) => plant.species);
      const species: HydratedDocument<SpeciesDocument>[] | null =
        await SpeciesModel.find({
          _id: {
            $in: allSpeciesIds,
          },
        });

      if (!species) {
        return reply
          .status(400)
          .send(
            errorResponse(
              ErrorCodes.INVALID_SPECIES_ID,
              ERROR_TITLE[ErrorCodes.INVALID_SPECIES_ID]
            )
          );
      }

      const newPlants: HydratedDocument<PlantDocument>[] =
        await PlantModel.insertMany(plants);

      const order: HydratedDocument<OrderDocument> = await OrderModel.create({
        user: id,
        greetings,
        plants: newPlants.map((plant) => plant._id),
      });

      const totalQuantities = plants.reduce((total, curr) => {
        return total + curr.quantity;
      }, 0);

      const totalAmount = totalQuantities * 25;

      const payment = await PaymentModel.create({
        order: order._id,
        totalAmount,
      });
      order.set("payment", payment._id);

      order.save();
      payment.save();

      return reply.status(201).send(successResponse(order));
    }
  );

  fastify.get(
    "/me",
    {
      schema: {
        response: {
          200: successResponseSchema(Type.Array(BaseOrderSchema)),
          "4xx": errorSchema,
        },
      },
      preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const { id } = request.user;
      const orders: HydratedDocument<OrderDocument>[] | null =
        await OrderModel.find({
          user: id,
        }).exec();
      if (!orders) {
        return reply.status(204).send(successResponse([]));
      }
      console.log(orders);
      return reply.status(200).send(successResponse(orders));
    }
  );

  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: successResponseSchema(Type.Array(ExtendedOrderSchema)),
          "4xx": errorSchema,
        },
      },
      preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const orders: HydratedDocument<OrderDocument>[] | null =
        await OrderModel.find({}).populate({ path: "user" });
      if (!orders) {
        return reply.status(204).send(successResponse([]));
      }
      console.log(orders);
      return reply.status(200).send(successResponse(orders));
    }
  );

  fastify.patch(
    "/:orderId/approve",
    {
      schema: {
        params: Type.Object({
          orderId: Type.String(),
        }),
        response: {
          200: successResponseSchema(Type.String()),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const order = await OrderModel.findByIdAndUpdate(orderId, {
        approved: true,
      });
      if (!order) {
        reply
          .status(404)
          .send(
            errorResponse(
              ErrorCodes.INVALID_ORDER_ID,
              ERROR_TITLE[ErrorCodes.INVALID_ORDER_ID]
            )
          );
      }
      reply.status(200).send(successResponse("Approved"));
    }
  );

  fastify.patch(
    "/:orderId/setStage",
    {
      schema: {
        params: Type.Object({
          orderId: Type.String(),
        }),
        body: Type.Object({
          plantingStage: Type.Enum(PlantingStage, { type: "string" }),
        }),
        response: {
          200: successResponseSchema(Type.String()),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { plantingStage } = request.body;
      const { orderId } = request.params;

      const order = await OrderModel.findByIdAndUpdate(orderId, {
        plantingStage,
      });
      if (!order) {
        reply
          .status(404)
          .send(
            errorResponse(
              ErrorCodes.INVALID_ORDER_ID,
              ERROR_TITLE[ErrorCodes.INVALID_ORDER_ID]
            )
          );
      }
      reply.status(200).send(successResponse("Approved"));
    }
  );
  fastify.patch(
    "/:orderId/updateCoordinates",
    {
      schema: {
        params: Type.Object({
          orderId: Type.String(),
        }),
        body: Type.Object({
          coordinates: Type.String(),
        }),
        response: {
          200: successResponseSchema(Type.String()),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { coordinates } = request.body;
      const { orderId } = request.params;

      const order = await OrderModel.findByIdAndUpdate(orderId, {
        coordinates,
      });
      if (!order) {
        reply
          .status(404)
          .send(
            errorResponse(
              ErrorCodes.INVALID_ORDER_ID,
              ERROR_TITLE[ErrorCodes.INVALID_ORDER_ID]
            )
          );
      }
      reply.status(200).send(successResponse("Updated coordinates"));
    }
  );
};
