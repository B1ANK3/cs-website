/**
 * Character Entity Class
 * Combines Transform, Sprite, StateMachine, PathFollower, and Dialog components
 */

import { StateMachine } from './StateMachine';
import {
    IdleBehavior,
    WalkingBehavior,
    TalkingBehavior,
    RandomWalkBehavior,
    TurnAndTalkBehavior
} from './CharacterBehaviors';
import type {
    CharacterEntity,
    // Transform,
    // Sprite,
    // DialogBubbleState,
    BehaviorConfig,
    PathNode,
    CharacterStateType,
    State,
    DialogContent,
    SpriteSheetData
} from './types';
import type { PathFinding } from './PathFinding';

export class Character {
    private entity: CharacterEntity;
    private stateMachine: StateMachine;
    private pathFinding: PathFinding;
    private idleBehavior: IdleBehavior;
    private walkingBehavior: WalkingBehavior;
    private talkingBehavior: TalkingBehavior;
    private randomWalkBehavior: RandomWalkBehavior;
    private turnAndTalkBehavior: TurnAndTalkBehavior;

    constructor(
        id: string,
        initialNode: PathNode,
        spriteData: SpriteSheetData,
        behaviorConfig: BehaviorConfig,
        pathFinding: PathFinding
    ) {
        this.pathFinding = pathFinding;
        this.idleBehavior = new IdleBehavior();
        this.walkingBehavior = new WalkingBehavior();
        this.talkingBehavior = new TalkingBehavior();
        this.randomWalkBehavior = new RandomWalkBehavior(behaviorConfig.randomWalkInterval);
        this.turnAndTalkBehavior = new TurnAndTalkBehavior(behaviorConfig.turnAndTalkChance);

        // Initialize entity
        this.entity = {
            id,
            transform: {
                x: initialNode.x,
                y: initialNode.y,
                direction: 'S',
                scale: 1
            },
            sprite: {
                spriteSheetData: spriteData,
                currentAnimation: 'idle',
                currentFrame: 0,
                frameElapsedTime: 0
            },
            stateMachine: 'idle',
            pathData: {
                nodes: [],
                currentNodeIndex: 0,
                currentNodeId: initialNode.id,
                targetNodeIndex: 0,
                progress: 0
            },
            dialogBubble: {
                isVisible: false,
                content: null,
                displayTime: 0,
                maxDisplayTime: behaviorConfig.talkDuration
            },
            behavior: behaviorConfig,
            stateEnterTime: Date.now(),
            randomWalkTimer: 0,
            isActive: true
        };

        // Setup state machine
        const states = new Map<CharacterStateType, State>([
            [
                'idle',
                {
                    name: 'idle',
                    onEnter: () => this.onIdleEnter(),
                    onUpdate: (dt) => this.onIdleUpdate(dt),
                    onExit: () => this.onIdleExit()
                }
            ],
            [
                'walking',
                {
                    name: 'walking',
                    onEnter: () => this.onWalkingEnter(),
                    onUpdate: (dt) => this.onWalkingUpdate(dt),
                    onExit: () => this.onWalkingExit()
                }
            ],
            [
                'turning',
                {
                    name: 'turning',
                    onEnter: () => this.onTurningEnter(),
                    onUpdate: (dt) => this.onTurningUpdate(dt),
                    onExit: () => this.onTurningExit()
                }
            ],
            [
                'talking',
                {
                    name: 'talking',
                    onEnter: () => this.onTalkingEnter(),
                    onUpdate: (dt) => this.onTalkingUpdate(dt),
                    onExit: () => this.onTalkingExit()
                }
            ]
        ]);

        this.stateMachine = new StateMachine('idle', states);
    }

    // ===== State Machine Handlers =====

    private onIdleEnter(): void {
        this.entity.sprite.currentAnimation = 'idle';
        this.idleBehavior.startIdle();
        this.entity.stateEnterTime = Date.now();
    }

    // dt parameter can be used in the future but not needed now.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onIdleUpdate(_dt: number): void {
        // Check if character should turn and talk (random chance)
        if (this.turnAndTalkBehavior.shouldTurnAndTalk()) {
            this.stateMachine.transition('turning');
            return; // Don't walk if talking
        }

