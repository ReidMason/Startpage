import { trpc } from "../utils/trpc";

export default () => {
  return {
    config: trpc.useQuery(["config.get"]),
    configMutation: trpc.useMutation(["config.save"]),
  };
};
