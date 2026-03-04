'use client';

import { motion } from 'framer-motion';

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export function Gauge({ value, max = 100, label, size = 'md', color = 'blue' }: GaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: { width: 80, stroke: 6, font: 14 },
    md: { width: 120, stroke: 8, font: 18 },
    lg: { width: 160, stroke: 10, font: 24 },
  };
  
  const s = sizes[size];
  const radius = (s.width - s.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: { stroke: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)' },
    green: { stroke: '#22C55E', glow: 'rgba(34, 197, 94, 0.5)' },
    amber: { stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' },
    red: { stroke: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' },
    purple: { stroke: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.5)' },
  };

  const c = colorClasses[color];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: s.width, height: s.width }}>
        <svg
          width={s.width}
          height={s.width}
          viewBox={`0 0 ${s.width} ${s.width}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={s.width / 2}
            cy={s.width / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={s.stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx={s.width / 2}
            cy={s.width / 2}
            r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut', type: 'spring', stiffness: 50 }}
            style={{
              filter: `drop-shadow(0 0 ${s.stroke}px ${c.glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="font-bold text-white"
            style={{ fontSize: s.font }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
      <p className="text-sm text-white/50 mt-2">{label}</p>
    </div>
  );
}
