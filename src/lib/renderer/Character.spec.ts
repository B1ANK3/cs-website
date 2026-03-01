import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { Character } from './Character';
import { createBehaviorConfig } from './CharacterBehaviors';
import { PathFinding } from './PathFinding';
import type { DialogContent, PathNode, SpriteSheetData } from './types';

/**
 * @fileoverview Unit specification for Character.
 *
 * Spec goals:
 * - Validate state transitions and timing (turning -> talking -> idle).
 * - Validate path movement and direction updates.
 * - Validate sprite frame timing.
 *
 * Known implementation issues are tracked with BADSTATE / FAILEDTEST comments.
 */

const nodes: PathNode[] = [
    { id: 1, x: 0, y: 0, connections: [2] },
    { id: 2, x: 100, y: 0, connections: [1, 3] },
    { id: 3, x: 200, y: 0, connections: [2] },
    { id: 4, x: 400, y: 400, connections: [3] }
];

const spriteData: SpriteSheetData = {
    meta: {
        image: '/scene/character-spritesheet.png',
        width: 256,
        height: 256,
        frameWidth: 32,
        frameHeight: 32
    },
    frames: {}
};

const dialogContent: DialogContent = {
    id: 'article-hello',
    type: 'article',
    title: 'Hello',
    summary: 'Summary',
    url: '/news/hello',
    date: '2026-03-01'
};

describe('Character', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-01T00:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    function createCharacter(initialNodeId: PathNode['id'] = 1) {
        const pathFinding = new PathFinding(nodes);
        const initialNode = nodes.find((node) => node.id === initialNodeId)!;
        const behavior = createBehaviorConfig({
            randomWalkInterval: 30_000,
            talkDuration: 1000,
            movementSpeed: 100
        });

        return new Character('character-1', initialNode, spriteData, behavior, pathFinding);
    }

    it('initializes at initial node in idle state', () => {
        const character = createCharacter();

        expect(character.getCurrentState()).toBe('idle');
        expect(character.getPosition()).toEqual({ x: 0, y: 0 });
        expect(character.getEntity().sprite.currentAnimation).toBe('idle');
    });

    it('transitions turning -> talking -> idle after showDialog', () => {
        const character = createCharacter();

        character.showDialog(dialogContent);
        expect(character.getCurrentState()).toBe('turning');

        vi.advanceTimersByTime(501);
        character.update(16);

        expect(character.getCurrentState()).toBe('talking');
        expect(character.getEntity().dialogBubble.isVisible).toBe(true);

        vi.advanceTimersByTime(1000);
        character.update(1000);

        expect(character.getCurrentState()).toBe('idle');
        expect(character.getEntity().dialogBubble.isVisible).toBe(false);
    });

    it('walks along path when transitioned into walking', () => {
        const character = createCharacter();
        const pathFinder = (character as unknown as { pathFinding: PathFinding }).pathFinding;
        vi.spyOn(pathFinder, 'getRandomConnectedNode').mockReturnValue(nodes[1]);

        character.update(16);

        expect(character.getCurrentState()).toBe('idle');

        const randomWalkCharacter = new Character(
            'character-2',
            nodes[0],
            spriteData,
            createBehaviorConfig({ randomWalkInterval: 0, movementSpeed: 100 }),
            new PathFinding(nodes)
        );

        randomWalkCharacter.update(16);
        expect(randomWalkCharacter.getCurrentState()).toBe('walking');

        randomWalkCharacter.update(1000);

        const position = randomWalkCharacter.getPosition();
        expect(position.x).toBeGreaterThan(0);
        expect(position.x).toBeLessThanOrEqual(100);
    });

    it('updates direction to east when moving toward larger x', () => {
        const character = createCharacter();
        const randomWalkCharacter = new Character(
            'character-3',
            nodes[0],
            spriteData,
            createBehaviorConfig({ randomWalkInterval: 0, movementSpeed: 100 }),
            new PathFinding(nodes)
        );

        randomWalkCharacter.update(16);
        randomWalkCharacter.update(500);

        expect(character.getEntity().transform.direction).toBeDefined();
        expect(randomWalkCharacter.getEntity().transform.direction).toBe('E');
    });

    it('advances sprite frame roughly every 200ms', () => {
        const character = createCharacter();
        const before = character.getEntity().sprite.currentFrame;

        character.update(201);
        const after = character.getEntity().sprite.currentFrame;

        expect(after).toBe((before + 1) % 4);
    });

    /**
     * FAILEDTEST: path fallback uses hardcoded 1 instead of actual initial node.
     * Expected spec: path origin should follow the character's real current/initial node.
     */
    it.fails('starts pathing from initial node when no prior path exists', () => {
        const character = createCharacter(4);

        character.pathTo('goal');

        expect(character.getEntity().pathData.nodes[0]?.id).toBe('start-alt');
    });

    /**
     * BADSTATE: dialog content is not cleared on talking exit.
     * Expected spec: dialog content should reset when talking finishes to avoid stale content reuse.
     */
    it.fails('clears dialog content after talking ends', () => {
        const character = createCharacter();

        character.showDialog(dialogContent);
        vi.advanceTimersByTime(501);
        character.update(16);
        vi.advanceTimersByTime(1001);
        character.update(1001);

        expect(character.getEntity().dialogBubble.content).toBeNull();
    });
});
