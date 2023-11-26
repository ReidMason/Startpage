import { Button } from "@/components/Button/Button";
import MainDisplay from "@/components/MainDisplay/MainDisplay";
import StyleHandler from "@/components/StyleHandler/StyleHandler";
import { getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();

  return (
    <StyleHandler config={config}>
      <MainDisplay config={config} />
    </StyleHandler>
  );
}

export const dynamic = "force-dynamic";
// export const revalidate = 3600;
