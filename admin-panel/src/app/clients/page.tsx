'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Sparkline } from '@/components/Sparkline';
import { useState } from 'react';

const clients = [
  { 
    id: 1, 
    name: 'Nike', 
    domain: 'nike.com', 
    status: 'active', 
    profit: 45230, 
    profitChange: 12.5,
    profitData: [42000, 43000, 42500, 44000, 43500, 45000, 45230],
    platform: 'shopify',
    lastActive: '2 min ago'
  },
  { 
    id: 2, 
    name: 'Adidas', 
    domain: 'adidas.com', 
    status: 'active', 
    profit: 38900, 
    profitChange: -3.2,
    profitData: [40000, 39800, 39500, 39200, 39000, 38800, 38900],
    platform: 'shopify',
    lastActive: '5 min ago'
  },
  { 
    id: 3, 
    name: 'Puma', 
    domain: 'puma.com', 
    status: 'onboarding', 
    profit: 0, 
    profitChange: 0,
    profitData: [0, 0, 0, 0, 0, 0, 0],
    platform: 'meta',
    lastActive: '1 hour ago'
  },
  { 
    id: 4, 
    name: 'Under Armour', 
    domain: 'underarmour.com', 
    status: 'active', 
    profit: 28450, 
    profitChange: 8.7,
    profitData: [26000, 26500, 27000, 27200, 27800, 28200, 28450],
    platform: 'shopify',
    lastActive: '12 min ago'
  },
  { 
    id: 5, 
    name: 'Reebok', 
    domain: 'reebok.com', 
    status: 'pending', 
    profit: 0, 
    profitChange: 0,
    profitData: [0, 0, 0, 0, 0, 0, 0],
    platform: 'google',
    lastActive: '2 days ago'
  },
  { 
    id: 6, 
    name: 'New Balance', 
    domain: 'newbalance.com', 
    status: 'active', 
    profit: 32100, 
    profitChange: 15.3,
    profitData: [28000, 28500, 29500, 30500, 31200, 31800, 32100],
    platform: 'shopify',
    lastActive: '8 min ago'
  },
];

const statusConfig = {
  active: { color: 'bg-green-500', text: 'Active', glow: 'shadow-green-500/50' },
  pending: { color: 'bg-amber-500', text: 'Pending', glow: 'shadow-amber-500/50' },
  onboarding: { color: 'bg-blue-500', text: 'Onboarding', glow: 'shadow-blue-500/50' },
};

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Clients</h1>
          <p className="text-white/50">Manage your client accounts and monitor performance</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-12"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'onboarding'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <GlassCard key={client.id} delay={0.2 + index * 0.1}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl font-bold text-white">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <p className="text-sm text-white/40">{client.domain}</p>
                  </div>
                </div>
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <MoreVertical className="w-5 h-5 text-white/60" />
                  </motion.button>
                  <div className="absolute right-0 top-full mt-2 w-32 py-2 rounded-xl glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-2">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Platform */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[client.status as keyof typeof statusConfig].color} bg-opacity-20 text-white border border-white/10`}>
                  {statusConfig[client.status as keyof typeof statusConfig].text}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10 capitalize">
                  {client.platform}
                </span>
              </div>

              {/* Profit Section */}
              {client.status === 'active' && (
                <div className="mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-sm text-white/40">Monthly Profit</p>
                      <p className="text-2xl font-bold text-white">
                        ${client.profit.toLocaleString()}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      client.profitChange > 0 ? 'text-green-400' : 
                      client.profitChange < 0 ? 'text-red-400' : 'text-white/40'
                    }`}>
                      {client.profitChange > 0 ? <TrendingUp className="w-4 h-4" /> : 
                       client.profitChange < 0 ? <TrendingDown className="w-4 h-4" /> : 
                       <Minus className="w-4 h-4" />}
                      {Math.abs(client.profitChange)}%
                    </div>
                  </div>
                  <Sparkline 
                    data={client.profitData} 
                    color={client.profitChange >= 0 ? '#22C55E' : '#EF4444'}
                    width={280}
                    height={40}
                  />
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <p className="text-xs text-white/40">Last active: {client.lastActive}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4 text-white/60" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <Edit2 className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
