"use client";
import { PlusIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/node-selector";

export const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      const isTyping =
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
      const isDialogOpen = document.querySelector('[role="dialog"]');

      if (event.key === "Escape" && open) setOpen(false);
      else if (event.key === "Tab" && !isTyping && !isDialogOpen) setOpen(true);
    };

    window.addEventListener("keydown", keyDownListener);
    return () => window.removeEventListener("keydown", keyDownListener);
  }, []);

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button variant='outline' size='icon' className='bg-background'>
        <PlusIcon className='size-4' />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
