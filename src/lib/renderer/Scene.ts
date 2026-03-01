/**
 * Scene Manager
 * Handles canvas setup, layer rendering, coordinate conversions (screen ↔ isometric)
 * and asset loading
 */

import type { SceneConfig, PathNode } from './types';
import { PathFinding } from './PathFinding';
import pathNodesData from './pathNodes.json';

export class Scene {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private config: SceneConfig;
  private backgroundImage: HTMLImageElement | null = null;
  private pathFinding: PathFinding;
  private isInitialized: boolean = false;

  constructor(config: SceneConfig) {
    this.config = config;
    this.pathFinding = new PathFinding(pathNodesData as PathNode[]);
  }

  /**
   * Initialize the scene with a canvas element
   */
  public async initialize(canvasElement: HTMLCanvasElement): Promise<void> {
    if (this.isInitialized) {
      console.warn('Scene already initialized');
      return;
    }

    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    if (!this.ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }

    // Set canvas size
    this.canvas.width = this.config.canvasWidth;
    this.canvas.height = this.config.canvasHeight;

    // Load background image
    if (this.config.backgroundImage) {
      await this.loadBackgroundImage(this.config.backgroundImage);
    }

    this.isInitialized = true;
  }

  /**
   * Load background image
   */
  private loadBackgroundImage(imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.backgroundImage = img;
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load background image: ${imagePath}`);
        resolve(); // Continue without background
      };
      img.src = imagePath;
    });
  }

  /**
   * Render the scene
   */
  public render(renderCallback?: () => void): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background image if loaded
    if (this.backgroundImage) {
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // Call custom render callback for characters, etc.
    if (renderCallback) {
      renderCallback();
    }
  }

  /**
   * Get canvas context
   */
  public getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  /**
   * Get canvas element
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Get path finding instance
   */
  public getPathFinding(): PathFinding {
    return this.pathFinding;
  }

  /**
   * Convert screen coordinates to isometric
   * (For future use if implementing true isometric projection)
   */
  public screenToIsometric(x: number, y: number): { x: number; y: number } {
    // For now, screen space and isometric space are the same
    // This would be used if implementing a true isometric projection
    return { x, y };
  }

  /**
   * Convert isometric coordinates to screen
   * (For future use if implementing true isometric projection)
   */
  public isometricToScreen(x: number, y: number): { x: number; y: number } {
    // For now, screen space and isometric space are the same
    return { x, y };
  }

  /**
   * Get scene config
   */
  public getConfig(): SceneConfig {
    return this.config;
  }

  /**
   * Render sprite at a specific position
   */
  public renderSprite(
    spriteSheet: HTMLImageElement,
    frameX: number,
    frameY: number,
    frameWidth: number,
    frameHeight: number,
    screenX: number,
    screenY: number,
    scale: number = 1
  ): void {
    if (!this.ctx) return;

    this.ctx.drawImage(
      spriteSheet,
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      screenX - (frameWidth * scale) / 2,
      screenY - frameHeight * scale,
      frameWidth * scale,
      frameHeight * scale
    );
  }

  /**
   * Render a circle (for debug or UI)
   */
  public renderCircle(
    x: number,
    y: number,
    radius: number,
    fillColor?: string,
    strokeColor?: string,
    lineWidth: number = 1
  ): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }

    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
  }

  /**
   * Render text
   */
  public renderText(
    text: string,
    x: number,
    y: number,
    color: string = '#000',
    font: string = '12px Arial'
  ): void {
    if (!this.ctx) return;

    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  /**
   * Get dimensions
   */
  public getDimensions(): { width: number; height: number } {
    return {
      width: this.config.canvasWidth,
      height: this.config.canvasHeight,
    };
  }

  /**
   * Check if point is within bounds
   */
  public isPointInBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.config.canvasWidth && y >= 0 && y <= this.config.canvasHeight;
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.canvas = null;
    this.ctx = null;
    this.backgroundImage = null;
    this.isInitialized = false;
  }
}
