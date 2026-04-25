import { useState } from "react";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  type Edge,
  type WorkflowNode,
} from "../workflow/types";

type CanvasEdgesProps = {
  edges: Edge[];
  nodeMap: Map<string, WorkflowNode>;
  onRemoveEdge?: (from: string, to: string) => void;
};

type PendingDelete = {
  from: string;
  to: string;
  x: number;
  y: number;
};

const nodeCenter = (node: WorkflowNode) => ({
  x: node.x + NODE_WIDTH / 2,
  y: node.y + NODE_HEIGHT / 2,
});

export function CanvasEdges({
  edges,
  nodeMap,
  onRemoveEdge,
}: CanvasEdgesProps) {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null,
  );

  return (
    <>
      <svg
        className="edges"
        width="100%"
        height="100%"
        onClick={() => setPendingDelete(null)}
      >
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;

          const a = nodeCenter(from);
          const b = nodeCenter(to);

          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;

          const isPending =
            pendingDelete?.from === edge.from && pendingDelete?.to === edge.to;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className="edge-hitbox"
                onClick={(event) => {
                  event.stopPropagation();
                  setPendingDelete({
                    from: edge.from,
                    to: edge.to,
                    x: midX,
                    y: midY,
                  });
                }}
              />
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={`edge ${isPending ? "edge-pending" : ""}`}
              />
            </g>
          );
        })}
      </svg>

      {pendingDelete && (
        <div
          className="edge-tooltip"
          style={{ left: pendingDelete.x, top: pendingDelete.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <p>Remove link?</p>
          <div className="edge-tooltip-actions">
            <button
              type="button"
              className="danger"
              onClick={() => {
                onRemoveEdge?.(pendingDelete.from, pendingDelete.to);
                setPendingDelete(null);
              }}
            >
              Remove
            </button>
            <button type="button" onClick={() => setPendingDelete(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
