"use client";
import { useId } from "react";

export function HandoffMark({ size = 28 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F7FFF" />
          <stop offset="100%" stopColor="#3FA8D4" />
        </linearGradient>
        <linearGradient id={`${uid}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3FA8D4" />
          <stop offset="100%" stopColor="#2DD4A8" />
        </linearGradient>
        <mask id={`${uid}-sm`}>
          <rect width="24" height="24" fill="white" />
          <path
            d="M 10.5 8.4 Q 11.9 13.75, 10.5 19.1 L 9.1 19.1 Q 10.5 13.75, 9.1 8.4 Z"
            fill="black"
          />
        </mask>
      </defs>
      <rect x="1.8" y="4.5" width="11.5" height="11.5" rx="2.6" fill={`url(#${uid}-l)`} />
      <g mask={`url(#${uid}-sm)`}>
        <rect x="10.7" y="8" width="11.5" height="11.5" rx="2.6" fill={`url(#${uid}-r)`} />
      </g>
    </svg>
  );
}
