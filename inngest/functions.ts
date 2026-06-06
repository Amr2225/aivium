import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
    { id: "execute-workflow" },
    { event: "workflow/execute.workflow" },
    async ({ event, step }) => {
        const workflowId = event.data.workflowId;
        if (!workflowId) throw new NonRetriableError("Workflow ID is missing");

        const sortedNodes = await step.run("prepare-workflow", async () => {

            try {
                const workflow = await prisma.workflow.findUniqueOrThrow({
                    where: { id: workflowId },
                    include: { nodes: true, connections: true }
                });

                return topologicalSort(workflow.nodes, workflow.connections);
            } catch (error) {
                if (error instanceof Error) {
                    throw new NonRetriableError(`Failed to prepare workflow: ${error.message}`);
                }
                throw error;
            }
        })

        // Initialize the context with any initial data from the trigger
        let context = event.data.initialData || {};

        // Execute each node
        for (const node of sortedNodes) {
            context = await step.run(`execute-node-${node.id}`, async () => {
                try {
                    const executor = getExecutor(node.type as NodeType);
                    return await executor({
                        data: node.data as Record<string, unknown>,
                        nodeId: node.id,
                        context,
                        step
                    });
                } catch (error) {
                    throw new Error(`Node ${node.id} (${node.type}) failed: ${error instanceof Error ? error.message : String(error)}`);
                }
            })
        }

        return {
            workflowId,
            result: context,
        };
    }
);