import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("fetch-video", "5s");
        await step.sleep("generate-transcript", "5s");
        await step.sleep("generate-summary", "5s");
        await step.run("create-workflow", () => {
            return prisma.workflow.create({
                data: {
                    name: "inggest-workflow",
                }
            })
        })


        return { message: `Hello ${event.data.email}!` };
    },
);