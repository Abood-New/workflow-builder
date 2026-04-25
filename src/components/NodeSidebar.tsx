import type { NodeType } from "../workflow/types";

export const DRAG_NODE_TYPE_KEY = "application/x-workflow-node-type";

type NodeSidebarProps = {
  nodeTypes?: NodeType[];
  hasStartNode?: boolean;
};

export function NodeSidebar({
  nodeTypes = ["start", "log", "color"],
  hasStartNode = false,
}: NodeSidebarProps) {
  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    type: NodeType,
  ) => {
    if (type === "start" && hasStartNode) return;
    event.dataTransfer.setData(DRAG_NODE_TYPE_KEY, type);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside className="node-sidebar">
      <h3>Nodes</h3>
      <p>Drag to canvas</p>

      <div className="node-sidebar-list">
        {nodeTypes.map((type) => {
          const startDisabled = type === "start" && hasStartNode;

          return (
            <button
              key={type}
              type="button"
              className="node-sidebar-item"
              draggable={!startDisabled}
              disabled={startDisabled}
              onDragStart={(event) => handleDragStart(event, type)}
              title={
                startDisabled ? "Only one Start node is allowed" : undefined
              }
            >
              {type === "start"
                ? "Start Node"
                : type === "log"
                  ? "Log Node"
                  : "Color Node"}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
