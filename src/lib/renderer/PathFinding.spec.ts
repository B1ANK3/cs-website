import { describe, expect, it, vi, afterEach } from 'vitest';
import { PathFinding } from './PathFinding';
import type { PathNode } from './types';

/**
 * @fileoverview Unit specification for PathFinding.
 *
 * Spec goals:
 * - Find shortest path in a connected graph.
 * - Return empty path for invalid or unreachable targets.
 * - Preserve node graph query helpers.
 */

const graph: PathNode[] = [
    { id: 'A', x: 0, y: 0, connections: ['B'] },
    { id: 'B', x: 10, y: 0, connections: ['A', 'C', 'D'] },
    { id: 'C', x: 20, y: 0, connections: ['B', 'E'] },
    { id: 'D', x: 10, y: 10, connections: ['B', 'E'] },
    { id: 'E', x: 20, y: 10, connections: ['C', 'D'] }
];

describe('PathFinding', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('finds a valid path between connected nodes', () => {
        const pathFinding = new PathFinding(graph);
        const path = pathFinding.findPath('A', 'E');

        expect(path[0]).toBe('A');
        expect(path[path.length - 1]).toBe('E');
        expect(path.length).toBeGreaterThanOrEqual(3);
    });

    it('returns start only when start and goal are the same', () => {
        const pathFinding = new PathFinding(graph);

        expect(pathFinding.findPath('C', 'C')).toEqual(['C']);
    });

    it('returns empty path for unknown start or goal id', () => {
        const pathFinding = new PathFinding(graph);

        expect(pathFinding.findPath('Z', 'A')).toEqual([]);
        expect(pathFinding.findPath('A', 'Z')).toEqual([]);
    });

    it('returns empty path when graph is disconnected', () => {
        const disconnected: PathNode[] = [
            { id: 'P', x: 0, y: 0, connections: ['Q'] },
            { id: 'Q', x: 10, y: 0, connections: ['P'] },
            { id: 'R', x: 100, y: 100, connections: [] }
        ];
        const pathFinding = new PathFinding(disconnected);

        expect(pathFinding.findPath('P', 'R')).toEqual([]);
    });

    it('returns connected node objects for a node id', () => {
        const pathFinding = new PathFinding(graph);
        const connected = pathFinding.getConnectedNodes('B');

        expect(connected.map((node) => node.id).sort()).toEqual(['A', 'C', 'D']);
    });

    it('returns empty connected node list for unknown id', () => {
        const pathFinding = new PathFinding(graph);

        expect(pathFinding.getConnectedNodes('unknown')).toEqual([]);
    });

    it('selects random connected node deterministically when random is mocked', () => {
        const pathFinding = new PathFinding(graph);
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const node = pathFinding.getRandomConnectedNode('B');
        expect(node?.id).toBe('A');
    });

    it('returns undefined random connected node when no neighbors exist', () => {
        const isolated: PathNode[] = [{ id: 'solo', x: 0, y: 0, connections: [] }];
        const pathFinding = new PathFinding(isolated);

        expect(pathFinding.getRandomConnectedNode('solo')).toBeUndefined();
    });

    it('updates graph nodes via setNodes', () => {
        const pathFinding = new PathFinding(graph);
        const nextGraph: PathNode[] = [
            { id: 1, x: 0, y: 0, connections: [2] },
            { id: 2, x: 5, y: 5, connections: [1] }
        ];

        pathFinding.setNodes(nextGraph);

        expect(pathFinding.getAllNodes().map((node) => node.id)).toEqual([1, 2]);
        expect(pathFinding.findPath(1, 2)).toEqual([1, 2]);
    });

    it('returns a random node from graph when available', () => {
        const pathFinding = new PathFinding(graph);
        vi.spyOn(Math, 'random').mockReturnValue(0.99);

        const node = pathFinding.getRandomNode();
        expect(node).toBeDefined();
        expect(graph.some((candidate) => candidate.id === node?.id)).toBe(true);
    });
});
