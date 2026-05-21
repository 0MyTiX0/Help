"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  animate,
  type AnimationPlaybackControls,
} from "framer-motion";

export type WheelCategory = {
  id: string;
  name: string;
  description?: string | null;
};

type Props = {
  categories: WheelCategory[];
};

function normalize(angleDeg: number) {
  let a = angleDeg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

export default function CategoryWheel({ categories }: Props) {
  const N = categories.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const stepDeg = useMemo(() => (N > 0 ? 360 / N : 0), [N]);

  const dragState = useRef({
    dragging: false,
    lastAngle: 0,
    lastTime: 0,
    velocity: 0,
  });
  const animationRef = useRef<AnimationPlaybackControls | null>(null);

  useAnimationFrame(() => {
    if (N === 0) return;
    const r = rotation.get();
    let best = 0;
    let bestAbs = Infinity;
    for (let i = 0; i < N; i++) {
      const wa = Math.abs(normalize(stepDeg * i + r));
      if (wa < bestAbs) {
        bestAbs = wa;
        best = i;
      }
    }
    if (best !== activeIndex) setActiveIndex(best);
  });

  function pointerAngle(clientX: number, clientY: number) {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    return (Math.atan2(dx, -dy) * 180) / Math.PI;
  }

  function onPointerDown(e: React.PointerEvent) {
    if (N === 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    dragState.current.dragging = true;
    dragState.current.lastAngle = pointerAngle(e.clientX, e.clientY);
    dragState.current.lastTime = performance.now();
    dragState.current.velocity = 0;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current.dragging) return;
    const a = pointerAngle(e.clientX, e.clientY);
    let delta = a - dragState.current.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const now = performance.now();
    const dt = Math.max(1, now - dragState.current.lastTime) / 1000;
    dragState.current.velocity = delta / dt;
    dragState.current.lastAngle = a;
    dragState.current.lastTime = now;

    rotation.set(rotation.get() + delta);
  }

  function snapTo(currentRotation: number) {
    if (N === 0) return currentRotation;
    const i = Math.round(-currentRotation / stepDeg);
    const target = -i * stepDeg;
    let diff = target - currentRotation;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return currentRotation + diff;
  }

  function onPointerUp() {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    const v = dragState.current.velocity;

    const startRotation = rotation.get();
    const decay = 2.2;
    const projected = startRotation + v / decay;
    const snapped = snapTo(projected);

    if (animationRef.current) animationRef.current.stop();
    animationRef.current = animate(rotation, snapped, {
      type: "spring",
      stiffness: 60,
      damping: 18,
      velocity: v,
      restDelta: 0.01,
    });
  }

  function goToIndex(i: number) {
    if (animationRef.current) animationRef.current.stop();
    const current = rotation.get();
    let target = -stepDeg * i;
    let diff = target - current;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    target = current + diff;
    animationRef.current = animate(rotation, target, {
      type: "spring",
      stiffness: 80,
      damping: 20,
    });
  }

  useEffect(() => {
    function preventSelect(e: Event) {
      if (dragState.current.dragging) e.preventDefault();
    }
    document.addEventListener("selectstart", preventSelect);
    return () => document.removeEventListener("selectstart", preventSelect);
  }, []);

  const activeCategory = categories[activeIndex];

  return (
    <section className="relative bg-surface overflow-hidden pt-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        {/* Viewport: only the top arc (3 cards) is visible; the rest is cropped */}
        <div className="relative mx-auto h-[330px] sm:h-[390px] md:h-[450px] lg:h-[520px] xl:h-[550px] w-full pt-3">
          <div
            ref={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute left-1/2 -translate-x-1/2 top-3 aspect-square touch-none select-none cursor-grab active:cursor-grabbing
                       w-[1000px] sm:w-[1200px] md:w-[1400px] lg:w-[1700px] xl:w-[1800px]"
            style={{ touchAction: "none" }}
            role="group"
            aria-label="Choisissez votre thème"
          >
            {/* Rotating layer */}
            <motion.div
              className="absolute inset-0"
              style={{ rotate: rotation }}
            >
              {categories.map((category, i) => {
                const angle = stepDeg * i;
                const isActive = i === activeIndex;
                const iconSrc = `/icons/${encodeURIComponent(category.name)}.svg`;
                return (
                  <div
                    key={category.id}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isActive) {
                          window.location.href = `/categories/${category.id}`;
                        } else {
                          goToIndex(i);
                        }
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={`absolute left-1/2 top-0 -translate-x-1/2 flex h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 flex-col items-center justify-between rounded-tr-[28px] rounded-bl-[28px] p-6 text-white shadow-[0_24px_50px_rgba(187,34,95,0.22)] transition-transform ${
                        isActive
                          ? "bg-rose-100 scale-[1.04] z-10"
                          : "bg-rose-100/95 hover:scale-[1.02]"
                      }`}
                      aria-label={category.name}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className="self-center text-[11px] sm:text-xs uppercase tracking-[0.18em] opacity-85 text-center leading-tight">
                        {category.description ?? "Thème"}
                      </span>
                      <span className="text-center font-bold leading-tight text-xl sm:text-2xl line-clamp-2 px-2">
                        {category.name}
                      </span>
                      <span className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
                        <Image
                          src={iconSrc}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-contain"
                          // Fallback handled via onError below
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      </span>
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {activeCategory ? (
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[244px] sm:top-[290px] md:top-[320px] lg:top-[355px] flex flex-col items-center gap-4 text-center">
              <p className="font-bold text-base sm:text-lg">
                Choisissez votre theme
              </p>
              <img
                src="/images/homepage_wheel_helper.png"
                alt="Faites glisser pour explorer"
                className="h-12 w-12 sm:h-14 sm:w-14 select-none object-contain bg-transparent"
                draggable={false}
              />
              <Link
                href={`/categories/${activeCategory.id}`}
                className="pointer-events-auto rounded-full bg-rose-100 px-7 py-3 text-white shadow-[0_12px_28px_rgba(187,34,95,0.28)] transition-transform hover:-translate-y-0.5"
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={`Découvrir ${activeCategory.name}`}
              >
                <h3>Découvrir</h3>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
