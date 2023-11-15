import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getConfig } from "~/server/services/config/config";

const configRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return await getConfig();
  }),
  // save: publicProcedure.input(saveConfigSchema).mutation(async ({ input }) => {
  //   const currentConfig = await getConfig();
  //   const newConfig = completeConfig(
  //     currentConfig,
  //     input.config,
  //     input.updateCacheKey,
  //   );
  //   await saveConfig(newConfig);
  //   return newConfig;
  // }),
});

export default configRouter;
