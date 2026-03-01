import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
    DEFAULT_BEHAVIOR_CONFIG,
    IdleBehavior,
    WalkingBehavior,
    TalkingBehavior,
    RandomWalkBehavior,
    createBehaviorConfig,
    shouldCharacterTalk,
    pickRandom,
    easeLinear,
    easeInOutQuad,
    getEaseFunction
} from './CharacterBehaviors';

/**
 * @fileoverview Unit specification for CharacterBehaviors.
 *
 * Spec goals:
 * - Validate behavior config merging and defaults.
 * - Validate time-based behavior transitions with fake timers.
 * - Validate helper utilities (random/easing) deterministically.
 */

describe('CharacterBehaviors', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-01T00:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('creates config with defaults and overrides', () => {
        const config = createBehaviorConfig({ movementSpeed: 200, talkDuration: 1500 });

        expect(config.randomWalkInterval).toBe(DEFAULT_BEHAVIOR_CONFIG.randomWalkInterval);
        expect(config.movementSpeed).toBe(200);
        expect(config.talkDuration).toBe(1500);
    });

    it('tracks idle duration while idle', () => {
        const idle = new IdleBehavior();

        idle.startIdle();
        vi.advanceTimersByTime(750);

        expect(idle.isCurrentlyIdle()).toBe(true);
        expect(idle.getIdleDuration()).toBe(750);

        idle.endIdle();
        expect(idle.getIdleDuration()).toBe(0);
    });

    it('tracks walking status, duration, and distance', () => {
        const walking = new WalkingBehavior();

        walking.startWalk();
        walking.updateWalkDistance(42);
        vi.advanceTimersByTime(300);

        expect(walking.isCurrentlyWalking()).toBe(true);
        expect(walking.getWalkDuration()).toBe(300);
        expect(walking.getWalkDistance()).toBe(42);

        walking.endWalk();
        expect(walking.getWalkDuration()).toBe(0);
    });

    it('tracks talking progress and stop condition', () => {
        const talking = new TalkingBehavior();

        talking.startTalk(1000);
        vi.advanceTimersByTime(400);

        expect(talking.isCurrentlyTalking()).toBe(true);
        expect(talking.shouldStopTalking()).toBe(false);
        expect(talking.getTalkProgressNormalized()).toBeCloseTo(0.4, 5);

        vi.advanceTimersByTime(600);

        expect(talking.shouldStopTalking()).toBe(true);

        talking.endTalk();
        expect(talking.isCurrentlyTalking()).toBe(false);
    });

    it('triggers random walk based on elapsed interval', () => {
        const randomWalk = new RandomWalkBehavior(500);

        expect(randomWalk.shouldPickNewTarget()).toBe(false);
        vi.advanceTimersByTime(500);
        expect(randomWalk.shouldPickNewTarget()).toBe(true);

        randomWalk.resetTimer();
        expect(randomWalk.shouldPickNewTarget()).toBe(false);

        randomWalk.setInterval(100);
        vi.advanceTimersByTime(100);
        expect(randomWalk.shouldPickNewTarget()).toBe(true);
    });

    it('evaluates talk chance using Math.random', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.2);
        expect(shouldCharacterTalk(0.3)).toBe(true);

        vi.spyOn(Math, 'random').mockReturnValue(0.8);
        expect(shouldCharacterTalk(0.3)).toBe(false);
    });

    it('picks random item and handles empty arrays', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        expect(pickRandom(['x', 'y', 'z'])).toBe('x');
        expect(pickRandom([])).toBeUndefined();
    });

    it('returns easing functions by key', () => {
        expect(easeLinear(0.3)).toBe(0.3);
        expect(easeInOutQuad(0.25)).toBeCloseTo(0.125, 5);
        expect(easeInOutQuad(0.75)).toBeCloseTo(0.875, 5);
        expect(getEaseFunction('linear')(0.6)).toBe(0.6);
        expect(getEaseFunction('inOutQuad')(0.25)).toBeCloseTo(0.125, 5);
    });
});
