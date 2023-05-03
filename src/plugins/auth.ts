import {
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import fp from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";
import fastifyAuth from "@fastify/auth";

export interface AuthorizationPluginOptions {
  jwtSecret: string;
}

const authorizationPlugin: FastifyPluginAsync<
  AuthorizationPluginOptions
> = async (fastify, options) => {
  fastify
    .register(fastifyJWT, {
      secret: options.jwtSecret,
    })
    .decorate(
      "verifyJWT",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (error) {
          reply.send(error);
        }
      }
    )
    .decorate(
      "checkPermission",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.user.role || "";
        const allowedRoles = request.routeConfig.allowedRoles || [];

        if (!(allowedRoles.includes(userRole) || allowedRoles.includes("*"))) {
          reply.code(401).send("Unauthorized.");
        }
      }
    );
};

export default fp(authorizationPlugin, "4.x");
