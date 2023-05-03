import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type, Static } from "@sinclair/typebox";
import {
  createUserBodySchema,
  loginUserBodySchema,
  createUserAccountSuccessSchema,
  loginUserSuccessSchema,
} from "./schema";
import {
  errorResponse,
  errorSchema,
  successResponse,
  successResponseSchema,
} from "../utils/response";
import { firebaseAuth } from "../config/firebase";
import { ErrorCodes, ERROR_TITLE } from "../vars/errorCodes";
import { UserModel, UserDocument } from "./model";
import { HydratedDocument } from "mongoose";
import { generateAuthTokens } from "../utils/auth";

export const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "/signup",
    {
      schema: {
        tags: ["User"],
        body: createUserBodySchema,
        description: "Create a user account",
        response: {
          201: successResponseSchema(createUserAccountSuccessSchema),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, email, country, role, firebaseToken } = request.body;
      const { email: firebaseEmail } = await firebaseAuth().verifyIdToken(
        firebaseToken
      );

      if (!firebaseEmail) {
        return reply
          .status(401)
          .send(
            errorResponse(
              ErrorCodes.FIREBASE_AUTHENTICATION_ERROR,
              ERROR_TITLE[ErrorCodes.FIREBASE_AUTHENTICATION_ERROR]
            )
          );
      }

      const User: HydratedDocument<UserDocument> = await UserModel.create({
        name,
        email,
        country,
        role,
      });
      const { token, refreshToken } = await generateAuthTokens(reply, User);
      User.save();
      reply
        .status(201)
        .send(successResponse({ ...User.toJSON(), token, refreshToken }));
    }
  );
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["User"],
        body: loginUserBodySchema,
        description: "Login a user account",
        response: {
          200: successResponseSchema(loginUserSuccessSchema),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, firebaseToken } = request.body;
      const { email: firebaseEmail } = await firebaseAuth().verifyIdToken(
        firebaseToken
      );

      if (!firebaseEmail) {
        return reply
          .status(401)
          .send(
            errorResponse(
              ErrorCodes.FIREBASE_AUTHENTICATION_ERROR,
              ERROR_TITLE[ErrorCodes.FIREBASE_AUTHENTICATION_ERROR]
            )
          );
      }

      const User: HydratedDocument<UserDocument> | null =
        await UserModel.findOne({
          email,
        }).exec();
      const { token, refreshToken } = await generateAuthTokens(reply, User);

      reply.status(200).send(successResponse({ token, refreshToken }));
    }
  );

  fastify.post(
    "/refreshToken",
    {
      schema: {
        tags: ["User"],
        body: Type.Object({
          refreshToken: Type.String(),
        }),
        description: "Refresh JWT Token",
        response: {
          200: successResponseSchema(
            Type.Object({
              token: Type.String(),
              refreshToken: Type.String(),
            })
          ),
          "4xx": errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { refreshToken } = request.body;

      const decodedToken = fastify.jwt.decode<{ id?: string }>(refreshToken);

      const userId = decodedToken?.id;

      if (!userId) {
        return reply
          .status(400)
          .send(
            errorResponse(
              ErrorCodes.INVALID_REFRESH_TOKEN,
              ERROR_TITLE[ErrorCodes.INVALID_REFRESH_TOKEN]
            )
          );
      }

      const user: HydratedDocument<UserDocument> | null =
        await UserModel.findById(userId).exec();

      if (!user) {
        return reply
          .status(404)
          .send(
            errorResponse(
              ErrorCodes.USER_NOT_FOUND,
              ERROR_TITLE[ErrorCodes.USER_NOT_FOUND]
            )
          );
      }

      const { token, refreshToken: newRefreshToken } = await generateAuthTokens(
        reply,
        user
      );

      return reply
        .status(200)
        .send(successResponse({ token, refreshToken: newRefreshToken }));
    }
  );

  fastify.get(
    "/me",
    {
      schema: {
        security: [{ Bearer: [] }],
        //Why throwing an error
        //tags: ["Users"],
        //description: "Get logged in user details",
        response: {
          200: successResponseSchema(
            Type.Object({
              _id: Type.String(),
              name: Type.String(),
              email: Type.String(),
              role: Type.String(),
            })
          ),
          "4xx": errorSchema,
        },
      },
      preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const { id } = request.user;

      const user = await UserModel.findById(id).exec();

      if (!user) {
        return reply
          .status(404)
          .send(
            errorResponse(
              ErrorCodes.USER_NOT_FOUND,
              ERROR_TITLE[ErrorCodes.USER_NOT_FOUND]
            )
          );
      }

      return reply.status(200).send(successResponse(user));
    }
  );
};
