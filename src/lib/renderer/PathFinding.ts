/**
 * A* Pathfinding Implementation
 * Finds shortest paths between nodes in the scene graph
 */

import type { PathNode } from './types';

/**
 * Node with A* data for pathfinding
 */
interface PathfindingNode extends PathNode {
    gCost: number; // Cost from start
    hCost: number; // Heuristic cost to goal
    fCost: number; // Total cost (g + h)
    parent: PathfindingNode | null;
}

export class PathFinding {
    private nodes: Map<string | number, PathNode>;

    constructor(nodeGraph: PathNode[]) {
        this.nodes = new Map();
        for (const node of nodeGraph) {
            this.nodes.set(node.id, node);
        }
    }

    /**
     * Calculate heuristic distance (Euclidean)
     */
    private heuristic(from: PathNode, to: PathNode): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate distance between two nodes
     */
    private distance(from: PathNode, to: PathNode): number {
        return this.heuristic(from, to);
    }

    /**
     * Find path from start to goal node using A*
     */
    public findPath(startId: string | number, goalId: string | number): (string | number)[] {
        const startNode = this.nodes.get(startId);
        const goalNode = this.nodes.get(goalId);

        if (!startNode || !goalNode) {
            return [];
        }

        if (startId === goalId) {
            return [startId];
        }

        // Initialize open/closed sets
        const openSet: Map<string | number, PathfindingNode> = new Map();
        const closedSet: Set<string | number> = new Set();

        // Create pathfinding nodes
        const pfNodes = new Map<string | number, PathfindingNode>();
        for (const [id, node] of this.nodes) {
            const pfNode: PathfindingNode = {
                ...node,
                gCost: Infinity,
                hCost: 0,
                fCost: Infinity,
                parent: null
            };
            pfNodes.set(id, pfNode);
        }

        // Initialize start node
        const startPF = pfNodes.get(startId)!;
        startPF.gCost = 0;
        startPF.hCost = this.heuristic(startNode, goalNode);
        startPF.fCost = startPF.hCost;
        openSet.set(startId, startPF);

        while (openSet.size > 0) {
            // Find node with lowest f cost
            let current: [string | number, PathfindingNode] | null = null;
            let lowestF = Infinity;

            for (const [id, node] of openSet) {
                if (node.fCost < lowestF) {
                    lowestF = node.fCost;
                    current = [id, node];
                }
            }

            if (!current) break;

            const [currentId, currentNode] = current;

            if (currentId === goalId) {
                // Reconstruct path
                return this.reconstructPath(pfNodes, goalId);
            }

            openSet.delete(currentId);
            closedSet.add(currentId);

            // Check neighbors
            const neighbors = currentNode.connections;
            for (const neighborId of neighbors) {
                if (closedSet.has(neighborId)) continue;

                const neighborNode = pfNodes.get(neighborId);
                if (!neighborNode) continue;

                const nodeFrom = this.nodes.get(currentId)!;
                const nodeTo = this.nodes.get(neighborId)!;
                const tentativeG = currentNode.gCost + this.distance(nodeFrom, nodeTo);

                if (tentativeG < neighborNode.gCost) {
                    neighborNode.parent = currentNode;
                    neighborNode.gCost = tentativeG;
                    neighborNode.hCost = this.heuristic(nodeTo, goalNode);
                    neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;

                    if (!openSet.has(neighborId)) {
                        openSet.set(neighborId, neighborNode);
                    }
                }
            }
        }

        // No path found
        return [];
    }

    /**
     * Reconstruct path from parent pointers
     */
    private reconstructPath(
        nodes: Map<string | number, PathfindingNode>,
        goalId: string | number
    ): (string | number)[] {
        const path: (string | number)[] = [];
        let current: PathfindingNode | null = nodes.get(goalId) || null;

        while (current) {
            path.unshift(current.id);
            current = current.parent;
        }

        return path;
    }

    /**
     * Get all connected nodes
     */
    public getConnectedNodes(nodeId: string | number): PathNode[] {
        const node = this.nodes.get(nodeId);
        if (!node) return [];

        return node.connections.map((id) => this.nodes.get(id)).filter((n): n is PathNode => !!n);
    }

    /**
     * Get a random connected node
     */
    public getRandomConnectedNode(nodeId: string | number): PathNode | undefined {
        const connected = this.getConnectedNodes(nodeId);
        if (connected.length === 0) return undefined;
        return connected[Math.floor(Math.random() * connected.length)];
    }

    /**
     * Get all nodes in the graph
     */
    public getAllNodes(): PathNode[] {
        return Array.from(this.nodes.values());
    }

    /**
     * Get a random node
     */
    public getRandomNode(): PathNode | undefined {
        const nodes = this.getAllNodes();
        if (nodes.length === 0) return undefined;
        return nodes[Math.floor(Math.random() * nodes.length)];
    }

    /**
     * Update node graph
     */
    public setNodes(nodeGraph: PathNode[]): void {
        this.nodes.clear();
        for (const node of nodeGraph) {
            this.nodes.set(node.id, node);
        }
    }
}