        if (this.randomWalkBehavior.shouldPickNewTarget()) {
            // Pick random adjacent node and walk to it
            const randomNode = this.pathFinding.getRandomConnectedNode(
                this.entity.pathData.currentNodeId
            );

            if (randomNode) {
                this.pathTo(randomNode.id);
                this.stateMachine.transition('walking');
                this.randomWalkBehavior.resetTimer();
            }
        }
    }

    private onIdleExit(): void {
        this.idleBehavior.endIdle();
    }

    private onWalkingEnter(): void {
        this.entity.sprite.currentAnimation = 'walk';
        this.walkingBehavior.startWalk();
        this.entity.stateEnterTime = Date.now();
    }

    private onWalkingUpdate(dt: number): void {
        // Update path following
        if (this.entity.pathData.nodes.length > 0) {
            const speed = this.entity.behavior.movementSpeed;
            const distance = speed * (dt / 1000); // dt is in ms

            // Move along path
            this.moveAlongPath(distance);

            // Check if reached target
            if (this.entity.pathData.currentNodeIndex >= this.entity.pathData.nodes.length - 1) {
                this.stateMachine.transition('idle');
            }
        }
    }

    private onWalkingExit(): void {
        this.walkingBehavior.endWalk();
    }

    private onTurningEnter(): void {
        this.entity.sprite.currentAnimation = 'idle';
        this.entity.transform.direction = 'S'; // Turn to face camera
        this.entity.stateEnterTime = Date.now();
    }

    // dt parameter can be used in the future but not needed now.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onTurningUpdate(_dt: number): void {
        // Simple turn timing - 500ms to complete turn
        const turnDuration = 500;
        const elapsed = Date.now() - this.entity.stateEnterTime;

        if (elapsed > turnDuration) {
            // Start talking
            this.stateMachine.transition('talking');
        }
    }

    private onTurningExit(): void {
        // Nothing special
    }

    private onTalkingEnter(): void {
        this.entity.sprite.currentAnimation = 'talk';
        this.talkingBehavior.startTalk(this.entity.behavior.talkDuration);
        this.entity.dialogBubble.isVisible = true;
        this.entity.stateEnterTime = Date.now();
    }

    private onTalkingUpdate(dt: number): void {
        // Update dialog bubble display time
        this.entity.dialogBubble.displayTime += dt;

        // Hide dialog if duration has expired (but stay in talking state for full duration)
        if (this.entity.dialogBubble.displayTime >= this.entity.dialogBubble.maxDisplayTime) {
            this.entity.dialogBubble.isVisible = false;
        }

        if (this.talkingBehavior.shouldStopTalking()) {
            this.stateMachine.transition('idle');
        }
    }

    private onTalkingExit(): void {
        this.talkingBehavior.endTalk();
        this.entity.dialogBubble.isVisible = false;
        this.entity.dialogBubble.displayTime = 0;
    }

    // ===== Public Methods =====

    /**
     * Update character each frame
     */
    public update(deltaTime: number): void {
        // Update sprite frame
        this.updateSpriteFrame(deltaTime);

        // Update state machine
        this.stateMachine.update(deltaTime);
    }

    /**
     * Set a path to a target node
     */
    public pathTo(targetNodeId: string | number): void {
        const currentId = this.entity.pathData.currentNodeId;

        const path = this.pathFinding.findPath(currentId, targetNodeId);

        if (path.length > 0) {
            this.entity.pathData.nodes = path.map((id) => {
                const allNodes = this.pathFinding.getAllNodes();
                return allNodes.find((n) => n.id === id)!;
            });
            this.entity.pathData.currentNodeIndex = 0;
            this.entity.pathData.currentNodeId = this.entity.pathData.nodes[0]?.id ?? currentId;
            this.entity.pathData.progress = 0;
        }
    }

    /**
     * Display a dialog bubble
     */
    public showDialog(content: DialogContent): void {
        this.entity.dialogBubble.content = content;
        this.entity.dialogBubble.displayTime = 0;

        if (!this.stateMachine.isInState('talking')) {
            this.stateMachine.transition('turning');
        }
    }

    /**
     * Get entity data
     */
    public getEntity(): CharacterEntity {
        return this.entity;
    }

    /**
     * Get current position
     */
    public getPosition(): { x: number; y: number } {
        return { x: this.entity.transform.x, y: this.entity.transform.y };
    }

    /**
     * Get current state
     */
    public getCurrentState(): CharacterStateType {
        return this.stateMachine.getCurrentState();
    }

    // ===== Private Methods =====

    /**
     * Move character along current path
     */
    private moveAlongPath(distance: number): void {
        if (this.entity.pathData.nodes.length === 0) return;

        let remaining = distance;
        const nodes = this.entity.pathData.nodes;

        while (remaining > 0 && this.entity.pathData.currentNodeIndex < nodes.length - 1) {
            const currentNode = nodes[this.entity.pathData.currentNodeIndex];
            const nextNode = nodes[this.entity.pathData.currentNodeIndex + 1];

            const dx = nextNode.x - currentNode.x;
            const dy = nextNode.y - currentNode.y;
            const segmentDistance = Math.sqrt(dx * dx + dy * dy);

            const moveDistance = Math.min(
                remaining,
                segmentDistance * (1 - this.entity.pathData.progress)
            );

            this.entity.pathData.progress += moveDistance / segmentDistance;

            if (this.entity.pathData.progress >= 1) {
                this.entity.pathData.currentNodeIndex++;
                this.entity.pathData.progress = 0;
                this.entity.pathData.currentNodeId =
                    nodes[this.entity.pathData.currentNodeIndex]?.id ??
                    this.entity.pathData.currentNodeId;
                remaining -= moveDistance;
            } else {
                remaining = 0;
            }
        }

        // Update position
        if (this.entity.pathData.currentNodeIndex < nodes.length) {
            const currentNode = nodes[this.entity.pathData.currentNodeIndex];
            const nextNode =
                this.entity.pathData.currentNodeIndex < nodes.length - 1
                    ? nodes[this.entity.pathData.currentNodeIndex + 1]
                    : currentNode;

            const progress = this.entity.pathData.progress;
            this.entity.transform.x = currentNode.x + (nextNode.x - currentNode.x) * progress;
            this.entity.transform.y = currentNode.y + (nextNode.y - currentNode.y) * progress;

            // Update direction based on movement
            this.updateDirectionFromMovement(currentNode, nextNode);
        }
    }

    /**
     * Update character direction based on movement direction
     */
    private updateDirectionFromMovement(from: PathNode, to: PathNode): void {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.entity.transform.direction = dx > 0 ? 'E' : 'W';
        } else {
            this.entity.transform.direction = dy > 0 ? 'S' : 'N';
        }
    }

    /**
     * Update sprite frame for animation
     */
    private updateSpriteFrame(deltaTime: number): void {
        const sprite = this.entity.sprite;
        sprite.frameElapsedTime += deltaTime;

        // Simple frame timing - 200ms per frame
        const frameTime = 200;
        if (sprite.frameElapsedTime > frameTime) {
            sprite.currentFrame = (sprite.currentFrame + 1) % 4; // Assume 4 frames per animation
            sprite.frameElapsedTime = 0;
        }
    }
}
