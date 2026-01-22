'use client';

interface FlowReadIconProps {
  size?: number;
  className?: string;
}

export function FlowReadIcon({ size = 32, className = '' }: FlowReadIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 流れを表す3本の波線 */}
      <path
        d="M4 10C8 10 8 14 12 14C16 14 16 10 20 10C24 10 24 14 28 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-blue-500"
      />
      <path
        d="M4 16C8 16 8 20 12 20C16 20 16 16 20 16C24 16 24 20 28 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-cyan-500"
      />
      <path
        d="M4 22C8 22 8 26 12 26C16 26 16 22 20 22C24 22 24 26 28 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-blue-400"
      />
    </svg>
  );
}
