import { FastifyReply } from "fastify";

export type AuthTokenPayload = {
  id: string;
  role: string;
};

type AuthTokens = {
  token: string;
  refreshToken: string;
};

export const generateAuthTokens = async (
  reply: FastifyReply,
  user: any
): Promise<AuthTokens> => {
  const generatedTime = new Date();

  const token = await reply.jwtSign(
    {
      id: user._id,
      role: user.role,
      generatedTime,
    },
    {
      expiresIn: "4h",
    }
  );

  const refreshToken = await reply.jwtSign(
    {
      id: user._id,
      generatedTime,
    },
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    refreshToken,
  };
};
