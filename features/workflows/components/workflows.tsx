"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export default function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return (
    <div>
      <div>
        <h1>Workflows</h1>
      </div>
      <div>
        {workflows.data.map((workflow) => (
          <div key={workflow.id}>{workflow.name}</div>
        ))}
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
      onError: (error) => {
        handleError(error);
      },
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
    <EntityContainer header={<WorkflowsHeader />} search={<></>} pagination={<></>}>
      {children}
    </EntityContainer>
  );
};
