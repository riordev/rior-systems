"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  ShoppingBag, 
  BarChart3, 
  DollarSign, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check
} from "lucide-react";

const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Shopify", icon: ShoppingBag },
  { id: 3, title: "Ad Platforms", icon: BarChart3 },
  { id: 4, title: "COGS & Costs", icon: DollarSign },
  { id: 5, title: "Review", icon: CheckCircle },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    shopifyUrl: "",
    adSpend: "",
    shopifyConnected: false,
    metaConnected: false,
    googleConnected: false,
    cogsMethod: "percentage",
    cogsPercentage: "35",
    shippingCost: "5",
    processingFee: "2.9",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateForm = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.email && formData.shopifyUrl && formData.adSpend;
      case 2:
        return formData.shopifyConnected;
      case 3:
        return formData.metaConnected || formData.googleConnected;
      case 4:
        return formData.cogsPercentage && formData.shippingCost && formData.processingFee;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
    setIsSubmitting(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're all set!</h1>
          <p className="text-white/60 mb-8">
            We'll build your profit dashboard in 24-48 hours. Check your email for confirmation.
          </p>
          <div className="space-y-4">
            <a 
              href="https://calendly.com/thomas-rior/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-blue-500 hover:bg-blue-400 rounded-xl font-medium transition"
            >
              Book your kickoff call
            </a>
            <a 
              href="https://rior-systems.vercel.app"
              className="block w-full py-4 backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl font-medium hover:bg-white/10 transition"
            >
              Back to website
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Get your profit dashboard</h1>
          <p className="text-white/60">5 minutes to connect your store. Live in 24-48 hours.</p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                  currentStep > step.id 
                    ? 'step-completed text-green-400' 
                    : currentStep === step.id 
                    ? 'step-active text-blue-400' 
                    : 'bg-white/5 border-white/20 text-white/40'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-white/40'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h2 className="text-xl font-semibold mb-6">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateForm('businessName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Your Brand Co."
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Shopify Store URL</label>
                  <input
                    type="text"
                    value={formData.shopifyUrl}
                    onChange={(e) => updateForm('shopifyUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="your-store.myshopify.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Monthly Ad Spend</label>
                  <select
                    value={formData.adSpend}
                    onChange={(e) => updateForm('adSpend', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select range...</option>
                    <option value="10k-20k">$10,000 - $20,000</option>
                    <option value="20k-50k">$20,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h2 className="text-xl font-semibold mb-6">Connect Shopify</h2>
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-green-400" />
                      <span className="font-medium">Shopify</span>
                    </div>
                    {formData.shopifyConnected ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected</span>
                    ) : (
                      <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-sm">Not connected</span>
                    )}
                  </div>
                  {!formData.shopifyConnected ? (
                    <button
                      onClick={() => updateForm('shopifyConnected', true)}
                      className="w-full py-3 bg-green-500 hover:bg-green-400 rounded-xl font-medium transition"
                    >
                      Connect with Shopify
                    </button>
                  ) : (
                    <div className="text-center text-green-400">
                      <Check className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Successfully connected to {formData.shopifyUrl}</p>
                    </div>
                  )}
                </div>
                <div className="text-sm text-white/40">
                  <p>Or enter API credentials manually:</p>
                  <input
                    type="text"
                    placeholder="API Key"
                    className="mt-2 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl"
                  />
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
              className="glass-card p-8"
            >
              <h2 className="text-xl font-semibold mb-6">Connect Ad Platforms</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Meta (Facebook/Instagram)</span>
                    {formData.metaConnected ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <button
                        onClick={() => updateForm('metaConnected', true)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm transition"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Google Ads</span>
                    {formData.googleConnected ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <button
                        onClick={() => updateForm('googleConnected', true)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm transition"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-white/40 text-center">Connect at least one ad platform to proceed</p>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h2 className="text-xl font-semibold mb-6">COGS & Costs</h2>
              <div className="space-y-6">
                <div className="p-4 border-2 border-dashed border-white/20 rounded-xl text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-white/40" />
                  <p className="text-sm text-white/60">Upload COGS spreadsheet (CSV)</p>
                  <button className="mt-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition">
                    Download Template
                  </button>
                </div>
                <div className="text-center text-white/40">— or enter manually —</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">COGS %</label>
                    <input
                      type="number"
                      value={formData.cogsPercentage}
                      onChange={(e) => updateForm('cogsPercentage', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Shipping $</label>
                    <input
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) => updateForm('shippingCost', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Processing %</label>
                    <input
                      type="number"
                      value={formData.processingFee}
                      onChange={(e) => updateForm('processingFee', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Business</span>
                  <span>{formData.businessName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Email</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Shopify</span>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Ad Platforms</span>
                  <span>
                    {formData.metaConnected && "Meta "}
                    {formData.googleConnected && "Google "}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">COGS</span>
                  <span>{formData.cogsPercentage}%</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-sm text-center">
                  By submitting, you agree to our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-xl font-medium hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-xl font-medium hover:bg-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-xl font-medium hover:bg-green-400 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
