import { NodeType } from "@/lib/generated/prisma/enums";
import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-request/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
}

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
    const executer = executorRegistry[nodeType];
    if (!executer) throw new NonRetriableError(`No executor found for node type: ${nodeType}`);

    return executer;
}