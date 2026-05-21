"use client";

export default function CircularProgress({
  value,
  size = 180,
  stroke = 14,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle
            r={radius}
            fill="none"
            stroke="var(--color-amber-20)"
            strokeWidth={stroke}
          />
          <circle
            r={radius}
            fill="none"
            stroke="var(--color-amber-100)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-ink"
          style={{
            fontFamily: "Glimber, sans-serif",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}
