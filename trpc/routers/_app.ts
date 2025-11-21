import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import prisma from '@/lib/db';

export const appRouter = createTRPCRouter({
    getUsers: protectedProcedure
        .query(({ ctx }) => {
            console.log(ctx.auth.user.email);
            return prisma.user.findMany({
                where: {
                    id: ctx.auth.user.id,
                },
            });
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;