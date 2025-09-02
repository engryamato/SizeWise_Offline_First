import React from 'react';
import { Application, Graphics, Container } from 'pixi.js';
import { useCanvasStore } from '../state/canvasStore';

export function CanvasRoot() {
  const ref = React.useRef<HTMLDivElement>(null);
  const vp = useCanvasStore((s) => s.viewport);
  const selection = useCanvasStore((s) => s.selection);
  const setViewport = useCanvasStore((s) => s.setViewport);

  React.useEffect(() => {
    if (!ref.current) return;
    const app = new Application({ background: '#ffffff', antialias: true, resizeTo: ref.current });
    ref.current.appendChild(app.canvas);

    // Layers
    const background = new Container();
    const guides = new Container();
    const ducts = new Container();
    const fittings = new Container();
    const endpoints = new Container();
    const annotations = new Container();
    const selectionLayer = new Container();
    const overlay = new Container();

    app.stage.addChild(background, guides, ducts, fittings, endpoints, annotations, selectionLayer, overlay);

    // Background grid (very simple placeholder)
    const grid = new Graphics();
    grid.lineStyle({ width: 1, color: 0xeeeeee, alpha: 1 });
    for (let x = 0; x < 2000; x += 50) {
      grid.moveTo(x, 0).lineTo(x, 2000);
    }
    for (let y = 0; y < 2000; y += 50) {
      grid.moveTo(0, y).lineTo(2000, y);
    }
    background.addChild(grid);

    // Example endpoint
    const ep = new Graphics();
    ep.beginFill(0x007acc, 1).drawCircle(200, 200, 6).endFill();
    endpoints.addChild(ep);

    // Pan/zoom interactions
    let isPanning = false;
    let panStart: { x: number; y: number } | null = null;
    function onWheel(ev: WheelEvent) {
      ev.preventDefault();
      const delta = Math.sign(ev.deltaY) * 0.1;
      const nextScale = Math.min(4, Math.max(0.25, vp.scale * (1 - delta)));
      setViewport({ ...vp, scale: nextScale });
    }
    function onMouseDown(ev: MouseEvent) {
      if (ev.button !== 1 && !(ev.button === 0 && ev.ctrlKey)) return; // MMB or Ctrl+LMB pan
      isPanning = true;
      panStart = { x: ev.clientX - vp.x, y: ev.clientY - vp.y };
    }
    function onMouseMove(ev: MouseEvent) {
      if (!isPanning || !panStart) return;
      setViewport({ ...vp, x: ev.clientX - panStart.x, y: ev.clientY - panStart.y });
    }
    function onMouseUp() {
      isPanning = false; panStart = null;
    }

    const el = ref.current;
    el?.addEventListener('wheel', onWheel, { passive: false });
    el?.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Cleanup
    return () => {
      app.destroy(true);
      if (ref.current && app.canvas.parentElement === ref.current) ref.current.removeChild(app.canvas);
      el?.removeEventListener('wheel', onWheel as any);
      el?.removeEventListener('mousedown', onMouseDown as any);
      window.removeEventListener('mousemove', onMouseMove as any);
      window.removeEventListener('mouseup', onMouseUp as any);
    };
  }, [vp.scale, vp.x, vp.y, setViewport]);

  // Apply viewport transform (CSS for placeholder; switch to stage transforms later)
  React.useEffect(() => {
    const canvas = ref.current?.querySelector('canvas') as HTMLCanvasElement | undefined;
    if (!canvas) return;
    canvas.style.transform = `translate(${vp.x}px, ${vp.y}px) scale(${vp.scale})`;
    canvas.style.transformOrigin = '0 0';
  }, [vp.x, vp.y, vp.scale]);

  React.useEffect(() => {
    void selection; // avoid unused now; wire highlighting next
  }, [selection]);

  return <div ref={ref} style={{ width: '100%', height: '70vh', border: '1px solid #ddd', overflow: 'hidden' }} />;
}

