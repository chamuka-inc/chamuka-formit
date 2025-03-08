import { createCallerFactory, createTRPCRouter } from "./trpc";
import { formRouter } from "./routers/form";
import { userRouter } from "./routers/user";
import { creditsRouter } from "./routers/credits";
// import all routers here

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  form: formRouter,
  user: userRouter,
  credits: creditsRouter,
  // add routers here
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
