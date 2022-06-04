import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";

const BG_PATH = "./public/static/background.png";

export default async function saveBackground(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    await form.parse(req, async (err, fields, files) => {
      const file = files.file as formidable.File;
      await saveFile(file);
    });
    return res.status(200).json({});
  }
}

const saveFile = async (file: formidable.File) => {
  var rawData = fs.readFileSync(file.filepath);
  await fs.writeFileSync(BG_PATH, rawData);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
