import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import IsometricRenderer from './IsometricRenderer.svelte';

/**
 * @fileoverview Browser/component specification for IsometricRenderer.svelte.
 *
 * Spec goals:
 * - Component mounts with canvas and controls.
 * - Debug toggle updates rune-backed state reactively.
 * - Keyboard interaction toggles debug state.
 */

const articles = [
    {
        title: 'Article One',
        summary: 'Summary A',
        url: '/news/article-one',
        date: '2026-03-01'
    }
];

const events = [
    {
        title: 'Event One',
        summary: 'Summary E',
        url: '/events/event-one',
        date: '2026-04-01'
    }
];

describe('IsometricRenderer.svelte', () => {
    async function getDebugLabel() {
        const debugButton = page.getByRole('button', { name: 'Toggle debug overlay' });
        const element = await debugButton.element();
        return element.textContent ?? '';
    }

    it('renders canvas and debug toggle button', async () => {
        render(IsometricRenderer, {
            props: { articles, events }
        });

        const canvas = page.getByLabelText('Isometric scene with interactive characters');
        const debugButton = page.getByRole('button', { name: 'Toggle debug overlay' });

        await expect.element(canvas).toBeInTheDocument();
        await expect.element(debugButton).toBeInTheDocument();
        expect(await getDebugLabel()).toContain('Debug OFF');
    });

    it('toggles debug state via button click', async () => {
        render(IsometricRenderer, {
            props: { articles, events }
        });

        const debugButton = page.getByRole('button', { name: 'Toggle debug overlay' });

        await debugButton.click();
        expect(await getDebugLabel()).toContain('Debug ON');

        await debugButton.click();
        expect(await getDebugLabel()).toContain('Debug OFF');
    });

    it('toggles debug state via keyboard shortcut D', async () => {
        render(IsometricRenderer, {
            props: { articles, events }
        });

        const debugButton = page.getByRole('button', { name: 'Toggle debug overlay' });

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
        expect(await getDebugLabel()).toContain('Debug ON');

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'D' }));
        expect(await getDebugLabel()).toContain('Debug OFF');
    });

    /**
     * BADSTATE: dialog-bubble DOM visibility can drift from character dialog state because
     * IsometricRenderer only updates position for visible bubbles and never synchronizes hide
     * through DialogBubblePool.hideDialog on state exit.
     */
    it('keeps renderer mounted while toggling state repeatedly', async () => {
        render(IsometricRenderer, {
            props: { articles, events }
        });

        const debugButton = page.getByRole('button', { name: 'Toggle debug overlay' });

        await debugButton.click();
        await debugButton.click();
        await debugButton.click();

        expect(await getDebugLabel()).toContain('Debug ON');
    });
});
