import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import fastifyRawBody from "fastify-raw-body";

const rawBodyPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyRawBody, {
    field: "rawBody", // change the default request.rawBody property name
    global: false, // add the rawBody to every request. **Default true**
    encoding: "utf8", // set it to false to set rawBody as a Buffer **Default utf8**
    runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
    routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
  });
};

export default fp(rawBodyPlugin, "4.x");
