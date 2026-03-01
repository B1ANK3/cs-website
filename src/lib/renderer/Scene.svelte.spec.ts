import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Scene } from './Scene';
import type { SceneConfig } from './types';

/**
 * @fileoverview Browser specification for Scene.
 *
 * Spec goals:
 * - Validate initialization, canvas/context setup, and background load handling.
 * - Validate render delegates and drawing helpers.
 * - Validate coordinate, bounds, and cleanup behavior.
 */

type MutableImage = {
    onload: (() => void) | null;
    onerror: (() => void) | null;
    src: string;
    crossOrigin: string;
};

describe('Scene', () => {
    const config: SceneConfig = {
        canvasWidth: 320,
        canvasHeight: 180,
        backgroundImage: '/scene/bg.png'
    };

    const ctx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
        font: '',
        textAlign: 'start' as CanvasTextAlign,
        fillRect: vi.fn(),
        drawImage: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillText: vi.fn()
    } as unknown as CanvasRenderingContext2D;

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    function mockImageConstructor(mode: 'load' | 'error') {
        class MockImage {
            public onload: (() => void) | null = null;
            public onerror: (() => void) | null = null;
            public crossOrigin = '';

            set src(_value: string) {
                queueMicrotask(() => {
                    if (mode === 'load') {
                        this.onload?.();
                    } else {
                        this.onerror?.();
                    }
                });
            }
        }

        vi.stubGlobal('Image', MockImage as unknown as typeof Image);
    }

    function createCanvasWithContext(context: CanvasRenderingContext2D | null): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        vi.spyOn(canvas, 'getContext').mockReturnValue(context);
        return canvas;
    }

    it('initializes canvas dimensions and context', async () => {
        mockImageConstructor('load');
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(ctx);

        await scene.initialize(canvas);

        expect(scene.getCanvas()).toBe(canvas);
        expect(scene.getContext()).toBe(ctx);
        expect(canvas.width).toBe(320);
        expect(canvas.height).toBe(180);
    });

    it('throws when 2D context cannot be acquired', async () => {
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(null);

        await expect(scene.initialize(canvas)).rejects.toThrow(
            'Failed to get 2D context from canvas'
        );
    });

    it('warns and no-ops when initialize is called twice', async () => {
        mockImageConstructor('load');
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(ctx);

        await scene.initialize(canvas);
        await scene.initialize(canvas);

        expect(warnSpy).toHaveBeenCalled();
    });

    it('renders clear, optional background, and callback', async () => {
        mockImageConstructor('load');
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(ctx);
        const callback = vi.fn();

        await scene.initialize(canvas);
        scene.render(callback);

        expect(ctx.fillRect as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
            0,
            0,
            320,
            180
        );
        expect(ctx.drawImage as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('continues rendering when background image fails to load', async () => {
        mockImageConstructor('error');
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(ctx);

        await scene.initialize(canvas);
        scene.render();

        expect(warnSpy).toHaveBeenCalled();
        expect(ctx.fillRect as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalled();
    });

    it('renders sprite primitives, circles, and text helpers', async () => {
        mockImageConstructor('load');
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(ctx);
        const image = new (globalThis.Image as unknown as { new (): MutableImage })();

        await scene.initialize(canvas);

        scene.renderSprite(image as unknown as HTMLImageElement, 0, 0, 32, 32, 100, 120, 2);
        scene.renderCircle(10, 20, 4, '#f00', '#0f0', 2);
        scene.renderText('label', 50, 60, '#000', '12px Arial');

        expect(ctx.drawImage as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalled();
        expect(ctx.arc as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
            10,
            20,
            4,
            0,
            Math.PI * 2
        );
        expect(ctx.fillText as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
            'label',
            50,
            60
        );
    });

    it('supports bounds and coordinate helpers and destroys cleanly', async () => {
        mockImageConstructor('load');
        const scene = new Scene(config);
        const canvas = createCanvasWithContext(ctx);

        await scene.initialize(canvas);

        expect(scene.getDimensions()).toEqual({ width: 320, height: 180 });
        expect(scene.screenToIsometric(12, 34)).toEqual({ x: 12, y: 34 });
        expect(scene.isometricToScreen(56, 78)).toEqual({ x: 56, y: 78 });
        expect(scene.isPointInBounds(0, 0)).toBe(true);
        expect(scene.isPointInBounds(321, 0)).toBe(false);

        scene.destroy();

        expect(scene.getCanvas()).toBeNull();
        expect(scene.getContext()).toBeNull();
    });
});
