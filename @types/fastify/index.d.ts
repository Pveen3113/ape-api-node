import {
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyTypeProviderDefault,
  FastifyBaseLogger,
} from "fastify";

declare module "fastify" {
  export interface FastifyInstance<
    RawServer = RawServerDefault,
    RawRequest = RawRequestDefaultExpression<RawServer>,
    RawReply = RawReplyDefaultExpression<RawServer>,
    Logger = FastifyBaseLogger,
    TypeProvider = FastifyTypeProviderDefault
  > {
    verifyJWT: () => void;
    checkPermission(): void;
  }

  export interface FastifyContextConfig {
    allowedRoles?: string[];
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: { id: string; role: string };
  }
}
