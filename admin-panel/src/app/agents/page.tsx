'use client';

import { motion } from 'framer-motion';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Search,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Toggle } from '@/components/Toggle';
import { useState } from 'react';

const agents = [
  { 
    id: 1, 
    name: 'Data Ingestion Service', 
    description: 'Collects data from Shopify APIs',
    status: 'running', 
    cpu: 23, 
    memory: 45,
    uptime: '3d 12h 45m',
    lastRun: '2 min ago',
    type: 'core',
    autoRestart: true
  },
  { 
    id: 2, 
    name: 'Analytics Engine', 
    description: 'Processes profit calculations',
    status: 'running', 
    cpu: 67, 
    memory: 78,
    uptime: '5d 8h 22m',
    lastRun: '5 min ago',
    type: 'core',
    autoRestart: true
  },
  { 
    id: 3, 
    name: 'Report Generator', 
    description: 'Generates daily/weekly reports',
    status: 'stopped', 
    cpu: 0, 
    memory: 0,
    uptime: '0d 0h 0m',
    lastRun: '2 hours ago',
    type: 'scheduled',
    autoRestart: false
  },
  { 
    id: 4, 
    name: 'Discord Bot', 
    description: 'Handles notifications and commands',
    status: 'running', 
    cpu: 12, 
    memory: 23,
    uptime: '12d 4h 18m',
    lastRun: 'Just now',
    type: 'service',
    autoRestart: true
  },
  { 
    id: 5, 
    name: 'Shopify Sync', 
    description: 'Syncs orders and inventory',
    status: 'error', 
    cpu: 0, 
    memory: 0,
    uptime: '0d 0h 15m',
    lastRun: '15 min ago',
    type: 'core',
    autoRestart: true
  },
  { 
    id: 6, 
    name: 'Email Worker', 
    description: 'Processes outbound emails',
    status: 'running', 
    cpu: 8, 
    memory: 15,
    uptime: '7d 2h 33m',
    lastRun: '1 min ago',
    type: 'service',
    autoRestart: true
  },
  { 
    id: 7, 
    name: 'Backup Service', 
    description: 'Daily database backups',
    status: 'running', 
    cpu: 5, 
    memory: 12,
    uptime: '1d 6h 12m',
    lastRun: '4 hours ago',
    type: 'scheduled',
    autoRestart: false
  },
  { 
    id: 8, 
    name: 'Webhook Handler', 
    description: 'Processes incoming webhooks',
    status: 'running', 
    cpu: 15, 
    memory: 28,
    uptime: '9d 14h 55m',
    lastRun: '30 sec ago',
    type: 'service',
    autoRestart: true
  },
];

const logs = [
  { timestamp: '2024-03-03 22:18:32', level: 'info', message: 'Analytics Engine: Processing batch #4521' },
  { timestamp: '2024-03-03 22:17:45', level: 'success', message: 'Data Ingestion: Completed sync for Nike' },
  { timestamp: '2024-03-03 22:16:12', level: 'warning', message: 'Shopify Sync: Rate limit approaching (85%)' },
  { timestamp: '2024-03-03 22:15:33', level: 'error', message: 'Shopify Sync: Connection timeout after 30s' },
  { timestamp: '2024-03-03 22:14:20', level: 'info', message: 'Discord Bot: Received command from user #1234' },
  { timestamp: '2024-03-03 22:12:08', level: 'success', message: 'Report Generator: Daily report sent to 12 clients' },
  { timestamp: '2024-03-03 22:10:45', level: 'info', message: 'Backup Service: Starting daily backup' },
  { timestamp: '2024-03-03 22:08:12', level: 'info', message: 'Webhook Handler: Received order webhook from Shopify' },
  { timestamp: '2024-03-03 22:05:33', level: 'warning', message: 'Analytics Engine: High memory usage detected (82%)' },
  { timestamp: '2024-03-03 22:02:18', level: 'success', message: 'Email Worker: Sent 45 notification emails' },
];

