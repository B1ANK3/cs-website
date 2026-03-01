/**
 * Generic State Machine Implementation
 * Manages character state transitions, enter/exit hooks, and update loops
 */

import type { CharacterStateType, State } from './types';

export class StateMachine {
  private states: Map<CharacterStateType, State>;
  private currentState: CharacterStateType;
  private previousState: CharacterStateType | null = null;

  constructor(initialState: CharacterStateType, states: Map<CharacterStateType, State>) {
    this.states = states;
    this.currentState = initialState;
    this.enterState(initialState);
  }

  /**
   * Transition to a new state
   */
  public transition(newState: CharacterStateType): boolean {
    if (!this.states.has(newState)) {
      console.warn(`State '${newState}' does not exist`);
      return false;
    }

    if (newState === this.currentState) {
      return false; // Already in this state
    }

    this.exitState(this.currentState);
    this.previousState = this.currentState;
    this.currentState = newState;
    this.enterState(newState);

    return true;
  }

  /**
   * Get current state
   */
  public getCurrentState(): CharacterStateType {
    return this.currentState;
  }

  /**
   * Get previous state
   */
  public getPreviousState(): CharacterStateType | null {
    return this.previousState;
  }

  /**
   * Update the current state
   */
  public update(deltaTime: number): void {
    const state = this.states.get(this.currentState);
    if (state?.onUpdate) {
      state.onUpdate(deltaTime);
    }
  }

  /**
   * Call enter hook for a state
   */
  private enterState(state: CharacterStateType): void {
    const stateObj = this.states.get(state);
    if (stateObj?.onEnter) {
      stateObj.onEnter();
    }
  }

  /**
   * Call exit hook for a state
   */
  private exitState(state: CharacterStateType): void {
    const stateObj = this.states.get(state);
    if (stateObj?.onExit) {
      stateObj.onExit();
    }
  }

  /**
   * Check if in a specific state
   */
  public isInState(state: CharacterStateType): boolean {
    return this.currentState === state;
  }

  /**
   * Check if was in a specific state
   */
  public wasInState(state: CharacterStateType): boolean {
    return this.previousState === state;
  }
}
