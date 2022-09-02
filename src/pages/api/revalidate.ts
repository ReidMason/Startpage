import { NextApiResponse, NextApiRequest } from "next";

export default async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await res.revalidate("/");
  return res.status(200).send("Revalidated");
}
