# Minimal Visual Workflow Builder (n8n-like)

## Objective
Build a minimal web-based workflow editor inspired by n8n that allows users to visually create and execute simple node-based flows.

---

## Core Features

### 1. Canvas / Editor
- Provide a visual canvas where users can:
  - Drag and drop nodes
  - Position nodes freely
  - Connect nodes with directional edges (from one node to another)

---

### 2. Node Types

#### Log Node
- **Inputs:**
  - Text input field
- **Behavior:**
  - Outputs the text to the browser console using:
    ```js
    console.log(text);
    ```

---

#### Color Node
- **Inputs:**
  - Text input field
  - Color picker (hex or RGB)
- **Behavior:**
  - Outputs styled text to the browser console using:
    ```js
    console.log(`%c${text}`, `color: ${color}`);
    ```

---

### 3. Connections
- Users can:
  - Connect nodes visually
  - Define execution flow using directed edges (A → B)

---

### 4. Execution Engine
- Provide an **"Execute" button**
- On click:
  1. Identify start nodes (nodes with no incoming edges)
  2. Traverse the graph (DFS or BFS)
  3. Execute each node once

#### Execution Rules
- **Log Node →**
  ```js
  console.log(text);