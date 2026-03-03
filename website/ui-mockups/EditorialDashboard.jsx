import React from 'react';

const EditorialDashboard = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex justify-between items-baseline">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Rior Systems</h1>
              <p className="text-slate-500 text-sm mt-1">Profit Intelligence Report</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Harbor Goods Co.</p>
              <p className="text-slate-400 text-sm">90-Day Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-8">
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-4">Executive Summary</p>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              True profit revealed: $56,685 over 90 days
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              After accounting for all costs — COGS, shipping, payment processing, and ad spend — 
              Harbor Goods Co. maintains a healthy 23.8% net profit margin. The brand is profitable 
              and positioned for sustainable scaling.
            </p>
          </div>
          <div className="col-span-4 space-y-6">
            <div className="bg-slate-50 p-6 border-l-4 border-sky-500">
              <p className="text-slate-500 text-sm">Net Profit Margin</p>
              <p className="text-4xl font-bold text-slate-900">23.8%</p>
            </div>
            <div className="bg-slate-50 p-6 border-l-4 border-amber-500">
              <p className="text-slate-500 text-sm">Blended ROAS</p>
              <p className="text-4xl font-bold text-slate-900">3.10x</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-px bg-slate-200 mb-16">
          {[
            { label: 'Total Revenue', value: '$237,876', sub: '↑ 12.4% growth' },
            { label: 'Ad Spend', value: '$76,854', sub: '32.3% of revenue' },
            { label: 'COGS', value: '$87,042', sub: '36.6% of revenue' },
            { label: 'True Profit', value: '$56,685', sub: '23.8% margin' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white p-6">
              <p className="text-slate-500 text-sm mb-2">{metric.label}</p>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-slate-400 text-sm mt-1">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Product Analysis */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Product Performance Analysis</h3>
          <div className="space-y-6">
            {[
              { 
                name: 'Dock Shorts', 
                status: 'STAR PERFORMER',
                statusColor: 'bg-green-100 text-green-800',
                roas: '3.4x',
                margin: '41%',
                insight: 'Exceeds break-even ROAS by 77%. Ready for aggressive scaling.'
              },
              { 
                name: 'Sailor Tee', 
                status: 'SOLID',
                statusColor: 'bg-sky-100 text-sky-800',
                roas: '2.8x',
                margin: '34%',
                insight: 'Profitable but approaching break-even threshold. Monitor closely.'
              },
              { 
                name: 'Anchor Hat', 
                status: 'ATTENTION NEEDED',
                statusColor: 'bg-amber-100 text-amber-800',
                roas: '1.6x',
                margin: '28%',
                insight: 'Below break-even ROAS. Review pricing or pause underperforming ads.'
              },
            ].map((product) => (
              <div key={product.name} className="border-b border-slate-200 pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <h4 className="text-xl font-bold">{product.name}</h4>
                    <span className={`px-3 py-1 text-xs font-medium ${product.statusColor}`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">{product.roas}</span>
                    <span className="text-slate-400 text-sm ml-2">ROAS</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed max-w-3xl">
                  <span className="font-medium">Margin: {product.margin}.</span> {product.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-slate-900 text-white p-8">
          <h3 className="text-xl font-bold mb-4">Strategic Recommendation</h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            Based on the 90-day analysis, reallocate 30% of Anchor Hat ad spend to Dock Shorts 
            campaigns. This shift alone could increase monthly profit by $8,000-$12,000 while 
            maintaining overall ROAS above 3.0x.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              Next review scheduled: 7 days • Data refreshed: 2 hours ago
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorialDashboard;
