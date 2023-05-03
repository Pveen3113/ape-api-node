import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import app from "./app";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        singleLine: true,
        messageFormat: "{levelLabel} - {pid} - msg: {msg} - url:{req.url}\n",
        hideObject: true,
      },
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

(async () => {
  server.register(app);

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening sha at ${address}`);
  });
})();
