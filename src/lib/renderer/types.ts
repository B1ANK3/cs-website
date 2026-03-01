/**
 * Isometric Scene Renderer Types
 * Defines all interfaces for the character-driven isometric scene system
 */

/**
 * Configuration for the isometric renderer scene
 */
export interface SceneConfig {
    canvasWidth: number;
    canvasHeight: number;
    backgroundImage: string;
    debugMode?: boolean;
    characterCount?: number; // Target number of characters (6-10)
}

/**
 * Dialog content to display in character speech bubbles
 */
export interface DialogContent {
    id: string;
    type: 'article' | 'event';
    title: string;
    summary: string;
    url: string;
    date?: string;
}

/**
 * Isometric coordinate system conversion
 */
export interface IsometricCoordinates {
    x: number;
    y: number;
}

/**
 * Screen space coordinates
 */
export interface ScreenCoordinates {
    x: number;
    y: number;
}

/**
 * A node in the pathfinding graph
 */
export interface PathNode {
    id: string | number;
    x: number; // Screen/isometric space X
    y: number; // Screen/isometric space Y
    connections: (string | number)[]; // Array of connected node IDs
    isWaypoint?: boolean; // Mark notable locations (fountain, bench, etc.)
}

/**
 * Character animation frame data
 */
export interface AnimationFrame {
    frameIndex: number;
    duration: number; // Duration in milliseconds
}

/**
 * Character direction (8-directional)
 */
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

/**
 * Character animation type
 */
export type AnimationType = 'idle' | 'walk' | 'talk';

/**
 * Sprite sheet data (exported from Aseprite)
 */
export interface SpriteSheetData {
    meta: {
        image: string;
        width: number;
        height: number;
        frameWidth: number;
        frameHeight: number;
    };
    frames: {
        [key: string]: {
            x: number;
            y: number;
            width: number;
            height: number;
            duration?: number;
        };
    };
}

/**
 * Character state machine states
 */
export type CharacterStateType = 'idle' | 'walking' | 'turning' | 'talking';

/**
 * State for the state machine
 */
export interface State {
    name: CharacterStateType;
    onEnter?: () => void;
    onUpdate?: (deltaTime: number) => void;
    onExit?: () => void;
}

/**
 * State machine for character behavior
 */
export interface StateMachineConfig {
    initialState: CharacterStateType;
    states: Map<CharacterStateType, State>;
}

/**
 * Behavior configuration for character actions
 */
export interface BehaviorConfig {
    randomWalkInterval: number; // Time before picking new random node (ms)
    turnAndTalkChance: number; // Probability (0-1) per idle period
    talkDuration: number; // How long to display dialog (ms)
    idleVariationChance: number; // Chance to play animation variation
    movementSpeed: number; // Pixels per second
}

/**
 * Path data for character movement
 */
export interface PathData {
    nodes: PathNode[];
    currentNodeIndex: number;
    currentNodeId: string | number;
    targetNodeIndex: number;
    progress: number; // 0-1 interpolation along current segment
}

/**
 * Dialog bubble data state
 */
export interface DialogBubbleState {
    isVisible: boolean;
    content: DialogContent | null;
    displayTime: number; // Time displayed so far (ms)
    maxDisplayTime: number; // Max time to show (ms)
}

/**
 * Transform component for positioning
 */
export interface Transform {
    x: number;
    y: number;
    direction: Direction;
    scale: number;
}

/**
 * Sprite component for rendering
 */
export interface Sprite {
    spriteSheetData: SpriteSheetData;
    currentAnimation: AnimationType;
    currentFrame: number;
    frameElapsedTime: number;
}

/**
 * Character entity combining all components
 */
export interface CharacterEntity {
    id: string;
    name?: string;
    transform: Transform;
    sprite: Sprite;
    stateMachine: CharacterStateType;
    pathData: PathData;
    dialogBubble: DialogBubbleState;
    behavior: BehaviorConfig;
    // Time tracking
    stateEnterTime: number;
    randomWalkTimer: number;
    isActive: boolean;
}

/**
 * Debug overlay data
 */
export interface DebugOverlayData {
    enabled: boolean;
    showNodes: boolean;
    showConnections: boolean;
    showCharacterStates: boolean;
    showTargets: boolean;
}
