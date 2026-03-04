'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Globe, 
  ShoppingBag, 
  Facebook, 
  Key,
  Bell,
  User,
  Mail,
  Building2,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useState } from 'react';

const steps = [
  { id: 1, title: 'Platform', description: 'Select integration' },
  { id: 2, title: 'Details', description: 'Client information' },
  { id: 3, title: 'Connect', description: 'API credentials' },
  { id: 4, title: 'Review', description: 'Confirm & deploy' },
];

const platforms = [
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: 'from-green-500/30 to-emerald-500/30' },
  { id: 'meta', name: 'Meta Ads', icon: Facebook, color: 'from-blue-500/30 to-cyan-500/30' },
  { id: 'google', name: 'Google Ads', icon: Globe, color: 'from-amber-500/30 to-orange-500/30' },
  { id: 'custom', name: 'Custom API', icon: Globe, color: 'from-purple-500/30 to-pink-500/30' },
];

export default function Deploy() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    clientName: '',
    clientEmail: '',
    companyName: '',
    apiKey: '',
    apiSecret: '',
    notifications: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1 && !formData.platform) {
      newErrors.platform = 'Please select a platform';
    }
    if (step === 2) {
      if (!formData.clientName) newErrors.clientName = 'Client name is required';
      if (!formData.clientEmail) newErrors.clientEmail = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = 'Invalid email';
    }
    if (step === 3) {
      if (!formData.apiKey) newErrors.apiKey = 'API Key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <GlassCard className="max-w-md w-full text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center glow-green"
          >
            <Check className="w-10 h-10 text-green-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Deployment Complete!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 mb-6"
          >
            {formData.clientName} has been successfully onboarded. The system is now collecting data.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button-primary w-full"
            onClick={() => window.location.href = '/clients'}
          >
            View Client
          </motion.button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Deploy New Client</h1>
        <p className="text-white/50">Set up a new client integration in minutes</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white glow-blue'
                    : 'bg-white/10 text-white/40 border border-white/10'
                }`}
                animate={currentStep === step.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </motion.div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-white/40'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-white/30">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Step Content */}
      <GlassCard delay={0.2}>
        <div className="p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white">Select Platform</h2>
                <p className="text-white/50">Choose the platform you want to integrate with</p>
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = formData.platform === platform.id;
                    return (
                      <motion.button
                        key={platform.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, platform: platform.id });
                          setErrors({ ...errors, platform: '' });
                        }}
                        className={`p-6 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-white/10 border-blue-500/50 glow-blue'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-white">{platform.name}</h3>
                        <p className="text-sm text-white/40 mt-1">Connect via API</p>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.platform && (
                  <p className="text-red-400 text-sm">{errors.platform}</p>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white">Client Information</h2>
                <p className="text-white/50">Enter the client&apos;s basic details</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Client Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => {
                          setFormData({ ...formData, clientName: e.target.value });
                          setErrors({ ...errors, clientName: '' });
                        }}
                        className="glass-input w-full pl-12"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.clientName && <p className="text-red-400 text-sm mt-1">{errors.clientName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => {
                          setFormData({ ...formData, clientEmail: e.target.value });
                          setErrors({ ...errors, clientEmail: '' });
                        }}
                        className="glass-input w-full pl-12"
                        placeholder="client@example.com"
                      />
                    </div>
                    {errors.clientEmail && <p className="text-red-400 text-sm mt-1">{errors.clientEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="glass-input w-full pl-12"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white">API Credentials</h2>
                <p className="text-white/50">Enter the API credentials for {platforms.find(p => p.id === formData.platform)?.name}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">API Key</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        value={formData.apiKey}
                        onChange={(e) => {
                          setFormData({ ...formData, apiKey: e.target.value });
                          setErrors({ ...errors, apiKey: '' });
                        }}
                        className="glass-input w-full pl-12"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                    {errors.apiKey && <p className="text-red-400 text-sm mt-1">{errors.apiKey}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">API Secret (Optional)</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        value={formData.apiSecret}
                        onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                        className="glass-input w-full pl-12"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Bell className="w-5 h-5 text-white/60" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Enable Notifications</p>
                      <p className="text-xs text-white/40">Receive alerts for this client</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        formData.notifications ? 'bg-green-500/30 border border-green-500/50' : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                        animate={{ left: formData.notifications ? 26 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white">Review & Deploy</h2>
                <p className="text-white/50">Verify the information before deploying</p>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-medium text-white/50 mb-3">Platform</h3>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const platform = platforms.find(p => p.id === formData.platform);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        return (
                          <>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-white">{platform.name}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-medium text-white/50 mb-3">Client Details</h3>
                    <div className="space-y-2">
                      <p className="text-white"><span className="text-white/40">Name:</span> {formData.clientName}</p>
                      <p className="text-white"><span className="text-white/40">Email:</span> {formData.clientEmail}</p>
                      <p className="text-white"><span className="text-white/40">Company:</span> {formData.companyName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-medium text-white/50 mb-3">Configuration</h3>
                    <p className="text-white">
                      <span className="text-white/40">Notifications:</span>{' '}
                      {formData.notifications ? (
                        <span className="text-green-400">Enabled</span>
                      ) : (
                        <span className="text-white/60">Disabled</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`glass-button flex items-center gap-2 ${
                currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>
            
            {currentStep < 4 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="glass-button-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeploy}
                disabled={isDeploying}
                className="glass-button-primary flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Deploy
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
