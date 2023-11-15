import { getConfig } from "~/server/services/config/config";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const configRouter = createTRPCRouter({
  getConfig: publicProcedure.query(() => {
    return getConfig();
  }),
});
