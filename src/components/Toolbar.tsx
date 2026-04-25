import type { NodeType } from "../workflow/types";

type ToolbarProps = {
  onAddNode: (type: NodeType) => void;
  onExecute: () => void;
};

export function Toolbar({ onAddNode, onExecute }: ToolbarProps) {
  return (
    <header className="toolbar">
      <div>
        <h1>Minimal Workflow Builder</h1>
        <p>Click one node, then another to create a connection.</p>
      </div>

      <div className="toolbar-actions">
        <button type="button" onClick={() => onAddNode("log")}>
          Add Log Node
        </button>
        <button type="button" onClick={() => onAddNode("color")}>
          Add Color Node
        </button>
        <button type="button" className="primary" onClick={onExecute}>
          Execute
        </button>
      </div>
    </header>
  );
}
