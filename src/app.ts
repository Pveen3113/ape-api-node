import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { initializeFirebaseAdmin } from "./config/firebase";
import { initializeMongoDB } from "./config/mongo";
import plugins from "./plugins";
import v1Route from "./route";

const App: FastifyPluginAsync = async (fastify) => {
  try {
    await initializeFirebaseAdmin();
    fastify.log.info("Firebase connected");
  } catch (err) {
    fastify.log.error(err);
  }

  try {
    await initializeMongoDB();
    fastify.log.info("MongoDB connected");
  } catch (err) {
    fastify.log.error(err);
  }

  fastify
    .register(fastifyCors, {
      origin: [/http?:\/\/localhost:\d*$/, /http?:\/\/127.0.0.1:\d*$/],
      credentials: true,
    })
    .register(fastifyHelmet)
    .register(fastifyFormbody)
    .register(plugins)
    .register(v1Route, { prefix: "v1" });
};

export default fastifyPlugin(App, "4.x");
