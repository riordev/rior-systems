import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata = {
  title: "Case Studies | Rior Systems",
  description: "See how Shopify brands transformed their profitability with Rior Systems.",
};

export default function CaseStudies() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />
      
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 p-4 inline-flex items-center gap-3 mb-8">
            <span className="text-slate-300 text-sm">Real brands. Real results.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
            Real results from
            <br />
            real brands
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            See how Shopify brands transformed their profitability with Profit Intelligence dashboards.
          </p>
        </div>
      </section>

      {/* Harbor Goods Case Study */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Company Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-400">HG</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Harbor Goods Co.</h2>
              <p className="text-slate-400">Home goods & furniture</p>
            </div>
          </div>

          {/* Challenge */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-white">The Challenge</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <div className="text-red-400 text-lg mb-3">×</div>
                <p className="text-slate-300">$80k/month revenue but no visibility into true profit</p>
              </div>
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <div className="text-red-400 text-lg mb-3">×</div>
                <p className="text-slate-300">Scaling decisions based on Shopify revenue, not net profit</p>
              </div>
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <div className="text-red-400 text-lg mb-3">×</div>
                <p className="text-slate-300">Didn&apos;t know break-even ROAS per product</p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-white">Our Solution</h3>
            <div className="p-8 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 backdrop-blur-xl bg-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Rior Systems dashboard</h4>
                    <p className="text-slate-400 text-sm">Full implementation in 48 hours</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 backdrop-blur-xl bg-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Connected platforms</h4>
                    <p className="text-slate-400 text-sm">Shopify + Meta + Google Ads</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 backdrop-blur-xl bg-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Real-time tracking</h4>
                    <p className="text-slate-400 text-sm">Profit by SKU, updated daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results - Stats */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-white">Results (90 days)</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 text-center">
                <div className="text-4xl font-bold text-white mb-2">$286K</div>
                <div className="text-slate-400 text-sm">Revenue</div>
              </div>
              <div className="p-6 backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">$70K</div>
                <div className="text-slate-400 text-sm">Net Profit</div>
              </div>
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 text-center">
                <div className="text-4xl font-bold text-white mb-2">24.4%</div>
                <div className="text-slate-400 text-sm">Profit Margin</div>
              </div>
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 text-center">
                <div className="text-4xl font-bold text-white mb-2">+$12K</div>
                <div className="text-slate-400 text-sm">Monthly Profit Gain</div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="mb-16">
            <div className="p-8 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 border-l-4 border-l-blue-500">
              <blockquote className="text-xl text-slate-300 italic mb-4 leading-relaxed">
                &quot;We thought we were breaking even. Rior showed us we were actually losing money on 2 products.&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 backdrop-blur-xl bg-slate-700/50 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">HG</span>
                </div>
                <div>
                  <div className="font-medium text-white">Harbor Goods Co.</div>
                  <div className="text-slate-400 text-sm">Founding Team</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 text-white">Metrics Breakdown</h3>
            
            {/* Before/After */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Before / After Comparison</h4>
              <div className="overflow-hidden backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-slate-500 font-medium">Metric</th>
                      <th className="text-center p-4 text-slate-500 font-medium">Before</th>
                      <th className="text-center p-4 text-slate-500 font-medium">After (90 days)</th>
                      <th className="text-center p-4 text-slate-500 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="p-4 text-slate-300">Monthly Revenue</td>
                      <td className="p-4 text-center text-slate-400">$80,000</td>
                      <td className="p-4 text-center text-white">$95,552</td>
                      <td className="p-4 text-center text-green-400">+19.4%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-4 text-slate-300">Net Profit Margin</td>
                      <td className="p-4 text-center text-slate-400">Unknown</td>
                      <td className="p-4 text-center text-white">24.4%</td>
                      <td className="p-4 text-center text-green-400">Tracked ✓</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-4 text-slate-300">Avg. ROAS</td>
                      <td className="p-4 text-center text-slate-400">2.8x</td>
                      <td className="p-4 text-center text-white">3.4x</td>
                      <td className="p-4 text-center text-green-400">+21%</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-300">Unprofitable Products</td>
                      <td className="p-4 text-center text-slate-400">Unknown</td>
                      <td className="p-4 text-center text-white">0 (paused)</td>
                      <td className="p-4 text-center text-green-400">Fixed ✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart Placeholders */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">ROAS by Campaign</h4>
                <div className="aspect-video backdrop-blur-xl bg-slate-900/50 rounded-xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-slate-400 text-sm mb-2">[Chart Placeholder]</div>
                    <div className="text-slate-500 text-xs">Bar chart showing ROAS comparison across<br/>Meta, Google, and TikTok campaigns</div>
                  </div>
                </div>
              </div>
              <div className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Product Profitability Ranking</h4>
                <div className="aspect-video backdrop-blur-xl bg-slate-900/50 rounded-xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-slate-400 text-sm mb-2">[Chart Placeholder]</div>
                    <div className="text-slate-500 text-xs">Horizontal bar chart ranking all SKUs by<br/>profit margin % (Best: 65.9% margin)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl border border-white/10">
            <h2 className="text-4xl font-bold mb-4 text-white">Get results like Harbor Goods</h2>
            <p className="text-xl text-slate-400 mb-8">
              See your true profit in 48 hours. No commitment required.
            </p>
            <a 
              href="https://calendly.com/thomas-rior/30min" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 backdrop-blur-xl bg-slate-800/50 border border-white/20 rounded-xl font-medium hover:bg-slate-700/50 transition"
            >
              Book a 20-minute call
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
