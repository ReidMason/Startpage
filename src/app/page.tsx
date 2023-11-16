import { getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();

  return (
    <main>
      <div>Version: {config.version}</div>
    </main>
  );
}
