import { useMemo, useState, type DragEvent, type MouseEvent } from "react";
import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { CanvasEdges } from "./components/CanvasEdges";
import { WorkflowNodeCard } from "./components/WorkflowNodeCard";
import { NodeSidebar, DRAG_NODE_TYPE_KEY } from "./components/NodeSidebar";
import {
  type Edge,
  type NodeType,
  type WorkflowNode,
  initialNodes,
} from "./workflow/types";
import { executeWorkflow } from "./workflow/executeWorkflow";

function App() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const nodeMap = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );

  const createNode = (type: NodeType, x: number, y: number): WorkflowNode => ({
    id: crypto.randomUUID(),
    type,
    x,
    y,
    text:
      type === "log"
        ? "New log message"
        : type === "color"
          ? "New styled message"
          : "",
    color: type === "color" ? "#22c55e" : "#94a3b8",
  });

  const hasStartNode = useMemo(
    () => nodes.some((node) => node.type === "start"),
    [nodes],
  );

  const addNode = (type: NodeType) => {
    setNodes((current) => {
      if (type === "start" && current.some((node) => node.type === "start")) {
        return current;
      }

      return [
        ...current,
        createNode(type, 80 + current.length * 24, 80 + current.length * 24),
      ];
    });
  };

  const addNodeAt = (type: NodeType, x: number, y: number) => {
    setNodes((current) => {
      if (type === "start" && current.some((node) => node.type === "start")) {
        return current;
      }

      return [...current, createNode(type, x, y)];
    });
  };

  const removeNode = (id: string) => {
    setNodes((current) => current.filter((node) => node.id !== id));
    setEdges((current) =>
      current.filter((edge) => edge.from !== id && edge.to !== id),
    );
    setSelectedSource((current) => (current === id ? null : current));
    setDraggingId((current) => (current === id ? null : current));
  };

  const updateNode = (id: string, patch: Partial<WorkflowNode>) => {
    setNodes((current) =>
      current.map((node) => (node.id === id ? { ...node, ...patch } : node)),
    );
  };

  const connectNodes = (from: string, to: string) => {
    if (from === to) return;
    setEdges((current) => {
      if (current.some((edge) => edge.from === from && edge.to === to)) {
        return current;
      }
      return [...current, { from, to }];
    });
  };

  const removeEdge = (from: string, to: string) => {
    setEdges((current) =>
      current.filter((edge) => !(edge.from === from && edge.to === to)),
    );
  };

  const handleExecute = () => {
    executeWorkflow(nodes, edges);
  };

  const handlePointerDown = (
    event: MouseEvent<HTMLDivElement>,
    node: WorkflowNode,
  ) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setDraggingId(node.id);
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleCanvasClick = () => {
    setSelectedSource(null);
  };

  const handleNodeClick = (node: WorkflowNode) => {
    if (selectedSource && selectedSource !== node.id) {
      connectNodes(selectedSource, node.id);
      setSelectedSource(null);
      return;
    }
    setSelectedSource(node.id);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - dragOffset.x;
    const y = event.clientY - rect.top - dragOffset.y;

    updateNode(draggingId, { x: Math.max(0, x), y: Math.max(0, y) });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleCanvasDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();

    const droppedType = event.dataTransfer.getData(
      DRAG_NODE_TYPE_KEY,
    ) as NodeType;
    if (
      droppedType !== "start" &&
      droppedType !== "log" &&
      droppedType !== "color"
    ) {
      return;
    }

    if (droppedType === "start" && hasStartNode) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left - 110);
    const y = Math.max(0, event.clientY - rect.top - 70);

    addNodeAt(droppedType, x, y);
  };

  return (
    <div className="app">
      <Toolbar onAddNode={addNode} onExecute={handleExecute} />

      <div className="workspace">
        <NodeSidebar hasStartNode={hasStartNode} />

        <main
          className="canvas"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
        >
          <CanvasEdges
            edges={edges}
            nodeMap={nodeMap}
            onRemoveEdge={removeEdge}
          />

          {nodes.map((node) => (
            <WorkflowNodeCard
              key={node.id}
              node={node}
              selected={selectedSource === node.id}
              onNodeClick={handleNodeClick}
              onPointerDown={handlePointerDown}
              onUpdateNode={updateNode}
              onStartLink={setSelectedSource}
              onDeleteNode={removeNode}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
