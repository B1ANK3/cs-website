/**
 * Character Behavior Definitions
 * Defines behavior patterns like random walks, turn timing, and dialog display
 */

import type { BehaviorConfig } from './types';

/**
 * Default behavior configuration
 */
export const DEFAULT_BEHAVIOR_CONFIG: BehaviorConfig = {
  randomWalkInterval: 5000, // 5 seconds before picking new random node
  turnAndTalkChance: 0.3, // 30% chance to turn and talk during idle
  talkDuration: 4000, // 4 seconds to display dialog
  idleVariationChance: 0.5, // 50% chance for animation variation
  movementSpeed: 100, // pixels per second
};

/**
 * Create a behavior config with custom overrides
 */
export function createBehaviorConfig(overrides: Partial<BehaviorConfig> = {}): BehaviorConfig {
  return {
    ...DEFAULT_BEHAVIOR_CONFIG,
    ...overrides,
  };
}

/**
 * Behavior pattern for idle state
 */
export class IdleBehavior {
  private idleStartTime: number = 0;
  private isIdle: boolean = false;

  public startIdle(): void {
    this.idleStartTime = Date.now();
    this.isIdle = true;
  }

  public endIdle(): void {
    this.isIdle = false;
  }

  public getIdleDuration(): number {
    if (!this.isIdle) return 0;
    return Date.now() - this.idleStartTime;
  }

  public isCurrentlyIdle(): boolean {
    return this.isIdle;
  }
}

/**
 * Behavior pattern for walking
 */
export class WalkingBehavior {
  private walkStartTime: number = 0;
  private isWalking: boolean = false;
  private walkDistance: number = 0;

  public startWalk(): void {
    this.walkStartTime = Date.now();
    this.isWalking = true;
  }

  public endWalk(): void {
    this.isWalking = false;
  }

  public updateWalkDistance(distance: number): void {
    this.walkDistance = distance;
  }

  public getWalkDuration(): number {
    if (!this.isWalking) return 0;
    return Date.now() - this.walkStartTime;
  }

  public isCurrentlyWalking(): boolean {
    return this.isWalking;
  }

  public getWalkDistance(): number {
    return this.walkDistance;
  }
}

/**
 * Behavior pattern for talking/dialog
 */
export class TalkingBehavior {
  private talkStartTime: number = 0;
  private isTalking: boolean = false;
  private maxTalkDuration: number = 0;

  public startTalk(duration: number): void {
    this.talkStartTime = Date.now();
    this.isTalking = true;
    this.maxTalkDuration = duration;
  }

  public endTalk(): void {
    this.isTalking = false;
  }

  public getTalkDuration(): number {
    if (!this.isTalking) return 0;
    return Date.now() - this.talkStartTime;
  }

  public isCurrentlyTalking(): boolean {
    return this.isTalking;
  }

  public shouldStopTalking(): boolean {
    return this.isTalking && this.getTalkDuration() >= this.maxTalkDuration;
  }

  public getTalkProgressNormalized(): number {
    const duration = this.getTalkDuration();
    return Math.min(1, duration / this.maxTalkDuration);
  }
}

/**
 * Random walk behavior generator
 */
export class RandomWalkBehavior {
  private lastWalkTime: number = 0;
  private walkInterval: number;

  constructor(interval: number = DEFAULT_BEHAVIOR_CONFIG.randomWalkInterval) {
    this.walkInterval = interval;
    this.lastWalkTime = Date.now();
  }

  public shouldPickNewTarget(): boolean {
    const elapsed = Date.now() - this.lastWalkTime;
    return elapsed >= this.walkInterval;
  }

  public resetTimer(): void {
    this.lastWalkTime = Date.now();
  }

  public getElapsedSinceLastWalk(): number {
    return Date.now() - this.lastWalkTime;
  }

  public setInterval(interval: number): void {
    this.walkInterval = interval;
  }
}

/**
 * Helper to determine if character should talk based on behavior config
 */
export function shouldCharacterTalk(chance: number): boolean {
  return Math.random() < chance;
}

/**
 * Helper to pick a random element from an array
 */
export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Easing function for smooth path interpolation
 */
export function easeLinear(t: number): number {
  return t;
}

/**
 * Easing function - ease in/out quad
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Ease function selector
 */
export function getEaseFunction(type: 'linear' | 'inOutQuad' = 'linear') {
  return type === 'inOutQuad' ? easeInOutQuad : easeLinear;
}
