import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const COARSE = 22;
// Past this the dots read as a photo anyway, so the last step swaps in the real image.
const SHARP = 64;

/**
 * The photo as a dot matrix that resolves into the real image on hover.
 * Resolution, not opacity, is what animates, so the face sharpens rather than fades in.
 */
export function PixelAvatar({
  src,
  alt,
  size = 112,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const res = useRef(COARSE);
  const frame = useRef(0);

  const draw = useCallback(() => {
    const el = canvas.current;
    const image = img.current;
    if (!el || !image) return;
    paint(el, image, size, res.current);
  }, [size]);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      img.current = image;
      draw();
    };
    return () => cancelAnimationFrame(frame.current);
  }, [src, draw]);

  function animateTo(target: number) {
    cancelAnimationFrame(frame.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      res.current = target;
      draw();
      return;
    }
    const step = () => {
      // Exponential approach: fast at first, settling softly, and retargetable mid-flight.
      res.current += (target - res.current) * 0.16;
      if (Math.abs(target - res.current) < 1) res.current = target;
      draw();
      if (res.current !== target) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={alt}
      onPointerEnter={() => animateTo(SHARP)}
      onPointerLeave={() => animateTo(COARSE)}
      style={{ width: size, height: size }}
      className={cn("rounded-full", className)}
    />
  );
}

function paint(el: HTMLCanvasElement, image: HTMLImageElement, size: number, resolution: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const px = Math.round(size * dpr);
  if (el.width !== px) el.width = el.height = px;
  const ctx = el.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, px, px);

  const n = Math.round(resolution);
  if (n >= SHARP) {
    ctx.drawImage(image, 0, 0, px, px);
    return;
  }
  const small = document.createElement("canvas");
  small.width = small.height = n;
  const sctx = small.getContext("2d", { willReadFrequently: true });
  if (!sctx) return;
  sctx.drawImage(image, 0, 0, n, n);
  const data = sctx.getImageData(0, 0, n, n).data;
  const cell = px / n;
  // Dots grow as the grid gets finer, so the last frames read as a continuous image.
  const radius = cell * (0.36 + 0.14 * ((n - COARSE) / (SHARP - COARSE)));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = (y * n + x) * 4;
      ctx.fillStyle = `rgb(${data[i]} ${data[i + 1]} ${data[i + 2]})`;
      ctx.beginPath();
      ctx.arc(x * cell + cell / 2, y * cell + cell / 2, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
