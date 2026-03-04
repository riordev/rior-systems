export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Hero */}
      <section className="px-6 py-24 border-b border-[#262626]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
            <span className="text-[#a1a1aa] text-sm">Now accepting clients</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            See your true profit.
            <br />
            <span className="text-[#a1a1aa]">Finally.</span>
          </h1>
          <p className="text-xl text-[#a1a1aa] max-w-2xl mb-8 leading-relaxed">
            Rior Systems builds Profit Intelligence dashboards for Shopify brands spending 
            $20k-$200k/month on ads. Know your real net profit, break-even ROAS, and which 
            products to scale — all in one view.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#pricing" 
              className="px-6 py-3 bg-[#fafafa] text-[#0a0a0a] font-medium hover:bg-[#e4e4e4] transition"
            >
              Get started
            </a>
            <a 
              href="/builds" 
              className="px-6 py-3 border border-[#262626] text-[#fafafa] hover:border-[#525252] transition"
            >
              See how we build
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20 border-b border-[#262626]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">The problem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#141414] border border-[#262626]">
              <div className="text-[#ef4444] text-2xl mb-4">×</div>
              <h3 className="font-semibold mb-2">Can't see true profit</h3>
              <p className="text-[#a1a1aa] text-sm">Shopify revenue minus ad spend doesn't equal profit. You're missing COGS, shipping, and processing fees.</p>
            </div>
            <div className="p-6 bg-[#141414] border border-[#262626]">
              <div className="text-[#ef4444] text-2xl mb-4">×</div>
              <h3 className="font-semibold mb-2">Don't know break-even</h3>
              <p className="text-[#a1a1aa] text-sm">Every SKU has a different break-even ROAS. Most founders guess. We calculate it precisely.</p>
            </div>
            <div className="p-6 bg-[#141414] border border-[#262626]">
              <div className="text-[#ef4444] text-2xl mb-4">×</div>
              <h3 className="font-semibold mb-2">Scaling blind</h3>
              <p className="text-[#a1a1aa] text-sm">You're making scaling decisions without knowing which products are actually profitable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 py-20 border-b border-[#262626]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="space-y-6">
            <div className="flex gap-6 p-6 bg-[#141414] border border-[#262626]">
              <div className="text-2xl font-bold text-[#525252]">01</div>
              <div>
                <h3 className="font-semibold mb-2">Connect your data</h3>
                <p className="text-[#a1a1aa]">We pull from Shopify, Meta Ads, Google Ads, and TikTok. One-time setup, 30 minutes.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-[#141414] border border-[#262626]">
              <div className="text-2xl font-bold text-[#525252]">02</div>
              <div>
                <h3 className="font-semibold mb-2">See true profit</h3>
                <p className="text-[#a1a1aa]">Revenue minus COGS, shipping, payment fees, and attributed ad spend. Real net profit per order.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-[#141414] border border-[#262626]">
              <div className="text-2xl font-bold text-[#525252]">03</div>
              <div>
                <h3 className="font-semibold mb-2">Get alerts</h3>
                <p className="text-[#a1a1aa]">Scale signals when ROAS exceeds break-even. Underperformance alerts when it drops below. No surprises.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 border-b border-[#262626]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#141414] border border-[#262626]">
              <div className="text-[#a1a1aa] text-sm mb-2">Setup</div>
              <div className="text-4xl font-bold mb-4">$2,500-$4,000</div>
              <p className="text-[#a1a1aa] mb-6">One-time fee. Includes full dashboard build, data pipeline, and team training.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> BigQuery data warehouse</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Looker Studio dashboard</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Shopify + ad platform connectors</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> 90 days historical data</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Alert configuration</li>
              </ul>
            </div>
            <div className="p-8 bg-[#141414] border border-[#262626]">
              <div className="text-[#a1a1aa] text-sm mb-2">Monthly</div>
              <div className="text-4xl font-bold mb-4">$1,500-$3,000</div>
              <p className="text-[#a1a1aa] mb-6">Ongoing monitoring, maintenance, and optimization. Cancel anytime with 30 days notice.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Daily data refresh</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Weekly profit reports</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Real-time alerts</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Monthly strategy call</li>
                <li className="flex items-center gap-2"><span className="text-[#22c55e]">✓</span> Unlimited support</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a 
              href="https://calendly.com" 
              target="_blank"
              className="inline-block px-8 py-4 bg-[#fafafa] text-[#0a0a0a] font-medium hover:bg-[#e4e4e4] transition"
            >
              Book a 20-minute call
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[#262626]">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="font-bold">rior.systems</span>
            <span className="text-[#a1a1aa] ml-4">Profit Intelligence for Shopify</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/builds" className="text-[#a1a1aa] hover:text-[#fafafa]">Build log</a>
            <a href="/privacy" className="text-[#a1a1aa] hover:text-[#fafafa]">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
