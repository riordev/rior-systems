import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata = {
  title: "Offers | Rior Systems",
  description: "Special offers and packages for Shopify brands.",
};

export default function Offers() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />
      
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
            Special Offers
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Limited-time packages designed to get you profitable faster.
          </p>
        </div>
      </section>

      {/* Offers */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Early Adopter Offer */}
            <div className="p-8 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                LIMITED SPOTS
              </div>
              <div className="text-slate-400 text-sm mb-2">Early Adopter</div>
              <h2 className="text-2xl font-bold mb-4 text-white">Founder&apos;s Circle</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$1,500</span>
                <span className="text-slate-400 line-through">$2,500</span>
                <span className="text-slate-400">setup</span>
              </div>
              <p className="text-slate-400 mb-6">
                First 10 clients only. Lock in founder&apos;s pricing forever.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "40% off setup fee",
                  "Locked monthly rate: $1,500/mo",
                  "Priority support",
                  "Monthly strategy calls",
                  "Lifetime price guarantee"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span> {item}
                  </li>
                ))}
              </ul>
              <a 
                href="https://calendly.com/thomas-rior/30min" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition"
              >
                Claim this offer
              </a>
            </div>

            {/* Standard Package */}
            <div className="p-8 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <div className="text-slate-400 text-sm mb-2">Standard</div>
              <h2 className="text-2xl font-bold mb-4 text-white">Core Package</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$2,500</span>
                <span className="text-slate-400">setup</span>
              </div>
              <p className="text-slate-400 mb-6">
                Full implementation for established Shopify brands.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Complete dashboard build",
                  "All platform connectors",
                  "90 days historical data",
                  "Standard support",
                  "Quarterly strategy reviews"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span> {item}
                  </li>
                ))}
              </ul>
              <a 
                href="https://calendly.com/thomas-rior/30min" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-8 py-4 backdrop-blur-xl bg-slate-700/50 border border-white/20 rounded-xl font-medium hover:bg-slate-600/50 transition"
              >
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-bold mb-4 text-white">Questions?</h2>
            <p className="text-xl text-slate-400 mb-8">
              Book a 20-minute call to discuss which package fits your brand.
            </p>
            <a 
              href="https://calendly.com/thomas-rior/30min" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 backdrop-blur-xl bg-slate-800/50 border border-white/20 rounded-xl font-medium hover:bg-slate-700/50 transition"
            >
              Schedule a call
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
