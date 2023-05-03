import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify
    .register(fastifySwagger, {
      swagger: {
        info: {
          title: "Testing API SHA",
          version: "1.0.0",
        },
        securityDefinitions: {
          Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
          },
        },
      },
    })
    .register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });
};

export default fastifyPlugin(swaggerPlugin, "4.x");
