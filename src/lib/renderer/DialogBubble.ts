/**
 * Dialog Bubble System
 * Manages clickable SVG/HTML dialog bubbles positioned above characters
 */

import type { DialogContent } from './types';

export class DialogBubble {
    private static readonly VERTICAL_OFFSET_PX = 16;
    private bubbleElement: HTMLElement | null = null;
    private isVisible: boolean = false;
    private content: DialogContent | null = null;
    private characterId: string;
    private container: HTMLElement;

    constructor(characterId: string, container: HTMLElement) {
        this.characterId = characterId;
        this.container = container;
    }

    /**
     * Show a dialog bubble above the character
     */
    public show(content: DialogContent, x: number, y: number): void {
        this.content = content;

        if (!this.bubbleElement) {
            this.bubbleElement = document.createElement('div');
            this.bubbleElement.className = 'dialog-bubble';
            this.bubbleElement.setAttribute('data-character', this.characterId);
            this.container.appendChild(this.bubbleElement);
        }

        // Build dialog content HTML
        const innerContent = `
      <div class="dialog-bubble-pointer"></div>
      <div class="dialog-bubble-content">
        <h3 class="dialog-bubble-title">${this.escapeHtml(content.title)}</h3>
        <p class="dialog-bubble-summary">${this.escapeHtml(content.summary)}</p>
        ${content.date ? `<p class="dialog-bubble-date">${this.escapeHtml(content.date)}</p>` : ''}
        <a href="${this.escapeHtml(content.url)}" class="dialog-bubble-link">Read more →</a>
      </div>
      <button class="dialog-bubble-close" aria-label="Close dialog" title="Close">✕</button>
    `;

        this.bubbleElement.innerHTML = innerContent;

        this.isVisible = true;

        // Position bubble (centered above character using container-relative percentages)
        this.setPosition(x, y);
        this.bubbleElement.style.display = 'block';

        // Add close handler
        const closeBtn = this.bubbleElement.querySelector('.dialog-bubble-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

    }

    /**
     * Hide the dialog bubble
     */
    public hide(): void {
        if (this.bubbleElement) {
            this.bubbleElement.style.display = 'none';
        }
        this.isVisible = false;
        this.content = null;
    }

    /**
     * Update position
     */
    public setPosition(x: number, y: number): void {
        if (this.bubbleElement && this.isVisible) {
            const containerWidth = this.container.clientWidth || 1;
            const containerHeight = this.container.clientHeight || 1;

            // Use the top-left of the canvas/container as origin and convert to relative units.
            const xPercent = (x / containerWidth) * 100;
            const yWithOffset = y - DialogBubble.VERTICAL_OFFSET_PX;
            const yPercent = (yWithOffset / containerHeight) * 100;

            this.bubbleElement.style.left = `${xPercent}%`;
            this.bubbleElement.style.top = `${yPercent}%`;
            this.bubbleElement.style.translate = '-50% -100%';
        }
    }

    /**
     * Check if dialog is visible
     */
    public getIsVisible(): boolean {
        return this.isVisible;
    }

    /**
     * Get current content
     */
    public getContent(): DialogContent | null {
        return this.content;
    }

    /**
     * Destroy and clean up
     */
    public destroy(): void {
        if (this.bubbleElement && this.bubbleElement.parentElement) {
            this.bubbleElement.parentElement.removeChild(this.bubbleElement);
        }
        this.bubbleElement = null;
    }

    /**
     * Escape HTML special characters
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Dialog bubble pool for efficient reuse
 */
export class DialogBubblePool {
    private bubbles: Map<string, DialogBubble> = new Map();
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    /**
     * Get or create a dialog bubble for a character
     */
    public getBubble(characterId: string): DialogBubble {
        if (!this.bubbles.has(characterId)) {
            this.bubbles.set(characterId, new DialogBubble(characterId, this.container));
        }
        return this.bubbles.get(characterId)!;
    }

    /**
     * Show dialog for a character
     */
    public showDialog(characterId: string, content: DialogContent, x: number, y: number): void {
        const bubble = this.getBubble(characterId);
        bubble.show(content, x, y);
    }

    /**
     * Hide dialog for a character
     */
    public hideDialog(characterId: string): void {
        const bubble = this.bubbles.get(characterId);
        if (bubble) {
            bubble.hide();
        }
    }

    /**
     * Update position of dialog bubble
     */
    public setDialogPosition(characterId: string, x: number, y: number): void {
        const bubble = this.bubbles.get(characterId);
        if (bubble) {
            bubble.setPosition(x, y);
        }
    }

    /**
     * Clear all bubbles
     */
    public clear(): void {
        for (const bubble of this.bubbles.values()) {
            bubble.destroy();
        }
        this.bubbles.clear();
    }

    /**
     * Destroy pool
     */
    public destroy(): void {
        this.clear();
    }
}
