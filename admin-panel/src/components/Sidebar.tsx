'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Rocket,
  Cpu,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/deploy', label: 'Deploy', icon: Rocket },
  { href: '/agents', label: 'Agents', icon: Cpu },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-50 glass-card border-r border-white/10"
      initial={{ width: 80 }}
      animate={{ width: isExpanded ? 288 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full py-6">
        {/* Logo */}
        <div className="px-5 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 glow-blue">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-lg font-semibold gradient-text">Rior Systems</h1>
              <p className="text-xs text-white/40">Admin Panel</p>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30' : ''}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/60'}`} />
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden whitespace-nowrap text-sm font-medium ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {item.label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="px-5 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 status-running" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-50" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-white/40">System Online</p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">99.9%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
