'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Zap, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  FileText,
  ChevronRight,
  TrendingUp,
  Server,
  Rocket
} from 'lucide-react';
import { GlassCard, StatCard } from '@/components/GlassCard';
import { Gauge } from '@/components/Gauge';

const agentStatuses = [
  { name: 'Data Ingestion', status: 'running', cpu: 23, memory: 45 },
  { name: 'Analytics Engine', status: 'running', cpu: 67, memory: 78 },
  { name: 'Report Generator', status: 'stopped', cpu: 0, memory: 0 },
  { name: 'Discord Bot', status: 'running', cpu: 12, memory: 23 },
  { name: 'Shopify Sync', status: 'error', cpu: 0, memory: 0 },
];

const recentAlerts = [
  { id: 1, type: 'warning', message: 'High CPU usage on Analytics Engine', time: '2 min ago' },
  { id: 2, type: 'success', message: 'Client "Nike" deployment complete', time: '15 min ago' },
  { id: 3, type: 'error', message: 'Shopify API rate limit exceeded', time: '1 hour ago' },
  { id: 4, type: 'info', message: 'Daily backup completed successfully', time: '3 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-white/50">Real-time system overview and metrics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Clients"
          value="12"
          change="3 this month"
          changeType="positive"
          icon={<Users className="w-6 h-6 text-blue-400" />}
          delay={0.1}
          glowColor="blue"
        />
        <StatCard
          title="Active Agents"
          value="8"
          change="2 stopped"
          changeType="neutral"
          icon={<Zap className="w-6 h-6 text-purple-400" />}
          delay={0.2}
          glowColor="purple"
        />
        <StatCard
          title="Total Revenue"
          value="$24.5K"
          change="12.5%"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
          delay={0.3}
          glowColor="green"
        />
        <StatCard
          title="System Health"
          value="98.5%"
          change="0.2%"
          changeType="negative"
          icon={<Activity className="w-6 h-6 text-amber-400" />}
          delay={0.4}
          glowColor="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <GlassCard className="lg:col-span-2" delay={0.5}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Sub-Agent Status</h2>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 status-running" />
                  {agentStatuses.filter(a => a.status === 'running').length} Running
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {agentStatuses.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      agent.status === 'running' ? 'bg-green-500 status-running' :
                      agent.status === 'error' ? 'bg-red-500 status-error' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-sm text-white/40 capitalize">{agent.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {agent.status === 'running' && (
                      <>
                        <div className="text-right">
                          <p className="text-sm text-white/60">CPU</p>
                          <p className="text-sm font-medium text-white">{agent.cpu}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/60">Memory</p>
                          <p className="text-sm font-medium text-white">{agent.memory}%</p>
                        </div>
                      </>
                    )}
                    <div className="flex gap-2">
                      {agent.status === 'stopped' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                          <Play className="w-4 h-4" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20"
                      >
                        <FileText className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* System Gauges */}
        <GlassCard delay={0.6}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">System Resources</h2>
            <div className="flex flex-col items-center gap-8">
              <Gauge value={67} label="CPU Usage" size="lg" color="blue" />
              <Gauge value={45} label="Memory Usage" size="lg" color="purple" />
              <Gauge value={23} label="Storage" size="lg" color="green" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <GlassCard delay={0.7}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Recent Alerts
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    alert.type === 'success' ? 'bg-green-500 status-running' :
                    alert.type === 'warning' ? 'bg-amber-500 status-warning' :
                    alert.type === 'error' ? 'bg-red-500 status-error' :
                    'bg-blue-500 glow-blue'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{alert.message}</p>
                    <p className="text-xs text-white/40 mt-1">{alert.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard delay={0.8}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Rocket, label: 'Deploy Client', color: 'from-blue-500/30 to-purple-500/30' },
                { icon: RotateCcw, label: 'Restart All', color: 'from-amber-500/30 to-orange-500/30' },
                { icon: FileText, label: 'View Logs', color: 'from-green-500/30 to-emerald-500/30' },
                { icon: Server, label: 'System Check', color: 'from-purple-500/30 to-pink-500/30' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
