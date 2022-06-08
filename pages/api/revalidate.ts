import { NextApiRequest, NextApiResponse } from "next";

export default async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Revalidate static content
  await res.unstable_revalidate("/");
  return res.status(200).json({ message: "Revalidated" });
}
