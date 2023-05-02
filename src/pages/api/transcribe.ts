// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

type ResponseData = {
  ok: boolean;
  data: any;
  message?: string;
};

import fs from "fs";
import path from "path";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

async function transcribeAudio(
  filePath: string,
  prompt?: string,
  language?: string
) {
  const openai = new OpenAIApi(configuration);

  const response = await openai.createTranscription(
    // @ts-ignore
    fs.createReadStream(filePath),
    "whisper-1",
    prompt,
    "json",
    undefined,
    language
  );

  return response;
}

async function createFile() {
  // @ts-ignore
  fs.rename(file.filepath, filePath, (err) => {});
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(400).json({
      ok: false,
      message: "Bad Request",
      data: null,
    });
  }

  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    fs.mkdirSync(uploadDir, { recursive: true });

    return form.parse(req, async (err, fields, files) => {
      if (err) {
        res
          .status(500)
          .json({ ok: false, message: "Internal server error", data: null });
        reject();
      }

      let file = files.audio;

      // @ts-ignore
      const fileName = file.originalFilename;
      const filePath = path.join(uploadDir, fileName);
      // @ts-ignore
      fs.renameSync(file.filepath, filePath);

      const data = await transcribeAudio(
        filePath,
        fields?.prompt as string,
        fields.language as string
      );

      console.log(data.data);

      res.status(200).json({
        ok: true,
        message: "File uploaded successfully",
        data: data.data,
      });
      resolve(res);
    });
  });
}
