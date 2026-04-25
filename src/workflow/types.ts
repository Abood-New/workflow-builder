export type NodeType = "start" | "log" | "color";

export type WorkflowNode = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  text: string;
  color: string;
};

export type Edge = {
  from: string;
  to: string;
};

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 150;

export const initialNodes: WorkflowNode[] = [
  {
    id: "start-1",
    type: "start",
    x: 80,
    y: 120,
    text: "",
    color: "#94a3b8",
  },
  {
    id: "1",
    type: "log",
    x: 360,
    y: 100,
    text: "Hello from Log Node",
    color: "#2563eb",
  },
  {
    id: "2",
    type: "color",
    x: 680,
    y: 180,
    text: "Styled console text",
    color: "#ef4444",
  },
];
