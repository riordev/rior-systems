'use client';

import { motion } from 'framer-motion';
import { 
  Key, 
  MessageSquare, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Save,
  Trash2,
  Plus
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useState } from 'react';

const initialApiKeys = [
  { id: 1, name: 'Production API Key', key: 'pk_live_51H...8x2m', created: '2024-01-15', lastUsed: '2 hours ago' },
  { id: 2, name: 'Staging API Key', key: 'pk_test_9xK...3mP', created: '2024-02-01', lastUsed: '1 day ago' },
];

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [showKey, setShowKey] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);
  const [discordWebhook, setDiscordWebhook] = useState('https://discord.com/api/webhooks/...');
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    discordAlerts: true,
    agentErrors: true,
    deploymentSuccess: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const copyKey = (id: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleShowKey = (id: number) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const regenerateKey = (id: number) => {
    // Simulate key regeneration
    setApiKeys(prev => prev.map(k => 
      k.id === id ? { ...k, key: `pk_live_${Math.random().toString(36).substring(7)}...${Math.random().toString(36).substring(7)}` } : k
    ));
  };

  const deleteKey = (id: number) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-white/50">Manage API keys, notifications, and system preferences</p>
      </motion.div>

      {/* API Keys Section */}
      <GlassCard delay={0.1}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                <Key className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">API Keys</h2>
                <p className="text-sm text-white/40">Manage access keys for external integrations</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Key
            </motion.button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((apiKey, index) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{apiKey.name}</h3>
                    <p className="text-sm text-white/40">Created {apiKey.created} • Last used {apiKey.lastUsed}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/10 font-mono text-sm">
                      <span className="text-white/60">
                        {showKey[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•')}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleShowKey(apiKey.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      {showKey[apiKey.id] ? (
                        <EyeOff className="w-4 h-4 text-white/60" />
                      ) : (
                        <Eye className="w-4 h-4 text-white/60" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyKey(apiKey.id, apiKey.key)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      {copied === apiKey.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/60" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => regenerateKey(apiKey.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      <RefreshCw className="w-4 h-4 text-white/60" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteKey(apiKey.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Discord Configuration */}
      <GlassCard delay={0.3}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Discord Integration</h2>
              <p className="text-sm text-white/40">Configure webhook for notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  className="glass-input flex-1"
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Test Connection</p>
                <p className="text-sm text-white/40">Send a test message to verify the webhook</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button text-sm"
              >
                Test Webhook
              </motion.button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Notification Preferences */}
      <GlassCard delay={0.4}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
              <p className="text-sm text-white/40">Choose what events trigger notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive critical alerts via email' },
              { key: 'discordAlerts', label: 'Discord Alerts', description: 'Send notifications to Discord webhook' },
              { key: 'agentErrors', label: 'Agent Errors', description: 'Get notified when agents encounter errors' },
              { key: 'deploymentSuccess', label: 'Deployment Success', description: 'Notify when client deployments complete' },
              { key: 'dailyReports', label: 'Daily Reports', description: 'Receive daily summary reports' },
              { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly analytics reports' },
            ].map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-medium text-white">{setting.label}</p>
                  <p className="text-sm text-white/40">{setting.description}</p>
                </div>
                <button
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    [setting.key]: !prev[setting.key as keyof typeof prev]
                  }))}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notificationSettings[setting.key as keyof typeof notificationSettings]
                      ? 'bg-green-500/30 border border-green-500/50' 
                      : 'bg-white/10 border border-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                    animate={{ 
                      left: notificationSettings[setting.key as keyof typeof notificationSettings] ? 30 : 4 
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Security Section */}
      <GlassCard delay={0.5}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/30 to-pink-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-white/40">Manage security settings and access controls</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Two-Factor Authentication</p>
                <p className="text-sm text-white/40">Add an extra layer of security</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button text-sm"
              >
                Enable 2FA
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Session Management</p>
                <p className="text-sm text-white/40">Active sessions: 2</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button text-sm"
              >
                View Sessions
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 border-red-500/20">
              <div>
                <p className="font-medium text-white">Danger Zone</p>
                <p className="text-sm text-white/40">Irreversible actions</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Delete Account
              </motion.button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
