import type { MouseEvent } from "react";
import type { WorkflowNode } from "../workflow/types";

type WorkflowNodeCardProps = {
  node: WorkflowNode;
  selected: boolean;
  onNodeClick: (node: WorkflowNode) => void;
  onPointerDown: (
    event: MouseEvent<HTMLDivElement>,
    node: WorkflowNode,
  ) => void;
  onUpdateNode: (id: string, patch: Partial<WorkflowNode>) => void;
  onStartLink: (id: string) => void;
  onDeleteNode: (id: string) => void;
};

export function WorkflowNodeCard({
  node,
  selected,
  onNodeClick,
  onPointerDown,
  onUpdateNode,
  onStartLink,
  onDeleteNode,
}: WorkflowNodeCardProps) {
  return (
    <div
      className={`node ${selected ? "selected" : ""} ${node.type}`}
      style={{ left: node.x, top: node.y }}
      onClick={(event) => {
        event.stopPropagation();
        onNodeClick(node);
      }}
      onMouseDown={(event) => onPointerDown(event, node)}
    >
      <div className="node-header">
        <strong>
          {node.type === "start"
            ? "Start Node"
            : node.type === "log"
              ? "Log Node"
              : "Color Node"}
        </strong>
        <span className="node-id">{node.id.slice(0, 4)}</span>
      </div>

      {node.type !== "start" && (
        <label>
          Text
          <input
            value={node.text}
            onChange={(event) =>
              onUpdateNode(node.id, { text: event.target.value })
            }
            onClick={(event) => event.stopPropagation()}
          />
        </label>
      )}

      {node.type === "color" && (
        <label>
          Color
          <input
            type="color"
            value={node.color}
            onChange={(event) =>
              onUpdateNode(node.id, { color: event.target.value })
            }
            onClick={(event) => event.stopPropagation()}
          />
        </label>
      )}

      <div className="node-footer">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStartLink(node.id);
          }}
        >
          Start link
        </button>

        <button
          type="button"
          className="danger"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteNode(node.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
