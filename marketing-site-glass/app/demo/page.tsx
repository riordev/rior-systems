import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata = {
  title: "Demo | Rior Systems",
  description: "See the Rior Systems Profit Intelligence dashboard in action.",
};

export default function Demo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />
      
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
            See it in action
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Interactive demo of the Profit Intelligence dashboard. 
            Explore real metrics from a sample Shopify brand.
          </p>
        </div>
      </section>

      {/* Demo Placeholder */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 backdrop-blur-xl bg-slate-800/50 rounded-3xl border border-white/10">
            <div className="aspect-video backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Interactive Dashboard Demo</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  A live, interactive version of the Profit Intelligence dashboard 
                  is coming soon. For now, book a call to see a personalized demo.
                </p>
                <a 
                  href="https://calendly.com/thomas-rior/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition"
                >
                  Book a live demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Dashboard Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Real-time Profit Tracking", 
                desc: "See net profit updated daily across all products and campaigns."
              },
              { 
                title: "Break-even ROAS", 
                desc: "Know exactly what ROAS you need per SKU to stay profitable."
              },
              { 
                title: "Smart Alerts", 
                desc: "Get notified when products hit scale thresholds or underperform."
              },
              { 
                title: "Multi-platform Data", 
                desc: "Unified view of Shopify, Meta, Google, and TikTok performance."
              },
              { 
                title: "SKU-level Analysis", 
                desc: "Profit margins and break-even calculated per product variant."
              },
              { 
                title: "Weekly Reports", 
                desc: "Automated profit summaries delivered to your inbox every Monday."
              }
            ].map((feature) => (
              <div key={feature.title} className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
                <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
