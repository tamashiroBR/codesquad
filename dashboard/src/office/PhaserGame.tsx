import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { OfficeScene } from './OfficeScene';
import { useSquadStore } from '@/store/useSquadStore';
import { selectDisplayState, buildIdleState } from '@/lib/displayState';

// Cap the backing-store multiplier: 2x already looks crisp on Retina without
// quadrupling the pixel count on 3x phones.
const DPR = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  // Create Phaser game on mount
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      width: Math.round(w * DPR),    // render at device resolution → crisp
      height: Math.round(h * DPR),
      pixelArt: false,
      antialias: true,               // smooth scaling/text at high backing res
      roundPixels: true,
      backgroundColor: '#1a1420',
      scene: [OfficeScene],
      scale: { mode: Phaser.Scale.NONE },
    });

    gameRef.current = game;

    // Force the canvas to display at CSS (logical) size while the backing store
    // stays at DPR scale. Phaser's NONE mode would otherwise blow it up.
    const applyCanvasCss = (cssW: number, cssH: number) => {
      const canvas = game.canvas;
      if (canvas) {
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;
      }
    };
    applyCanvasCss(w, h);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          game.scale.resize(Math.round(width * DPR), Math.round(height * DPR));
          applyCanvasCss(width, height);
        }
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Bridge React state → Phaser scene (replay-aware display state)
  useEffect(() => {
    return useSquadStore.subscribe((state) => {
      const game = gameRef.current;
      if (!game) return;
      const scene = game.scene.getScene('OfficeScene') as OfficeScene | null;
      if (!scene || !scene.scene.isActive()) return;

      const selected = state.selectedSquad;
      const live = selected ? state.activeStates.get(selected) : undefined;
      const events = selected ? state.events.get(selected) : undefined;
      const display = selectDisplayState(live, events, state.replay);

      // No live/replay state yet → show the squad's real roster (from squad.yaml)
      // idle, instead of the generic demo agents.
      let toRender = display;
      if (!toRender && selected) {
        const info = state.squads.get(selected);
        if (info && info.agents.length > 0) toRender = buildIdleState(info);
      }

      scene.events.emit('stateUpdate', toRender);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'hidden',
        imageRendering: 'auto',
      }}
    />
  );
}
