import MainDisplay from "@/components/MainDisplay/MainDisplay";
import StyleHandler from "@/components/StyleHandler/StyleHandler";
import { getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();

  return (
    <main className="py-[5%]">
      <StyleHandler config={config}>
        <MainDisplay config={config} />
      </StyleHandler>
    </main>
  );
}

export const dynamic = "force-dynamic";
// export const revalidate = 3600;
