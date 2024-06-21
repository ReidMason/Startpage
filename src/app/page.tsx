import MainDisplay from "@/components/MainDisplay/MainDisplay";
import { getBackgroundImage, getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();

  const imageBuffer = await getBackgroundImage();
  let imageDataUrl = "";
  if (imageBuffer) {
    const base64String = Buffer.from(imageBuffer).toString("base64");
    imageDataUrl = `data:image/jpeg;base64,${base64String}`;
  }

  return <MainDisplay config={config} backgroundImageUrl={imageDataUrl} />;
}

export const dynamic = "force-dynamic";
