import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { HydratedDocument } from "mongoose";
import { UserDocument, UserModel } from "../users/model";
import { OrderDocument, OrderModel } from "../orders/model";
import { errorSchema, successResponse } from "../utils/response";
import { successResponseSchema } from "../utils/response";
import { modifyPdf } from "./helper";
import { FileType, TemplateDocument, TemplateModel } from "./model";
import { BaseTemplateSchema } from "./schema";
import { PDFDocument } from "pdf-lib";

export const templateRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          url: Type.String(),
          fileType: Type.Enum(FileType, { type: "string" }),
          xCoordinate: Type.Number(),
          yCoordinate: Type.Number(),
        }),
        response: {
          200: successResponseSchema(BaseTemplateSchema),
          "4xx": errorSchema,
        },
      },
      //preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const { url, fileType, xCoordinate, yCoordinate } = request.body;

      const template: HydratedDocument<TemplateDocument> =
        await TemplateModel.create({
          url,
          fileType,
          xCoordinate,
          yCoordinate,
        });

      template.save();
      return reply.status(201).send(successResponse(template));
    }
  );

  fastify.post(
    "/generateDocuments",
    {
      schema: {
        body: Type.Object({
          pdflink: Type.String(),
          username: Type.String(),
          xCoordinate: Type.Number(),
          yCoordinate: Type.Number()
        }),
      },

      //preValidation: [fastify.verifyJWT],
    },
    async (request, reply) => {
      const { pdflink, username, xCoordinate, yCoordinate } = request.body;
      //const username = "Sharvin"
      //const pdflink = "https://firebasestorage.googleapis.com/v0/b/apedell-6e060.appspot.com/o/pdf%2F().pdf?alt=media&token=1d6fc992-a977-4890-a520-a38b6695a785"
      const existingPdfBytes = await fetch(pdflink).then(res => res.arrayBuffer())
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()
      firstPage.drawText(username, {
        x: xCoordinate,
        //y: height / 2 ,
        y: yCoordinate,
        size: 50,
      })
      const pdfBytes = await pdfDoc.save();
      const base64 = Buffer.from(pdfBytes).toString('base64');
      return reply.send(base64)
    }
  );
};
