'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = true, delay = 0, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
  delay?: number;
  glowColor?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, delay = 0, glowColor = 'blue' }: StatCardProps) {
  const glowClasses = {
    blue: 'from-blue-500/20 to-purple-500/20',
    green: 'from-green-500/20 to-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/20',
    red: 'from-red-500/20 to-pink-500/20',
    purple: 'from-purple-500/20 to-pink-500/20',
  };

  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-white/60',
  };

  return (
    <GlassCard delay={delay}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/50 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            {change && (
              <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
                {changeType === 'positive' && '+'}{change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${glowClasses[glowColor]} border border-white/10`}>
            {icon}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
