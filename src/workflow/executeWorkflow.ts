import type { Edge, WorkflowNode } from "./types";

export function executeWorkflow(nodes: WorkflowNode[], edges: Edge[]) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const incoming = new Map<string, number>();

  nodes.forEach((node) => incoming.set(node.id, 0));
  edges.forEach((edge) => {
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  });

  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    const list = adjacency.get(edge.from) ?? [];
    list.push(edge.to);
    adjacency.set(edge.from, list);
  });

  const explicitStartNodes = nodes.filter((node) => node.type === "start");
  const entryNodes =
    explicitStartNodes.length > 0
      ? explicitStartNodes
      : nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0);

  const visited = new Set<string>();

  const runNode = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return;

    if (node.type === "log") {
      console.log(node.text);
    } else if (node.type === "color") {
      console.log(`%c${node.text}`, `color: ${node.color}`);
    }
    // start node is intentionally "empty" and only forwards flow

    (adjacency.get(nodeId) ?? []).forEach(runNode);
  };

  entryNodes.forEach((node) => runNode(node.id));
}
