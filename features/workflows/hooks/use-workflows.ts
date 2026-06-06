import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

/**
 *  Hook to get all workflows
 */
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

/**
 *  Hook to get a workflow
 */
export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
}

/**
 *  Hook to create a workflow
 */
export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }));
}

/**
 *  Hook to remove a workflow
 */
export const useRemoveWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} removed successfully`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }));
        },
    }));
}

/**
 *  Hook to update a workflow name
 */
export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} updated successfully`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }));
        },
        onError: (error) => {
            toast.error(`Failed to update workflow name: ${error.message}`);
        },
    }));
}

/**
 *  Hook to update a workflow
 */
export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.udpate.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow saved successfully`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }));
        },
        onError: (error) => {
            toast.error(`Failed to save workflow: ${error.message}`);
        },
    }));
}

/**
 * Hook to execute a workflow
 */
export const useExecuteWorkflow = () => {
    const trpc = useTRPC();

    return useMutation(trpc.workflows.execute.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} executed successfully`);
        },
        onError: (error) => {
            toast.error(`Failed to execute workflow: ${error.message}`);
        },
    }));
}