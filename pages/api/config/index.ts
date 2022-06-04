import { NextApiRequest, NextApiResponse } from "next";
import { saveConfig } from "../../../services/server/config/config";

export default async function getConfig(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const newConfigData = JSON.parse(req.body);
    await saveConfig(newConfigData);

    // Revalidate static content
    await res.unstable_revalidate("/");

    return res.status(200).json(newConfigData);
  }
}
