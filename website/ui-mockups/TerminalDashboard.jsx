import React from 'react';

const TerminalDashboard = () => {
  const metrics = [
    { label: 'Net Profit', value: '$56,685', change: '+23.8%', positive: true },
    { label: 'Revenue', value: '$237,876', change: '+12.4%', positive: true },
    { label: 'Blended ROAS', value: '3.10x', change: '+0.4x', positive: true },
    { label: 'Break-Even ROAS', value: '1.92x', change: '-0.08x', positive: true },
    { label: 'CAC', value: '$63.58', change: '+$4.20', positive: false },
    { label: 'Ad Spend', value: '$76,854', change: '+8.2%', positive: false },
  ];

  const products = [
    { sku: 'HG-SAIL-001', name: 'Sailor Tee', margin: '34%', roas: '2.8x', signal: 'scale' },
    { sku: 'HG-DOCK-002', name: 'Dock Shorts', margin: '41%', roas: '3.4x', signal: 'scale' },
    { sku: 'HG-ANCHOR-003', name: 'Anchor Hat', margin: '28%', roas: '1.6x', signal: 'watch' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-mono text-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-[#262626] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">rior.systems</h1>
          <p className="text-[#a1a1aa] text-xs mt-1">Harbor Goods Co. — Last 90 days</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-[#22c55e]">● Live</span>
          <span className="text-[#a1a1aa]">v2.4.1</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#141414] border border-[#262626] p-4">
            <div className="text-[#a1a1aa] text-xs mb-1">{m.label}</div>
            <div className="text-2xl font-bold">{m.value}</div>
            <div className={`text-xs mt-1 ${m.positive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Product Performance */}
      <div className="bg-[#141414] border border-[#262626]">
        <div className="flex justify-between items-center p-4 border-b border-[#262626]">
          <h2 className="font-bold">Product Performance</h2>
          <span className="text-[#a1a1aa] text-xs">3 SKUs tracked</span>
        </div>
        <table className="w-full text-left">
          <thead className="text-[#a1a1aa] text-xs border-b border-[#262626]">
            <tr>
              <th className="p-4 font-normal">SKU</th>
              <th className="p-4 font-normal">Product</th>
              <th className="p-4 font-normal">Margin</th>
              <th className="p-4 font-normal">ROAS</th>
              <th className="p-4 font-normal">Signal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.sku} className="border-b border-[#262626] last:border-0">
                <td className="p-4 text-[#a1a1aa]">{p.sku}</td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.margin}</td>
                <td className="p-4">{p.roas}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs ${
                    p.signal === 'scale' 
                      ? 'bg-[#22c55e]/10 text-[#22c55e]' 
                      : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                  }`}>
                    {p.signal.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alerts */}
      <div className="mt-4 p-4 bg-[#141414] border border-[#262626]">
        <div className="text-[#a1a1aa] text-xs mb-2">ACTIVE ALERTS (2)</div>
        <div className="text-[#22c55e]">● Sailor Tee ROAS exceeded break-even by 45% for 3 days</div>
        <div className="text-[#f59e0b] mt-1">● Anchor Hat ROAS below break-even threshold</div>
      </div>
    </div>
  );
};

export default TerminalDashboard;
