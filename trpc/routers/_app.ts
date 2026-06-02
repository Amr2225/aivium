import { createTRPCRouter } from '@/trpc/init';
import { workflowRouter } from '@/features/workflows/server/router';

export const appRouter = createTRPCRouter({
    workflows: workflowRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;