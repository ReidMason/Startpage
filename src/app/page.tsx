import AppsGrid from "@/components/AppsGrid";
import { getConfig } from "@/services/config/config";

export default async function Home() {
  const config = await getConfig();

  return (
    <main>
      <AppsGrid config={config} />
    </main>
  );
}
