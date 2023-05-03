import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
  errorResponse,
  errorSchema,
  successResponseSchema,
} from "../utils/response";
import { successResponse } from "../utils/response";
import { HydratedDocument } from "mongoose";
import { BaseSpeciesSchema } from "./schema";
import { SpeciesModel, SpeciesDocument } from "./model";

export const speciesRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          scientificName: Type.String(),
          description: Type.String(),
        }),
        response: {
          200: successResponseSchema(BaseSpeciesSchema),
          "4xx": errorSchema,
        },
      },
      //preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const { name, scientificName, description } = request.body;

      const species: HydratedDocument<SpeciesDocument> =
        await SpeciesModel.create({
          name,
          scientificName,
          description,
        });

      species.save();
      return reply.status(201).send(successResponse(species));
    }
  );

  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: successResponseSchema(Type.Array(BaseSpeciesSchema)),
          "4xx": errorSchema,
        },
      },
      //preValidation: [fastify.verifyJWT],
    },
    async (_, reply) => {
      const species = await SpeciesModel.find({}).exec();

      return reply.status(200).send(successResponse(species));
    }
  );
};
