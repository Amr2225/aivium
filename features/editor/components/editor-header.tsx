"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { editorStore } from "../store/atoms";
import { useAtomValue } from "jotai";

const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/workflows' prefetch>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='mt-1' />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflowName = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name.trim() === workflow.name) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    try {
      await updateWorkflowName.mutateAsync({
        id: workflowId,
        name: name.trim(),
      });
    } catch (error) {
      setName(workflow.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className='w-auto min-[100px] h-7 px-2'
        disabled={updateWorkflowName.isPending}
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => !updateWorkflowName.isPending && setIsEditing(true)}
      className='cursor-pointer hover:text-foreground transition-colors'
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorStore);
  const saveWorkflow = useUpdateWorkflow();

  // shortcut for saving ctrl+s
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  const handleSave = async () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  };

  return (
    <div className='ml-auto'>
      <Button size='sm' onClick={handleSave} disabled={saveWorkflow.isPending}>
        <SaveIcon className='size-4' />
        Save
      </Button>
    </div>
  );
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className='flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background'>
      <SidebarTrigger />

      <div className='flex items-center justify-between gap-x-4 w-full'>
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};
