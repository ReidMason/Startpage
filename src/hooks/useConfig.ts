import { Config } from "../backend/routers/config/schemas";
import { trpc } from "../utils/trpc";

async function revalidate() {
  await fetch("http://localhost:3000/api/revalidate");
}

export default function useConfig(onSuccess?: (config: Config) => void) {
  return {
    config: trpc.useQuery(["config.get"], { onSuccess }),
    configMutation: trpc.useMutation(["config.save"], {
      onSuccess: async () => {
        await revalidate();
      },
    }),
  };
}
