"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/lib/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { dataTagErrorSymbol } from "@tanstack/react-query";

export default function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  );
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: handleError, // Props will be automatically passed to the handleError function
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title='Workflows'
        description='Manage your workflows'
        onNew={handleCreateWorkflow}
        newButtonLabel='New Workflow'
        disabled={disabled}
        isCreateing={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return (
    <EntitySearch value={searchValue} onChange={onSearchChange} placeholder='Search workflows' />
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching || workflows.isLoading}
      page={params.page}
      totalPages={workflows.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView message='Loading workflows...' />;
};

export const WorkflowsError = () => {
  return <ErrorView message='Error loading workflows...' />;
};

const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onError: handleError, // Props will be automatically passed to the handleError function
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        message="You haven't created any workflows yet. Get started by creating your first workflow"
        onNew={handleCreateWorkflow}
      />
    </>
  );
};

const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemoveWorkflow = async () => {
    await removeWorkflow.mutateAsync({ id: workflow.id });
  };

  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })} &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className='size-8 flex items-center justify-center'>
          <WorkflowIcon className='size-5 text-muted-foreground' />
        </div>
      }
      onRemove={handleRemoveWorkflow}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
