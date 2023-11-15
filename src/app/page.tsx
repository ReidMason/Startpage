import { api } from "~/trpc/server";
import App from "~/app/_components/App/App";

export default async function Home() {
  const config = await api.config.getConfig.query();

  return (
    <main>
      {config.apps.map((app) => (
        <App app={app} />
      ))}
    </main>
  );
}
