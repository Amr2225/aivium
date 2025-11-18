import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import prisma from '@/lib/db';

export const appRouter = createTRPCRouter({
    getUsers: baseProcedure
        .query(() => {
            return prisma.user.findMany({ include: { posts: true } });
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;