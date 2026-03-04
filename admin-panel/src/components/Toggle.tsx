'use client';

import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Toggle({ checked, onChange, size = 'md', label }: ToggleProps) {
  const sizes = {
    sm: { width: 40, height: 22, knob: 16 },
    md: { width: 52, height: 28, knob: 22 },
    lg: { width: 64, height: 34, knob: 28 },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <motion.button
        className={`relative rounded-full transition-colors duration-300 ${
          checked 
            ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/40 border border-green-500/50' 
            : 'bg-white/10 border border-white/20'
        }`}
        style={{ width: s.width, height: s.height }}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg"
          style={{ width: s.knob, height: s.knob }}
          initial={false}
          animate={{
            left: checked ? s.width - s.knob - 3 : 3,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
      {label && (
        <span className={`text-sm ${checked ? 'text-green-400' : 'text-white/50'}`}>
          {checked ? 'Active' : 'Stopped'}
        </span>
      )}
    </div>
  );
}
