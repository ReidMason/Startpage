import MainDisplay from "@/components/MainDisplay/MainDisplay";
import { getBackgroundImage, getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();

  const imageDataUrl = await getBackgroundImage();

  return <MainDisplay config={config} backgroundImageUrl={imageDataUrl} />;
}

export const dynamic = "force-dynamic";
