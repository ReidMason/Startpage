import { Config } from "../backend/routers/config/schemas";
import { trpc } from "../utils/trpc";

export default (onSuccess?: (config: Config) => void) => {
  return {
    config: trpc.useQuery(["config.get"], { onSuccess }),
    configMutation: trpc.useMutation(["config.save"]),
  };
};
