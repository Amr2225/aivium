"use client";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export default function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return (
    <div>
      <div>
        <h1>Workflows</h1>
      </div>
      <div>
        <pre>{JSON.stringify(workflows.data, null, 2)}</pre>
        {/* {workflows.data.map((workflow) => (
          <div key={workflow.id}>{workflow.name}</div>
        ))} */}
      </div>
    </div>
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
