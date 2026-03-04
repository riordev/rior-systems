import React from 'react';

const AmberDashboard = () => {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#292524] font-sans p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="text-3xl font-serif font-semibold text-[#292524]">Rior Systems</h1>
          <span className="text-[#78716c] text-sm">Profit Intelligence for Harbor Goods Co.</span>
        </div>
        <p className="text-[#78716c] text-sm">Your profit story, told with clarity.</p>
      </div>

      {/* Hero Metric */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e7e5e4] p-8">
          <div className="text-[#78716c] text-sm mb-2">True Net Profit — Last 90 Days</div>
          <div className="text-6xl font-serif font-light text-[#292524] mb-4">
            $56,685
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#059669] font-medium">↑ 23.8%</span>
            <span className="text-[#78716c] text-sm">from previous period</span>
          </div>
          <p className="mt-6 text-[#57534e] leading-relaxed">
            After accounting for COGS (36.6%), shipping, payment processing, and ad spend, 
            your true profit margin is 23.8%. This is the money that actually hit your bank account.
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e7e5e4]">
          <div className="text-[#78716c] text-sm mb-2">Revenue</div>
          <div className="text-2xl font-semibold text-[#292524]">$237,876</div>
          <div className="text-[#059669] text-sm mt-1">↑ 12.4%</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e7e5e4]">
          <div className="text-[#78716c] text-sm mb-2">Blended ROAS</div>
          <div className="text-2xl font-semibold text-[#292524]">3.10x</div>
          <div className="text-[#059669] text-sm mt-1">↑ 0.4x</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e7e5e4]">
          <div className="text-[#78716c] text-sm mb-2">Break-Even ROAS</div>
          <div className="text-2xl font-semibold text-[#292524]">1.92x</div>
          <div className="text-[#059669] text-sm mt-1">↓ 0.08x (better)</div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-serif font-semibold text-[#292524] mb-6">Your Products</h2>
        <div className="space-y-4">
          {[
            { name: 'Sailor Tee', margin: '34%', roas: '2.8x', status: 'Profitable', color: 'bg-[#059669]' },
            { name: 'Dock Shorts', margin: '41%', roas: '3.4x', status: 'Scale Ready', color: 'bg-[#d97706]' },
            { name: 'Anchor Hat', margin: '28%', roas: '1.6x', status: 'Needs Attention', color: 'bg-[#dc2626]' },
          ].map((product) => (
            <div key={product.name} className="bg-white rounded-xl p-6 shadow-sm border border-[#e7e5e4] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${product.color}`}></div>
                <div>
                  <h3 className="font-semibold text-[#292524]">{product.name}</h3>
                  <p className="text-[#78716c] text-sm">Margin: {product.margin}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-serif text-[#292524]">{product.roas}</div>
                <div className="text-[#78716c] text-sm">{product.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-[#e7e5e4]">
        <p className="text-[#a8a29e] text-sm italic">
          "Most founders don't know their true profit until they see it laid out like this. 
          You're doing better than you think."
        </p>
      </div>
    </div>
  );
};

export default AmberDashboard;
