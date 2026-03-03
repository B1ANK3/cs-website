import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { StateMachine } from './StateMachine';
import type { CharacterStateType, State } from './types';

/**
 * @fileoverview Unit specification for StateMachine.
 *
 * Spec goals:
 * - Enter hook fires for the initial state.
 * - Transition lifecycle executes exit -> enter.
 * - Current/previous state tracking stays consistent.
 */

describe('StateMachine', () => {
    let idleEnter: ReturnType<typeof vi.fn>;
    let idleExit: ReturnType<typeof vi.fn>;
    let idleUpdate: ReturnType<typeof vi.fn>;
    let walkingEnter: ReturnType<typeof vi.fn>;
    let walkingExit: ReturnType<typeof vi.fn>;
    let walkingUpdate: ReturnType<typeof vi.fn>;
    let states: Map<CharacterStateType, State>;

    beforeEach(() => {
        idleEnter = vi.fn();
        idleExit = vi.fn();
        idleUpdate = vi.fn();
        walkingEnter = vi.fn();
        walkingExit = vi.fn();
        walkingUpdate = vi.fn();

        states = new Map<CharacterStateType, State>([
            [
                'idle',
                {
                    name: 'idle',
                    onEnter: idleEnter as () => void,
                    onExit: idleExit as () => void,
                    onUpdate: idleUpdate as (deltaTime: number) => void
                }
            ],
            [
                'walking',
                {
                    name: 'walking',
                    onEnter: walkingEnter as () => void,
                    onExit: walkingExit as () => void,
                    onUpdate: walkingUpdate as (deltaTime: number) => void
                }
            ]
        ]);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('enters initial state on construction', () => {
        const stateMachine = new StateMachine('idle', states);

        expect(stateMachine.getCurrentState()).toBe('idle');
        expect(idleEnter).toHaveBeenCalledTimes(1);
    });

    it('transitions to a different state and runs lifecycle hooks', () => {
        const stateMachine = new StateMachine('idle', states);

        const transitioned = stateMachine.transition('walking');

        expect(transitioned).toBe(true);
        expect(idleExit).toHaveBeenCalledTimes(1);
        expect(walkingEnter).toHaveBeenCalledTimes(1);
        expect(stateMachine.getCurrentState()).toBe('walking');
        expect(stateMachine.getPreviousState()).toBe('idle');
        expect(stateMachine.wasInState('idle')).toBe(true);
    });

    it('does not transition when target state equals current state', () => {
        const stateMachine = new StateMachine('idle', states);

        const transitioned = stateMachine.transition('idle');

        expect(transitioned).toBe(false);
        expect(idleExit).not.toHaveBeenCalled();
        expect(idleEnter).toHaveBeenCalledTimes(1);
    });

    it('returns false and warns when state does not exist', () => {
        const stateMachine = new StateMachine('idle', states);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        const transitioned = stateMachine.transition('turning');

        expect(transitioned).toBe(false);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(stateMachine.getCurrentState()).toBe('idle');
    });

    it('updates the current state only', () => {
        const stateMachine = new StateMachine('idle', states);

        stateMachine.update(16);
        stateMachine.transition('walking');
        stateMachine.update(32);

        expect(idleUpdate).toHaveBeenCalledWith(16);
        expect(walkingUpdate).toHaveBeenCalledWith(32);
    });

    it('reports membership helpers correctly', () => {
        const stateMachine = new StateMachine('idle', states);

        expect(stateMachine.isInState('idle')).toBe(true);
        expect(stateMachine.isInState('walking')).toBe(false);

        stateMachine.transition('walking');

        expect(stateMachine.isInState('walking')).toBe(true);
        expect(stateMachine.wasInState('idle')).toBe(true);
    });
});