const statusConfig = {
  running: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  stopped: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const typeColors = {
  core: 'from-blue-500/30 to-purple-500/30',
  service: 'from-green-500/30 to-emerald-500/30',
  scheduled: 'from-amber-500/30 to-orange-500/30',
};

export default function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [agentList, setAgentList] = useState(agents);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAgent = (id: number) => {
    setAgentList(prev => prev.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === 'running' ? 'stopped' : 'running';
        return { 
          ...agent, 
          status: newStatus,
          cpu: newStatus === 'running' ? Math.floor(Math.random() * 50) + 10 : 0,
          memory: newStatus === 'running' ? Math.floor(Math.random() * 60) + 20 : 0,
        };
      }
      return agent;
    }));
  };

  const filteredAgents = agentList.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const runningCount = agentList.filter(a => a.status === 'running').length;
  const errorCount = agentList.filter(a => a.status === 'error').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Agent Control</h1>
          <p className="text-white/50">Manage and monitor all sub-agents</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 status-running" />
            <span className="text-sm text-white/70">{runningCount} Running</span>
          </div>
          {errorCount > 0 && (
            <div className="glass-card px-4 py-2 flex items-center gap-2 border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-500 status-error" />
              <span className="text-sm text-red-400">{errorCount} Error</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-12"
          />
        </div>
      </motion.div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Sub-Agents</h2>
          {filteredAgents.map((agent, index) => {
            const isSelected = selectedAgent === agent.id;
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => setSelectedAgent(agent.id)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  isSelected ? 'border-blue-500/50 bg-white/10' : 'hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColors[agent.type as keyof typeof typeColors]} flex items-center justify-center`}>
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{agent.name}</h3>
                      <p className="text-sm text-white/40">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Toggle
                      checked={agent.status === 'running'}
                      onChange={() => toggleAgent(agent.id)}
                      size="sm"
                    />
                  </div>
                </div>
                
                {agent.status === 'running' && (
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/60">CPU: {agent.cpu}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-white/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-sm bg-white/60" />
                      </div>
                      <span className="text-sm text-white/60">Memory: {agent.memory}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/60">{agent.uptime}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Selected Agent Details & Logs */}
        <div className="space-y-6">
          {selectedAgent ? (
            <>
              {/* Agent Details */}
              <GlassCard delay={0.3}>
                <div className="p-6">
                  {(() => {
                    const agent = agentList.find(a => a.id === selectedAgent);
                    if (!agent) return null;
                    const status = statusConfig[agent.status as keyof typeof statusConfig];
                    const StatusIconComponent = status.icon;
                    
                    return (
                      <>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeColors[agent.type as keyof typeof typeColors]} flex items-center justify-center`}>
                              <Cpu className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-1 ${status.bg} ${status.border} border`}>
                                <StatusIconComponent className={`w-4 h-4 ${status.color}`} />
                                <span className={status.color}>{agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                              onClick={() => toggleAgent(agent.id)}
                            >
                              {agent.status === 'running' ? (
                                <Pause className="w-5 h-5 text-white" />
                              ) : (
                                <Play className="w-5 h-5 text-white" />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                              <RotateCcw className="w-5 h-5 text-white" />
                            </motion.button>
                          </div>
                        </div>

                        {agent.status === 'running' && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                              <p className="text-2xl font-bold text-white">{agent.cpu}%</p>
                              <p className="text-xs text-white/40 mt-1">CPU Usage</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                              <p className="text-2xl font-bold text-white">{agent.memory}%</p>
                              <p className="text-xs text-white/40 mt-1">Memory</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                              <p className="text-lg font-bold text-white">{agent.uptime}</p>
                              <p className="text-xs text-white/40 mt-1">Uptime</p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </GlassCard>

              {/* Logs */}
              <GlassCard delay={0.4}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-white/60" />
                      Recent Logs
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">Info</span>
                      <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">Warning</span>
                      <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">Error</span>
                    </div>
                  </div>
                  <div className="terminal max-h-64 overflow-y-auto">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className="terminal-line text-sm font-mono"
                      >
                        <span className="text-white/30">{log.timestamp}</span>
                        <span className={`mx-2 ${
                          log.level === 'error' ? 'text-red-400' :
                          log.level === 'warning' ? 'text-amber-400' :
                          log.level === 'success' ? 'text-green-400' :
                          'text-blue-400'
                        }`}>
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="text-white/70">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="h-96 flex items-center justify-center" delay={0.3}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/50">Select an agent to view details</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
