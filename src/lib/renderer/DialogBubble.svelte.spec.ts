import { afterEach, describe, expect, it } from 'vitest';
import { DialogBubble, DialogBubblePool } from './DialogBubble';
import type { DialogContent } from './types';

/**
 * @fileoverview Browser specification for DialogBubble and DialogBubblePool.
 *
 * Spec goals:
 * - Create and render bubble markup safely.
 * - Handle show/hide/position lifecycle.
 * - Reuse bubbles via pool and clean up DOM.
 */

const content: DialogContent = {
    id: 'article-1',
    type: 'article',
    title: 'Test <script>alert(1)</script>',
    summary: 'Summary <b>bold</b>',
    url: '/news/article-1',
    date: '2026-03-01'
};

describe('DialogBubble', () => {
    function createSizedContainer(width = 400, height = 300): HTMLDivElement {
        const container = document.createElement('div');
        Object.defineProperty(container, 'clientWidth', {
            configurable: true,
            get: () => width
        });
        Object.defineProperty(container, 'clientHeight', {
            configurable: true,
            get: () => height
        });
        document.body.appendChild(container);
        return container;
    }

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('shows bubble with escaped content and visible state', () => {
        const container = createSizedContainer();
        const bubble = new DialogBubble('character-1', container);

        bubble.show(content, 120, 200);

        const element = container.querySelector('.dialog-bubble') as HTMLElement;

        expect(element).toBeTruthy();
        expect(element.style.display).toBe('block');
        expect(element.innerHTML.includes('<script>')).toBe(false);
        expect(element.style.left).toBe('30%');
        expect(Number.parseFloat(element.style.top)).toBeCloseTo(61.33333333333333, 3);
        expect(element.style.translate).toBe('-50% -100%');
        expect(bubble.getIsVisible()).toBe(true);
        expect(bubble.getContent()?.title).toContain('Test');
    });

    it('hides bubble and clears content state', () => {
        const container = createSizedContainer();
        const bubble = new DialogBubble('character-2', container);

        bubble.show(content, 120, 200);
        bubble.hide();

        const element = container.querySelector('.dialog-bubble') as HTMLElement;

        expect(element.style.display).toBe('none');
        expect(bubble.getIsVisible()).toBe(false);
        expect(bubble.getContent()).toBeNull();
    });

    it('updates bubble position only when visible', () => {
        const container = createSizedContainer();
        const bubble = new DialogBubble('character-3', container);

        bubble.show(content, 100, 200);
        bubble.setPosition(150, 220);

        const element = container.querySelector('.dialog-bubble') as HTMLElement;
        expect(element.style.left).toBe('37.5%');
        expect(element.style.top).toBe('68%');

        bubble.hide();
        bubble.setPosition(300, 400);
        expect(element.style.left).toBe('37.5%');
        expect(element.style.top).toBe('68%');
    });

    it('closes when close button is clicked', () => {
        const container = createSizedContainer();
        const bubble = new DialogBubble('character-4', container);

        bubble.show(content, 100, 200);

        const closeButton = container.querySelector('.dialog-bubble-close') as HTMLButtonElement;
        closeButton.click();

        expect(bubble.getIsVisible()).toBe(false);
        expect(bubble.getContent()).toBeNull();
    });

    it('destroys and removes bubble from dom', () => {
        const container = createSizedContainer();
        const bubble = new DialogBubble('character-5', container);

        bubble.show(content, 100, 200);
        bubble.destroy();

        expect(container.querySelector('.dialog-bubble')).toBeNull();
    });
});

describe('DialogBubblePool', () => {
    function createSizedContainer(width = 400, height = 300): HTMLDivElement {
        const container = document.createElement('div');
        Object.defineProperty(container, 'clientWidth', {
            configurable: true,
            get: () => width
        });
        Object.defineProperty(container, 'clientHeight', {
            configurable: true,
            get: () => height
        });
        document.body.appendChild(container);
        return container;
    }

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('reuses bubble instance by character id', () => {
        const container = createSizedContainer();
        const pool = new DialogBubblePool(container);

        const first = pool.getBubble('character-1');
        const second = pool.getBubble('character-1');

        expect(first).toBe(second);
    });

    it('shows, positions, and hides dialog by character id', () => {
        const container = createSizedContainer();
        const pool = new DialogBubblePool(container);

        pool.showDialog('character-7', content, 30, 100);
        pool.setDialogPosition('character-7', 40, 120);
        pool.hideDialog('character-7');

        const element = container.querySelector('.dialog-bubble') as HTMLElement;
        expect(element).toBeTruthy();
        expect(element.style.display).toBe('none');
    });

    it('clears all bubbles and destroys dom nodes', () => {
        const container = createSizedContainer();
        const pool = new DialogBubblePool(container);

        pool.showDialog('character-1', content, 20, 80);
        pool.showDialog('character-2', content, 30, 90);
        expect(container.querySelectorAll('.dialog-bubble').length).toBe(2);

        pool.clear();
        expect(container.querySelectorAll('.dialog-bubble').length).toBe(0);
    });
});
