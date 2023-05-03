import { Static, TSchema, Type } from "@sinclair/typebox";

export type SuccessResponse<T, S = {}> = {
  success: true;
  data: T;
  meta?: { [key: string]: S };
};

export const errorSchema = Type.Object({
  success: Type.Boolean({ default: false }),
  error: Type.Object({
    code: Type.String(),
    title: Type.String(),
  }),
});

export const successResponseSchema = (dataSchema: TSchema) =>
  Type.Object({
    success: Type.Boolean({ default: true }),
    data: dataSchema,
  });

export type ErrorObject = Static<typeof errorSchema>;

// Meta should be object
export const successResponse = <T, S = {}>(
  data: T,
  meta?: { [key: string]: S }
): SuccessResponse<T, S> => {
  return {
    success: true,
    data,
    meta,
  };
};

export const errorResponse = (
  errorCode: string,
  title: string
): ErrorObject => {
  return {
    success: false,
    //Can also have details to specifically explain on where the error went wrong
    error: {
      code: errorCode,
      title,
    },
  };
};

export type WithSuccessResponse<T = TSchema> = SuccessResponse<T>;
