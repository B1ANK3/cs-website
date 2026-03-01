<script lang="ts">
    import { Scene } from '$lib/renderer/Scene';
    import { Character } from '$lib/renderer/Character';
    import { DialogBubblePool } from '$lib/renderer/DialogBubble';
    import { DebugRenderer } from '$lib/renderer/DebugRenderer';
    import { createBehaviorConfig, pickRandom } from '$lib/renderer/CharacterBehaviors';
    import type { DialogContent, PathNode } from '$lib/renderer/types';
    import pathNodesData from '$lib/renderer/pathNodes.json';
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
    }

    let { articles = [], events = [] }: PageProps = $props();

    let containerElement: HTMLElement;
    let canvasElement: HTMLCanvasElement;
    
    // Reactive state for class instances
    let rendererState = $state({
        scene: null as Scene | null,
        debugRenderer: null as DebugRenderer | null,
        dialogBubblePool: null as DialogBubblePool | null,
        resizeObserver: null as ResizeObserver | null
    });
    
    let characters: Map<string, Character> = $state(new Map());
    let animationFrameId: number | null = $state(null);
    let lastFrameTime: number = $state(Date.now());
    let characterCount: number = $state(6);
    let debugMode: boolean = $state(false);

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
        if (!containerElement) return { width: 1280, height: 540 };

        const width = containerElement.clientWidth || 1280;
        const height = containerElement.clientHeight || 540;

        return { width, height };
    }

    /**
     * Initialize the renderer
     */
    async function initializeRenderer() {
        if (!canvasElement || !containerElement) return;

        try {
            const { width, height } = getCanvasDimensions();

            // Create scene
            rendererState.scene = new Scene({
                canvasWidth: width,
                canvasHeight: height,
                backgroundImage: '/scene/scene-background.png'
            });

            await rendererState.scene.initialize(canvasElement);

            // Initialize dialog bubble pool
            if (!rendererState.dialogBubblePool) {
                rendererState.dialogBubblePool = new DialogBubblePool(containerElement);
            }

            // Initialize debug renderer
            rendererState.debugRenderer = new DebugRenderer(canvasElement);
            rendererState.debugRenderer.setPathNodes(pathNodesData as PathNode[]);

            // Spawn initial characters
            spawnCharacters();

            // Start animation loop if not already running
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
        const allNodes = pathFinding.getAllNodes();

        // Clear existing characters
        rendererState.debugRenderer?.clear();
        characters.clear();

        // Spawn new characters
        for (let i = 0; i < characterCount; i++) {
            const characterId = `character-${i}`;
            const startNode = pickRandom(allNodes) || (allNodes[0] as PathNode);

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

            characters.set(characterId, character);
            rendererState.debugRenderer?.addCharacter(character);

            // Stagger character spawning
            setTimeout(() => {
                character.pathTo(pickRandom(allNodes)?.id || 'entry-left');
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
            // Update all characters
            characters.forEach((character) => {
                character.update(deltaTime);

                // Update dialog bubble position
                if (rendererState.dialogBubblePool) {
                    const entity = character.getEntity();
                    if (entity.dialogBubble.isVisible) {
                        const pos = character.getPosition();
                        rendererState.dialogBubblePool.setDialogPosition(entity.id, pos.x, pos.y);
                    }

                    // Show dialog if transitioning to talking
                    if (
                        character.getCurrentState() === 'talking' &&
                        !entity.dialogBubble.content &&
                        character.getEntity().dialogBubble.content === null
                    ) {
                        const content = pickRandomContent();
                        if (content) {
                            const pos = character.getPosition();
                            character.showDialog(content);
                            rendererState.dialogBubblePool.showDialog(entity.id, content, pos.x, pos.y);
                        }
                    }
                }
            });

            // Render scene
            rendererState.scene.render(() => {
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

            // Draw character ID
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(entity.id, pos.x, pos.y + 28);
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
