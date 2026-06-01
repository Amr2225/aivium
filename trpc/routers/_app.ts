import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';

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
    getWorkflows: protectedProcedure
        .query(() => {
            return prisma.workflow.findMany();
        }),
    createWorkflow: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: "test/hello.world",
            data: {
                email: "amr@gmail.com"
            },
        });

        return { success: true, message: "Workflow created" }
    }),

    testAI: baseProcedure.mutation(async () => {
        await inngest.send({
            name: "execute/ai",
        })

        return { success: true, message: "AI test started" }
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;