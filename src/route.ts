import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { orderRoutes } from "./orders/route";
import { paymentRoute } from "./payments/route";
import { speciesRoutes } from "./species/route";
import { templateRoutes } from "./templates/route";
import { userRoutes } from "./users/route";

const v1Route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.register(userRoutes, { prefix: "/user" });
  fastify.register(paymentRoute, { prefix: "/payments" });
  fastify.register(orderRoutes, { prefix: "/orders" });
  fastify.register(speciesRoutes, { prefix: "/species" });
  fastify.register(templateRoutes, { prefix: "/templates" });
};

export default v1Route;
