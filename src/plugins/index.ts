import fastify, { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import auth from "./auth";
import body from "./body";
import swagger from "./swagger";

const Plugins: FastifyPluginAsync = async (fastify) => {
  fastify
    .register(auth, {
      jwtSecret: "abcd",
    })
    .register(body)
    .register(swagger);
};

export default fastifyPlugin(Plugins, "4.x");
