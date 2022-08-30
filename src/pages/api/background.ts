import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import sharp from "sharp";

const BG_PATH = "./public/static/background.png";
type ProcessedFile = formidable.File | null;

export default async function background(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let status = 200,
      resultBody = {
        message: "Files were uploaded successfully",
      };

    /* Get files using formidable */
    const file = await new Promise<ProcessedFile | undefined>(
      (resolve, reject) => {
        const form = new formidable.IncomingForm();
        let processedFile: ProcessedFile = null;
        form.on("file", function (_, file) {
          processedFile = file;
        });
        form.on("end", () => resolve(processedFile));
        form.on("error", (err) => reject(err));
        form.parse(req, () => {});
      }
    ).catch(() => {
      status = 500;
      resultBody = {
        message: "Upload error",
      };
    });

    if (file) {
      /* Move uploaded files to directory */
      const tempPath = file.filepath;

      await sharp(tempPath)
        .resize(1920, 1080)
        .jpeg({
          quality: 80,
        })
        .toFile(BG_PATH);
    }

    res.status(status).json(resultBody);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
