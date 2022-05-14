import { NextApiRequest, NextApiResponse } from "next";
import {
  getConfig as loadConfig,
  saveConfig,
} from "../../../services/config/config";

export default async function getConfig(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const config = await loadConfig();
    res.status(200).json(config);
  } else if (req.method === "POST") {
    const newConfigData = JSON.parse(req.body);
    await saveConfig(newConfigData);
    res.status(200).json(newConfigData);
  }
}
