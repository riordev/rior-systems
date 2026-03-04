import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Extended background blurs - positioned to avoid cutoff */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px]"></div>
        </div>
        
        {/* Hero */}
        <section className="relative px-6 pt-32 pb-24">
          <div className="relative max-w-5xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 inline-flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-white/60 text-sm">Now accepting clients</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
              See your true profit.
              <br />
              <span className="text-white/40">Finally.</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mb-8 leading-relaxed">
              Rior Systems builds Profit Intelligence dashboards for Shopify brands spending 
              $20k-$200k/month on ads. Know your real net profit, break-even ROAS, and which 
              products to scale — all in one view.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="/demo" 
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 rounded-xl font-medium transition"
              >
                Try the demo
              </a>
              <a 
                href="/offers" 
                className="px-8 py-4 backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl font-medium hover:bg-white/10 transition"
              >
                See pricing
              </a>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="relative px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">The problem</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { color: "from-red-500/20 to-rose-500/20", icon: "✕", title: "Can't see true profit", desc: "Shopify revenue minus ad spend doesn't equal profit. You're missing COGS, shipping, and processing fees." },
                { color: "from-amber-500/20 to-orange-500/20", icon: "✕", title: "Don't know break-even", desc: "Every SKU has a different break-even ROAS. Most founders guess. We calculate it precisely." },
                { color: "from-purple-500/20 to-pink-500/20", icon: "✕", title: "Scaling blind", desc: "You're making scaling decisions without knowing which products are actually profitable." }
              ].map((item) => (
                <div key={item.title} className={`p-6 backdrop-blur-xl bg-gradient-to-br ${item.color} rounded-2xl border border-white/10`}>
                  <div className="text-white/80 text-3xl mb-4 font-bold">{item.icon}</div>
                  <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="relative px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">How it works</h2>
            <div className="space-y-6">
              {[
                { num: "01", title: "Connect your data", desc: "We pull from Shopify, Meta Ads, Google Ads, and TikTok. One-time setup, 30 minutes." },
                { num: "02", title: "See true profit", desc: "Revenue minus COGS, shipping, payment fees, and attributed ad spend. Real net profit per order." },
                { num: "03", title: "Get alerts", desc: "Scale signals when ROAS exceeds break-even. Underperformance alerts when it drops below. No surprises." }
              ].map((step) => (
                <div key={step.num} className="flex gap-6 p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-3xl font-bold text-white/20">{step.num}</div>
                  <div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-white/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Pricing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10">
                <div className="text-white/50 text-sm mb-2">Setup</div>
                <div className="text-4xl font-bold mb-4">$2,500-$4,000</div>
                <p className="text-white/50 mb-6">One-time fee. Includes full dashboard build, data pipeline, and team training.</p>
                <ul className="space-y-3 text-sm">
                  {["BigQuery data warehouse", "Looker Studio dashboard", "Shopify + ad platform connectors", "90 days historical data", "Alert configuration"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white/70">
                      <span className="text-green-400">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
                <div className="text-white/50 text-sm mb-2">Monthly</div>
                <div className="text-4xl font-bold mb-4">$1,500-$3,000</div>
                <p className="text-white/50 mb-6">Ongoing monitoring, maintenance, and optimization. Cancel anytime with 30 days notice.</p>
                <ul className="space-y-3 text-sm">
                  {["Daily data refresh", "Weekly profit reports", "Real-time alerts", "Monthly strategy call", "Unlimited support"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white/70">
                      <span className="text-green-400">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center">
              <a 
                href="https://calendly.com/thomas-rior/30min" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl font-medium hover:bg-white/10 transition"
              >
                Book a 20-minute call
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
