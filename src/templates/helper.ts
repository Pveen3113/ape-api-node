import path from "path";
import { PDFDocument } from "pdf-lib";
import { FileType, TemplateModel } from "./model";
import fs from "fs-extra";
import { firebaseStorage } from "../config/firebase";

export async function modifyPdf(fileType: FileType, text: string) {
  const template = await TemplateModel.findOne({ fileType });
  if (!template) return;
  const existingPdfBytes = await fetch(template.url).then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText(text, {
    x: template.xCoordinate,
    //y: height / 2 ,
    y: template.yCoordinate,
    size: 50,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

const fileWrite = async (
  pdfBytes: any,
  fileType: FileType,
  fileName: string
) => {
  const TEMPORARY_DOWNLOAD_DIR = path.resolve(".", "temp");

  if (!fs.pathExistsSync(TEMPORARY_DOWNLOAD_DIR)) {
    fs.mkdirSync(TEMPORARY_DOWNLOAD_DIR);
  }
  const generatedPDFPath = path.join(`temp-${fileName}`);
  await fs.writeFile(generatedPDFPath, pdfBytes);
  const generatedFile = await fs.readFile(generatedPDFPath);
  const newFileName = `${fileType} - ${fileName}.pdf`;
};
