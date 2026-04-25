# n8n Workflow Editor

A small React + TypeScript app that lets you build and execute simple workflow graphs in the browser.

## What it does

- Renders a canvas-based workflow editor
- Supports three node types:
  - `start` — an empty starting node
  - `log` — prints text to the console
  - `color` — prints colored text to the console
- Lets you drag nodes from the sidebar onto the canvas
- Lets you connect nodes by selecting one node and clicking another
- Lets you delete nodes and edges
- Ensures there is only one `start` node on the canvas
- Executes the workflow from the `start` node path

## Project structure

- `src/App.tsx`
  - main application state
  - handles node/edge creation, drag-and-drop, selection, and execution
- `src/components/Toolbar.tsx`
  - top toolbar for adding nodes and running the workflow
- `src/components/NodeSidebar.tsx`
  - drag source for node types
- `src/components/WorkflowNodeCard.tsx`
  - visual node card rendered on the canvas
  - supports editing node content and deleting nodes
- `src/components/CanvasEdges.tsx`
  - renders edge lines between nodes
  - supports click-to-delete with confirmation
- `src/workflow/types.ts`
  - node and edge TypeScript definitions
  - layout constants and initial node definitions
- `src/workflow/executeWorkflow.ts`
  - traverses the node graph
  - starts execution at `start` nodes
  - prints node output to the browser console

## How it is implemented

- Uses React state hooks in `App.tsx`
  - `nodes`, `edges`, `selectedSource`, `draggingId`, `dragOffset`
- Node creation is centralized via `createNode(...)`
- Drag-and-drop from sidebar is implemented using DOM drag events
- Canvas drop positions are calculated from bounding rectangles
- Node linking is handled by selecting a source node and then clicking a target node
- Edge removal uses a dedicated edge hitbox and a confirmation tooltip
- Workflow execution uses a directed adjacency traversal:
  - start from `start` node(s)
  - log output for `log` nodes
  - log styled output for `color` nodes

## Running locally

```bash
npm install
npm run dev
```

Then open the local development URL shown in the terminal.

## Notes

- A `start` node is required for predictable execution order
- The UI prevents adding more than one `start` node
- Removing a node also removes any connected edges automatically
- The workflow is executed in a depth-first traversal from the start node(s)
