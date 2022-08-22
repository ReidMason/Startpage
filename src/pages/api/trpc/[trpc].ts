import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import configRouter from "../../../backend/routers/config";
import weatherRouter from "../../../backend/routers/weather";

export const appRouter = trpc
  .router()
  .merge("config.", configRouter)
  .merge("weather.", weatherRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
