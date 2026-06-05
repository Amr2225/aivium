import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

export const editorStore = atom<ReactFlowInstance | null>(null);