'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fond du hero : champ de points en perspective qui ondule, aux couleurs
 * du dégradé KTech (vert → bleu). Décoratif, léger (canvas 2D, ~1 800 points),
 * mis en pause hors écran, figé si « réduire les animations », bouton pause (WCAG 2.2.2).
 */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    pausedRef.current = paused || reduced;
  }, [paused, reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const COLS = 60;
    const ROWS = 30;
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const horizon = h * 0.38;
      for (let r = 0; r < ROWS; r++) {
        const z = r / (ROWS - 1); // 0 = loin, 1 = proche
        const depth = 0.18 + z * 0.82;
        const yBase = horizon + Math.pow(z, 1.6) * (h - horizon) * 1.05;
        for (let c = 0; c < COLS; c++) {
          const u = c / (COLS - 1) - 0.5;
          const x = w / 2 + u * w * (0.55 + depth * 1.25);
          const wave =
            Math.sin(c * 0.22 + t * 0.9) * Math.cos(r * 0.28 - t * 0.6) * 26 * depth +
            Math.sin((c + r) * 0.12 + t * 0.5) * 12 * depth;
          const y = yBase - wave;
          const k = c / (COLS - 1);
          // dégradé vert #219B53 → bleu #2F69A1
          const R = Math.round(33 + (47 - 33) * k);
          const G = Math.round(155 + (105 - 155) * k);
          const B = Math.round(83 + (161 - 83) * k);
          const lift = Math.max(0, wave) / (38 * depth);
          ctx.fillStyle = `rgba(${R},${G},${B},${(0.15 + z * 0.55 + lift * 0.3).toFixed(3)})`;
          const s = 0.6 + depth * 1.9;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
    };

    const loop = () => {
      if (!pausedRef.current && visible) t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />
      {!reduced && (
        <button
          type="button"
          className="motion-toggle"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Relancer l’animation' : 'Mettre l’animation en pause'}
        </button>
      )}
    </>
  );
}
