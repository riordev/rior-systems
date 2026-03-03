import React from 'react';

const GlassDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      {/* Glass Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Rior Systems
            </h1>
            <p className="text-white/50 text-sm">Harbor Goods Co.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              Last 90 days
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold">
              HG
            </div>
          </div>
        </div>
      </div>

      {/* Hero Metric with Large Glass Card */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <p className="text-white/50 text-sm mb-2">True Net Profit</p>
            <div className="text-7xl font-bold bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
              $56,685
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30">
                ↑ 23.8%
              </span>
              <span className="text-white/40 text-sm">$238k revenue · $77k ad spend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Revenue', value: '$238k', change: '+12.4%', good: true },
          { label: 'ROAS', value: '3.10x', change: '+0.4x', good: true },
          { label: 'CAC', value: '$63.58', change: '+$4.20', good: false },
          { label: 'AOV', value: '$124.90', change: '+$8.40', good: true },
        ].map((metric) => (
          <div key={metric.label} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-5">
            <p className="text-white/40 text-xs mb-1">{metric.label}</p>
            <p className="text-2xl font-semibold text-white">{metric.value}</p>
            <p className={`text-xs mt-1 ${metric.good ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Product Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
        {[
          { name: 'Sailor Tee', profit: '$18.4k', margin: '34%', roas: '2.8x', color: 'from-blue-400/20 to-blue-600/20' },
          { name: 'Dock Shorts', profit: '$24.1k', margin: '41%', roas: '3.4x', color: 'from-green-400/20 to-green-600/20' },
          { name: 'Anchor Hat', profit: '$8.2k', margin: '28%', roas: '1.6x', color: 'from-amber-400/20 to-amber-600/20' },
        ].map((product) => (
          <div key={product.name} className={`backdrop-blur-xl bg-gradient-to-br ${product.color} rounded-2xl border border-white/10 p-6`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-white">{product.name}</h3>
              <span className="text-2xl font-bold text-white">{product.roas}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Profit</span>
                <span className="text-white font-medium">{product.profit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Margin</span>
                <span className="text-white font-medium">{product.margin}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Alert */}
      <div className="fixed bottom-6 right-6 backdrop-blur-xl bg-green-500/10 rounded-2xl border border-green-500/30 p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <p className="text-green-300 text-sm">Dock Shorts exceeded break-even ROAS by 45% for 3 days — scale signal active</p>
        </div>
      </div>
    </div>
  );
};

export default GlassDashboard;
