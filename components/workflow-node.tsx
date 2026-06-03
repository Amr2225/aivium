"use client";
import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  name?: string;
  description?: string;
  onDelete?: () => void;
  onSettings?: () => void;
}

export function WorkflowNode({
  children,
  showToolbar = true,
  name,
  description,
  onDelete,
  onSettings,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar position={Position.Top}>
          <Button variant='ghost' size='sm' onClick={onSettings}>
            <SettingsIcon className='size-4' />
          </Button>

          <Button variant='ghost' size='sm' onClick={onDelete}>
            <TrashIcon className='size-4' />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar position={Position.Bottom} isVisible className='max-w-[200px] text-center'>
          <p className='font-medium'>{name}</p>
          {description && <p className='text-muted-foreground text-sm truncate'>{description}</p>}
        </NodeToolbar>
      )}
    </>
  );
}
