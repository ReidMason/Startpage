import MainDisplay from "@/components/MainDisplay/MainDisplay";
import { getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();
  return <MainDisplay config={config} />;
}

export const dynamic = "force-dynamic";
