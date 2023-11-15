import { api } from "~/trpc/server";
import { StyleController } from "./_components/StyleController/StyleController";
import { MainContent } from "./_components/MainContent/MainContent";

export default async function Home() {
  const config = await api.config.get.query();

  return (
    <main>
      {
        <StyleController config={config}>
          <MainContent config={config} />
        </StyleController>
      }
    </main>
  );
}
