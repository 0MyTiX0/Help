"use client";

import { useEffect, useRef } from "react";

type Stat = {
  value: string;
  label: string;
};

const defaultStats: Stat[] = [
  { value: "148", label: "Adhérents" },
  { value: "3 600", label: "Interventions en école" },
  { value: "120", label: "Nombre de sujets traités" },
];

type Props = {
  title?: string;
  stats?: Stat[];
};

function parseTarget(value: string): number {
  return parseInt(value.replace(/\s/g, ""), 10) || 0;
}

function formatNumber(n: number, original: string): string {
  const hasSpace = original.includes(" ");
  if (hasSpace) {
    return Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  }
  return Math.round(n).toString();
}

function StatCard({ stat }: { stat: Stat }) {
  const numberRef = useRef<HTMLDivElement>(null);
  const target = parseTarget(stat.value);

  useEffect(() => {
    if (!numberRef.current) return;
    const el = numberRef.current;

    let gsapInstance: typeof import("gsap").gsap | null = null;
    let scrollTriggerInstance:
      | typeof import("gsap/ScrollTrigger").ScrollTrigger
      | null = null;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsap;
      scrollTriggerInstance = ScrollTrigger;

      ctx = gsap.context(() => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate() {
            if (el) el.textContent = formatNumber(obj.val, stat.value);
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    })();

    return () => {
      ctx?.revert();
    };
  }, [target, stat.value]);

  return (
    <article className="text-center">
      <div
        ref={numberRef}
        className="font-['Glimber',sans-serif] text-4xl font-bold leading-[1.2] tracking-[-0.03em]"
        aria-label={stat.value}
      >
        0
      </div>
      <h2 className="mt-4">{stat.label}</h2>
    </article>
  );
}

export default function KeyFigures({
  title = "Help. en quelques chiffres",
  stats = defaultStats,
}: Props) {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mt-4 tracking-[-0.03em]">{title}</h1>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
