import toposort from "toposort"
import type { Connection, Node } from "@/generated/prisma"

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {
    // if no connections, return nodes as it is
    if (connections.length === 0) return nodes;

    // Create the edges array for toposort
    const edges: [string, string][] = connections.map((connection) => [connection.fromNodeId, connection.toNodeId])

    // Add noes with no connections as self-edges to ensure they're included
    const connectedNodeIds = new Set<string>();
    for (const connection of connections) {
        connectedNodeIds.add(connection.fromNodeId);
        connectedNodeIds.add(connection.toNodeId);
    }
    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);

        // Remove duplicates (from self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        // If there's a cycle, throw an error
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle");
        }
        throw error;
    }

    // Map sorted node IDs back to nodes
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
}