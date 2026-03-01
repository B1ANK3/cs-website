<script lang="ts">
    import { Scene } from '$lib/renderer/Scene';
    import { Character } from '$lib/renderer/Character';
    import { DialogBubblePool } from '$lib/renderer/DialogBubble';
    import { DebugRenderer } from '$lib/renderer/DebugRenderer';
    import { createBehaviorConfig, pickRandom } from '$lib/renderer/CharacterBehaviors';
    import type { DialogContent, PathNode } from '$lib/renderer/types';
    import pathNodesData from '$lib/renderer/pathNodes.json';
    import buildingAtlasData from '$lib/assets/eng_building_v4.json';
    import buildingSpriteSheetUrl from '$lib/assets/eng_building_v4.png';
    import { onMount } from 'svelte';

    interface Article {
        title: string;
        summary: string;
        url: string;
        date?: string;
    }

    interface Event {
        title: string;
        summary: string;
        url: string;
        date: string;
    }

    interface PageProps {
        articles: Article[];
        events: Event[];
        names?: string[];
    }

    let { articles = [], events = [], names = [] }: PageProps = $props();

    let containerElement: HTMLElement;
    let canvasElement: HTMLCanvasElement;

    // Reactive state for class instances
    let rendererState = $state({
        scene: null as Scene | null,
        debugRenderer: null as DebugRenderer | null,
        dialogBubblePool: null as DialogBubblePool | null,
        resizeObserver: null as ResizeObserver | null
    });

    let sceneSpriteSheet: HTMLImageElement | null = $state(null);

    type AtlasFrame = {
        filename: string;
        frame: { x: number; y: number; w: number; h: number };
        spriteSourceSize: { x: number; y: number; w: number; h: number };
        sourceSize: { w: number; h: number };
    };

    type PathNodeData = {
        id: number;
        x: number;
        y: number;
        connections: number[];
        isWaypoint?: boolean;
    };

    const SCENE_BASE_WIDTH = 824;
    const SCENE_BASE_HEIGHT = 536;
    const DEBUG_NODES_LAYER = 'DebugNodes';
    const RENDER_LAYER_ORDER = [
        'Foyer floor',
        'Main walk way',
        'Side Walk Right',
        'Wood Walls',
        'Side Walk Left',
        'Stairs Right',
        'Stairs Left',
        DEBUG_NODES_LAYER
    ] as const;
    let characters: Map<string, Character> = $state(new Map());
    let animationFrameId: number | null = $state(null);
    let lastFrameTime: number = $state(Date.now());
    let characterCount: number = $state(6);
    let debugMode: boolean = $state(false);

    const atlasFrames = (buildingAtlasData.frames ?? []) as AtlasFrame[];

    /**
     * Derived combined content from articles and events
     */
    let combinedContent = $derived.by(() => {
        return [
            ...articles.map((a) => ({
                id: `article-${a.title}`,
                type: 'article' as const,
                title: a.title,
                summary: a.summary,
                url: a.url,
                date: a.date
            })),
            ...events.map((e) => ({
                id: `event-${e.title}`,
                type: 'event' as const,
                title: e.title,
                summary: e.summary,
                url: e.url,
                date: e.date
            }))
        ];
    });

    /**
     * Get the appropriate dimensions for the canvas
     */
    function getCanvasDimensions() {
        return { width: SCENE_BASE_WIDTH, height: SCENE_BASE_HEIGHT };
    }

    function findLayerFrame(layerName: string): AtlasFrame | undefined {
        return atlasFrames.find((frame) => frame.filename.includes(`(${layerName})`));
    }

    function loadSceneSpriteSheet(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Failed to load scene spritesheet: ${src}`));
            image.src = src;
        });
    }

    function renderAtlasLayer(
        ctx: CanvasRenderingContext2D,
        layerName: string,
        scaleX: number,
        scaleY: number
    ) {
        if (!sceneSpriteSheet) return;

        const layerFrame = findLayerFrame(layerName);
        if (!layerFrame) return;

        const { frame, spriteSourceSize } = layerFrame;
        ctx.drawImage(
            sceneSpriteSheet,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            spriteSourceSize.x * scaleX,
            spriteSourceSize.y * scaleY,
            frame.w * scaleX,
            frame.h * scaleY
        );
    }

    function renderPathOverlay(ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number) {
        const typedPathNodes = pathNodesData as PathNodeData[];
        const nodeMap = new Map(typedPathNodes.map((node) => [String(node.id), node]));

        ctx.save();
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.35)';
        ctx.lineWidth = 2;

        for (const node of typedPathNodes) {
            for (const connectionId of node.connections) {
                const fromId = String(node.id);
                const toId = String(connectionId);

                if (fromId > toId) continue;

                const connectedNode = nodeMap.get(toId);
                if (!connectedNode) continue;

                ctx.beginPath();
                ctx.moveTo(node.x * scaleX, node.y * scaleY);
                ctx.lineTo(connectedNode.x * scaleX, connectedNode.y * scaleY);
                ctx.stroke();
            }
        }

        for (const node of typedPathNodes) {
            ctx.fillStyle = node.isWaypoint
                ? 'rgba(255, 140, 140, 0.8)'
                : 'rgba(110, 220, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(node.x * scaleX, node.y * scaleY, 4.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function renderSceneLayers() {
        const ctx = rendererState.scene?.getContext();
        const canvas = rendererState.scene?.getCanvas();
        if (!ctx || !canvas || !sceneSpriteSheet) return;

        const scaleX = canvas.width / SCENE_BASE_WIDTH;
        const scaleY = canvas.height / SCENE_BASE_HEIGHT;

        for (const layerName of RENDER_LAYER_ORDER) {
            // Skip debug layers if debug mode is off
            if (layerName === DEBUG_NODES_LAYER && !debugMode) continue;

            renderAtlasLayer(ctx, layerName, scaleX, scaleY);
            if (layerName === DEBUG_NODES_LAYER) {
                renderPathOverlay(ctx, scaleX, scaleY);
            }
        }
    }

    /**
     * Initialize the renderer
     */
    async function initializeRenderer() {
        if (!canvasElement || !containerElement) return;

        try {
            const { width, height } = getCanvasDimensions();

            if (!sceneSpriteSheet) {
                sceneSpriteSheet = await loadSceneSpriteSheet(buildingSpriteSheetUrl);
            }

            rendererState.scene = new Scene({
                canvasWidth: width,
                canvasHeight: height,
                backgroundImage: ''
            });

            await rendererState.scene.initialize(canvasElement);

            if (!rendererState.dialogBubblePool) {
                rendererState.dialogBubblePool = new DialogBubblePool(containerElement);
            }

            rendererState.debugRenderer = new DebugRenderer(canvasElement);
            rendererState.debugRenderer.setPathNodes(pathNodesData as PathNode[]);

            spawnCharacters();

            if (!animationFrameId) {
                animate();
            }
        } catch (error) {
            console.error('Failed to initialize renderer:', error);
        }
    }

    /**
     * Spawn characters in the scene
     */
    function spawnCharacters() {
        if (!rendererState.scene || !rendererState.dialogBubblePool) return;

        const pathFinding = rendererState.scene.getPathFinding();
        const allNodes = pathFinding.getAllNodes() as PathNodeData[];

        // Clear existing characters
        rendererState.debugRenderer?.clear();
        characters.clear();

        const occupiedStartNodes = new Set<number | string>();

        // Spawn new characters
        for (let i = 0; i < characterCount; i++) {
            // Assign name from list or use generic fallback
            const characterName =
                names && names.length > 0 ? names[i % names.length] : `Character ${i + 1}`;
            const characterId = `character-${i}`;

            // Pick a random unoccupied start node
            const availableStartNodes = allNodes.filter((node) => !occupiedStartNodes.has(node.id));
            const startNode = pickRandom(availableStartNodes) || (allNodes[0] as PathNode);
            occupiedStartNodes.add(startNode.id);

            // Create placeholder sprite data (using simple geometry for now)
            const spriteData = {
                meta: {
                    image: '/scene/character-spritesheet.png',
                    width: 256,
                    height: 256,
                    frameWidth: 32,
                    frameHeight: 32
                },
                frames: {}
            };

            // Create character
            const character = new Character(
                characterId,
                startNode,
                spriteData,
                createBehaviorConfig(),
                pathFinding
            );

            // Store character with name metadata
            characters.set(characterId, character);
            // Store name in character entity for display if needed
            character.getEntity().name = characterName;
            rendererState.debugRenderer?.addCharacter(character);

            // Stagger character spawning and pick an unoccupied destination node
            setTimeout(() => {
                const occupiedCurrentNodes = new Set<number | string>();
                characters.forEach((char) => {
                    const nodes = char.getEntity().pathData.nodes;
                    if (nodes.length > 0) {
                        const currentNodeIdx = char.getEntity().pathData.currentNodeIndex;
                        const currentNode = nodes[currentNodeIdx];
                        if (currentNode) {
                            occupiedCurrentNodes.add(currentNode.id);
                        }
                    }
                });

                const availableDestNodes = allNodes.filter(
                    (node) => !occupiedCurrentNodes.has(node.id)
                );
                const destNode = pickRandom(availableDestNodes) || pickRandom(allNodes);
                if (destNode) {
                    character.pathTo(destNode.id);
                }
            }, i * 500);
        }

        // Ensure Map reactivity by reassigning
        characters = characters;
    }

    /**
     * Main animation loop
     */
    function animate() {
        const now = Date.now();
        const deltaTime = now - lastFrameTime;
        lastFrameTime = now;

        if (rendererState.scene) {
            // Get canvas dimensions for positioning
            const canvas = rendererState.scene.getCanvas();
            if (!canvas) return;

            const scaleX = canvas.width / SCENE_BASE_WIDTH;
            const scaleY = canvas.height / SCENE_BASE_HEIGHT;

            // Update all characters
            characters.forEach((character) => {
                character.update(deltaTime);

                // Update dialog bubble position
                if (rendererState.dialogBubblePool) {
                    const entity = character.getEntity();
                    const pos = character.getPosition();

                    // Calculate screen position for dialog bubble (scaled from canvas coordinates)
                    const screenX = pos.x * scaleX;
                    const screenY = pos.y * scaleY;

                    if (entity.dialogBubble.isVisible) {
                        rendererState.dialogBubblePool.setDialogPosition(
                            entity.id,
                            screenX,
                            screenY
                        );
                    } else if (entity.dialogBubble.content) {
                        // Hide dialog if character is no longer in talking state
                        rendererState.dialogBubblePool.hideDialog(entity.id);
                        entity.dialogBubble.content = null;
                    }

                    // Show dialog if transitioning to talking
                    if (
                        character.getCurrentState() === 'talking' &&
                        !entity.dialogBubble.content &&
                        character.getEntity().dialogBubble.content === null
                    ) {
                        const content = pickRandomContent();
                        if (content) {
                            character.showDialog(content);
                            rendererState.dialogBubblePool.showDialog(
                                entity.id,
                                content,
                                screenX,
                                screenY
                            );
                        }
                    }
                }
            });

            // Render scene
            rendererState.scene.render(() => {
                renderSceneLayers();
                renderCharacters();
            });

            // Render debug overlay
            if (rendererState.debugRenderer) {
                rendererState.debugRenderer.render();
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Render all characters
     */
    function renderCharacters() {
        const ctx = rendererState.scene?.getContext();
        if (!ctx) return;

        characters.forEach((character) => {
            const entity = character.getEntity();
            const pos = character.getPosition();

            // Draw placeholder circle for character
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
            ctx.fill();

            // Draw direction indicator
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            const directionLength = 20;
            const directionMap: Record<string, [number, number]> = {
                N: [0, -directionLength],
                NE: [directionLength / Math.sqrt(2), -directionLength / Math.sqrt(2)],
                E: [directionLength, 0],
                SE: [directionLength / Math.sqrt(2), directionLength / Math.sqrt(2)],
                S: [0, directionLength],
                SW: [-directionLength / Math.sqrt(2), directionLength / Math.sqrt(2)],
                W: [-directionLength, 0],
                NW: [-directionLength / Math.sqrt(2), -directionLength / Math.sqrt(2)]
            };
            const [dx, dy] = directionMap[entity.transform.direction] || [0, 0];
            ctx.lineTo(pos.x + dx, pos.y + dy);
            ctx.stroke();

            // Draw character name or ID
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            const displayName = entity.name || entity.id;
            ctx.fillText(displayName, pos.x, pos.y + 28);
        });
    }

    /**
     * Pick random content from articles/events
     */
    function pickRandomContent(): DialogContent | undefined {
        return pickRandom(combinedContent);
    }

    /**
     * Handle keyboard input
     */
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key.toLowerCase() === 'd' || event.key.toLowerCase() === 'D') {
            debugMode = !debugMode;
            if (rendererState.debugRenderer) {
                rendererState.debugRenderer.toggleDebugMode();
            }
        }
    }

    /**
     * Handle container resize
     */
    function handleContainerResize() {
        if (!containerElement || !canvasElement || !rendererState.scene) return;

        const { width, height } = getCanvasDimensions();

        // Only reinitialize if dimensions actually changed
        const currentConfig = rendererState.scene.getConfig();
        if (currentConfig.canvasWidth !== width || currentConfig.canvasHeight !== height) {
            // Destroy and reinitialize to handle new dimensions
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            rendererState.scene.destroy();
            rendererState.scene = null;
            characters.clear();
            rendererState.debugRenderer?.clear();

            initializeRenderer();
        }
    }

    /**
     * Handle window resize (fallback for when ResizeObserver isn't available)
     */
    function handleWindowResize() {
        handleContainerResize();
    }

    /**
     * Setup lifecycle and event listeners on mount
     */
    onMount(() => {
        // Initialize renderer when component mounts
        if (canvasElement && containerElement) {
            initializeRenderer();
        }

        // Setup event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleWindowResize);

        // Use ResizeObserver for container-specific resize detection
        if (containerElement && typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(() => {
                handleContainerResize();
            });
            observer.observe(containerElement);
            rendererState.resizeObserver = observer;
        }

        // Cleanup function - runs on client side only
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleWindowResize);
            if (rendererState.resizeObserver) {
                rendererState.resizeObserver.disconnect();
                rendererState.resizeObserver = null;
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            rendererState.dialogBubblePool?.destroy();
            rendererState.debugRenderer?.clear();
            rendererState.scene?.destroy();
            characters.clear();
        };
    });
</script>

<div bind:this={containerElement} class="renderer-container">
    <canvas
        bind:this={canvasElement}
        class="renderer-canvas"
        aria-label="Isometric scene with interactive characters"
    ></canvas>

    <div class="renderer-ui">
        <button
            class="debug-toggle"
            onclick={() => {
                debugMode = !debugMode;
                rendererState.debugRenderer?.toggleDebugMode();
            }}
            title="Toggle debug mode (Press D)"
            aria-label="Toggle debug overlay"
        >
            {debugMode ? 'Debug ON' : 'Debug OFF'}
        </button>
    </div>
</div>

<style>
    .renderer-container {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .renderer-canvas {
        display: block;
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }

    .renderer-ui {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 8px;
    }

    .debug-toggle {
        padding: 8px 14px;
        border: none;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.6);
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
        backdrop-filter: blur(4px);
    }

    .debug-toggle:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    .debug-toggle:active {
        transform: scale(0.98);
    }

    :global(.dialog-bubble) {
        position: absolute;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 12px;
        min-width: 200px;
        max-width: 280px;
        z-index: 100;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    :global(.dialog-bubble-pointer) {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
    }

    :global(.dialog-bubble-content) {
        margin-bottom: 4px;
    }

    :global(.dialog-bubble-title) {
        margin: 0 0 6px 0;
        font-size: 13px;
        font-weight: 600;
        color: #333;
    }

    :global(.dialog-bubble-summary) {
        margin: 6px 0;
        font-size: 12px;
        color: #666;
        line-height: 1.4;
    }

    :global(.dialog-bubble-date) {
        margin: 4px 0 8px 0;
        font-size: 11px;
        color: #999;
    }

    :global(.dialog-bubble-link) {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        color: #667eea;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    :global(.dialog-bubble-link:hover) {
        color: #764ba2;
    }

    :global(.dialog-bubble-close) {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 20px;
        height: 20px;
        border: none;
        background: transparent;
        color: #999;
        font-size: 14px;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
    }

    :global(.dialog-bubble-close:hover) {
        color: #333;
    }
</style>
