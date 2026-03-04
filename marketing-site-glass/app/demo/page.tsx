"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Target,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  Scale,
} from "lucide-react";

// Harbor Goods Demo Data
const harborData = {
  brand: { name: "Harbor Goods Co.", tagline: "Heritage-inspired goods for modern life" },
  summary: {
    revenue: 237876,
    netProfit: 56685,
    profitMargin: 23.8,
    blendedROAS: 3.10,
    breakEvenROAS: 1.92,
    adSpend: 76734,
    orders: 3247,
    aov: 73.26,
  },
  campaignROAS: [
    { name: "Meta Prospecting", roas: 2.8, target: 3.0, spend: 28500 },
    { name: "Meta Retargeting", roas: 4.5, target: 4.0, spend: 12200 },
    { name: "Google Brand", roas: 8.2, target: 8.0, spend: 6900 },
    { name: "Google Non-Brand", roas: 2.3, target: 2.5, spend: 9200 },
    { name: "Google Shopping", roas: 3.4, target: 3.0, spend: 6900 },
    { name: "TikTok", roas: 1.9, target: 2.0, spend: 6500 },
  ],
  products: [
    { id: "sailor-tee", name: "Sailor Tee", price: 48, margin: 56.9, revenue: 89456, roas: 3.4, signal: "scale", emoji: "👕" },
    { id: "dock-shorts", name: "Dock Shorts", price: 68, margin: 57.6, revenue: 95680, roas: 2.9, signal: "scale", emoji: "🩳" },
    { id: "anchor-hat", name: "Anchor Hat", price: 38, margin: 55.8, revenue: 52740, roas: 2.7, signal: "watch", emoji: "🧢" },
  ],
  alerts: [
    { id: "1", type: "scale", title: "Scale Signal: Sailor Tee", message: "ROAS at 3.4x — increase budget 20%", time: "2h ago" },
    { id: "2", type: "warning", title: "Underperformance: TikTok", message: "ROAS at 1.9x (below 2.0x target)", time: "4h ago" },
    { id: "3", type: "info", title: "Daily Profit Target Met", message: "$1,890 profit exceeds $1,500 target", time: "8h ago" },
  ],
};

const dateRanges = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatROAS(value: number): string {
  return `${value.toFixed(2)}x`;
}

export default function DemoPage() {
  const [dateRange, setDateRange] = useState("90d");
  const { summary, products, alerts, campaignROAS } = harborData;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-24">
      {/* Header */}
      <section className="px-6 py-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-sm text-blue-300">Live Demo Data</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Try Harbor Goods Demo
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See how profit intelligence works with sample data from a fictional Shopify brand
            </p>
          </motion.div>

          {/* Date Range Selector */}
          <div className="flex justify-center">
            <div className="flex glass-card p-1">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    dateRange === range.value
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <DollarSign size={18} className="text-blue-400" />
              </div>
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                <ArrowUpRight size={14} /> 12.5%
              </span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.revenue)}</div>
            <div className="text-sm text-white/50">Total Revenue</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                <ArrowUpRight size={14} /> 8.3%
              </span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.netProfit)}</div>
            <div className="text-sm text-white/50">Net Profit</div>
            <div className="text-xs text-emerald-400 mt-1">{summary.profitMargin}% margin</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Target size={18} className="text-purple-400" />
              </div>
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                <ArrowUpRight size={14} /> 5.2%
              </span>
            </div>
            <div className="text-2xl font-bold">{formatROAS(summary.blendedROAS)}</div>
            <div className="text-sm text-white/50">Blended ROAS</div>
            <div className="text-xs text-emerald-400 mt-1">Break-even: {formatROAS(summary.breakEvenROAS)}</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <ShoppingCart size={18} className="text-amber-400" />
              </div>
              <span className="text-white/40 text-sm flex items-center gap-1">
                <ArrowDownRight size={14} /> 2.1%
              </span>
            </div>
            <div className="text-2xl font-bold">{summary.orders.toLocaleString()}</div>
            <div className="text-sm text-white/50">Total Orders</div>
            <div className="text-xs text-white/40 mt-1">AOV: {formatCurrency(summary.aov)}</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Product Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Scale size={18} className="text-blue-400" />
              Product Performance
            </h3>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{product.emoji}</span>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-white/50">{formatCurrency(product.revenue)} revenue</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${product.signal === "scale" ? "text-emerald-400" : "text-amber-400"}`}>
                      {formatROAS(product.roas)}
                    </div>
                    <div className="text-xs text-white/40 capitalize">{product.signal} signal</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Campaign ROAS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-400" />
              Campaign ROAS
            </h3>
            <div className="space-y-3">
              {campaignROAS.map((campaign) => (
                <div key={campaign.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{campaign.name}</span>
                    <span className={campaign.roas >= campaign.target ? "text-emerald-400" : "text-amber-400"}>
                      {formatROAS(campaign.roas)}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        campaign.roas >= campaign.target ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min((campaign.roas / 4) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-400" />
            Recent Alerts
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.type === "scale"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : alert.type === "warning"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-blue-500/10 border-blue-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === "scale" ? (
                    <CheckCircle size={18} className="text-emerald-400 mt-0.5" />
                  ) : alert.type === "warning" ? (
                    <AlertCircle size={18} className="text-amber-400 mt-0.5" />
                  ) : (
                    <Calendar size={18} className="text-blue-400 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{alert.title}</div>
                    <div className="text-sm text-white/60 mt-1">{alert.message}</div>
                    <div className="text-xs text-white/40 mt-2">{alert.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 px-6 py-4 backdrop-blur-xl bg-slate-900/90 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-semibold">Want this for your store?</div>
            <div className="text-sm text-white/60">Get your own profit intelligence dashboard</div>
          </div>
          <a
            href="https://calendly.com/thomas-rior/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition flex items-center gap-2"
          >
            Book a 20-minute call
            <ArrowUpRight size={18} />
          </a>
        </div>
      </motion.div>
    </main>
  );
}
