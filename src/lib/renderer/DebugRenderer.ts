/**
 * Debug Overlay Renderer
 * Shows pathfinding nodes, connections, character states, and debug information
 */

import type { PathNode, DebugOverlayData } from './types';
import type { Character } from './Character';

export class DebugRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private debugData: DebugOverlayData;
  private pathNodes: PathNode[] = [];
  private characters: Map<string, Character> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.debugData = {
      enabled: false,
      showNodes: true,
      showConnections: true,
      showCharacterStates: true,
      showTargets: true,
    };
  }

  /**
   * Toggle debug mode on/off
   */
  public toggleDebugMode(): void {
    this.debugData.enabled = !this.debugData.enabled;
    console.log(`Debug mode: ${this.debugData.enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Set path nodes for visualization
   */
  public setPathNodes(nodes: PathNode[]): void {
    this.pathNodes = nodes;
  }

  /**
   * Add a character for debugging
   */
  public addCharacter(character: Character): void {
    this.characters.set(character.getEntity().id, character);
  }

  /**
   * Remove a character from debugging
   */
  public removeCharacter(characterId: string): void {
    this.characters.delete(characterId);
  }

  /**
   * Render debug overlay
   */
  public render(): void {
    if (!this.debugData.enabled) return;

    // Clear debug area (semi-transparent)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.debugData.showConnections) {
      this.renderConnections();
    }

    if (this.debugData.showNodes) {
      this.renderNodes();
    }

    if (this.debugData.showCharacterStates) {
      this.renderCharacterStates();
    }

    if (this.debugData.showTargets) {
      this.renderTargets();
    }

    // Draw debug UI
    this.renderDebugUI();
  }

  /**
   * Render pathfinding connections
   */
  private renderConnections(): void {
    this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
    this.ctx.lineWidth = 2;

    for (const node of this.pathNodes) {
      for (const connectionId of node.connections) {
        const connectedNode = this.pathNodes.find((n) => n.id === connectionId);
        if (connectedNode) {
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(connectedNode.x, connectedNode.y);
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Render pathfinding nodes
   */
  private renderNodes(): void {
    for (const node of this.pathNodes) {
      // Draw node circle
      this.ctx.fillStyle = node.isWaypoint ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 200, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw node label
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.font = '10px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(String(node.id), node.x, node.y - 12);
    }
  }

  /**
   * Render character states
   */
  private renderCharacterStates(): void {
    for (const character of this.characters.values()) {
      const entity = character.getEntity();
      const state = character.getCurrentState();
      const pos = character.getPosition();

      // Draw state indicator circle
      const stateColors = {
        idle: 'rgba(100, 255, 100, 0.6)',
        walking: 'rgba(100, 150, 255, 0.6)',
        turning: 'rgba(255, 200, 100, 0.6)',
        talking: 'rgba(255, 100, 200, 0.6)',
      };

      this.ctx.fillStyle = stateColors[state] || 'rgba(200, 200, 200, 0.6)';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw state label
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(state.toUpperCase(), pos.x, pos.y + 20);

      // Draw direction
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.font = '10px monospace';
      this.ctx.fillText(`Dir: ${entity.transform.direction}`, pos.x, pos.y + 32);
    }
  }

  /**
   * Render target nodes for walking characters
   */
  private renderTargets(): void {
    this.ctx.strokeStyle = 'rgba(255, 200, 100, 0.8)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 4]);

    for (const character of this.characters.values()) {
      const entity = character.getEntity();

      if (entity.pathData.nodes.length > 0) {
        const targetNode = entity.pathData.nodes[entity.pathData.nodes.length - 1];
        const pos = character.getPosition();

        // Draw line to target
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(targetNode.x, targetNode.y);
        this.ctx.stroke();

        // Draw target marker
        this.ctx.fillStyle = 'rgba(255, 200, 100, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(targetNode.x, targetNode.y, 5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.setLineDash([]);
  }

  /**
   * Render debug UI stats
   */
  private renderDebugUI(): void {
    const padding = 10;
    const lineHeight = 16;
    let y = padding;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(padding, padding, 250, 120);

    this.ctx.fillStyle = 'rgba(100, 255, 100, 0.9)';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.textAlign = 'left';

    const stats = [
      `Active Characters: ${this.characters.size}`,
      `Path Nodes: ${this.pathNodes.length}`,
      `Debug: ON (Press D)`,
      `FPS: ${this.calculateFPS()}`,
    ];

    for (const stat of stats) {
      this.ctx.fillText(stat, padding + 5, y + lineHeight);
      y += lineHeight;
    }
  }

  /**
   * Calculate FPS (simple rolling average)
   */
  private fpsHistory: number[] = [];
  private lastFrameTime: number = Date.now();

  private calculateFPS(): number {
    const now = Date.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    if (frameTime > 0) {
      this.fpsHistory.push(1000 / frameTime);
      if (this.fpsHistory.length > 30) {
        this.fpsHistory.shift();
      }
    }

    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    return Math.round(avgFps);
  }

  /**
   * Get debug data
   */
  public getDebugData(): DebugOverlayData {
    return this.debugData;
  }

  /**
   * Set debug data
   */
  public setDebugData(data: Partial<DebugOverlayData>): void {
    this.debugData = { ...this.debugData, ...data };
  }

  /**
   * Clear all debug data
   */
  public clear(): void {
    this.characters.clear();
    this.pathNodes = [];
    this.fpsHistory = [];
  }
}
