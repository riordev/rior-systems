import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      {/* Content */}
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/30">
              DRAFT — REVIEW REQUIRED
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-12">Last updated: March 4, 2026</p>

          <div className="space-y-8">
            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">Overview</h2>
              <p className="text-slate-400 leading-relaxed">
                Rior Systems (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) builds Profit Intelligence dashboards 
                for e-commerce businesses. This Privacy Policy explains how we collect, use, 
                store, and protect your data when you use our services.
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">Data We Access</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                To provide our services, we access the following data from your connected platforms:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Shopify: Orders, products, refunds, customer data (anonymized for analytics)</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Meta Ads: Campaign spend, impressions, clicks, conversions</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Google Ads: Campaign performance, cost data, attribution</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>TikTok Ads: Campaign metrics, spend, engagement data</span>
                </li>
              </ul>
            </section>

            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Data</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                We process your data solely to:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Calculate true net profit (revenue minus all costs)</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Determine break-even ROAS per SKU</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Generate performance dashboards and reports</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Send alerts when metrics cross thresholds</span>
                </li>
              </ul>
              <p className="text-slate-400 leading-relaxed mt-4">
                We do not use your data for any purpose other than providing our services. 
                We do not sell data. We do not train AI models on your data.
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">Data Storage & Security</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Your data is stored in Google BigQuery with the following protections:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Encryption at rest and in transit</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Access limited to authorized personnel only</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Each client in isolated dataset</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Regular access audits</span>
                </li>
              </ul>
            </section>

            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">Data Retention</h2>
              <p className="text-slate-400 leading-relaxed">
                We retain your data for the duration of our service agreement plus 30 days 
                after cancellation, unless you request immediate deletion. After 30 days, 
                all data is permanently deleted from our systems.
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Request a copy of your data</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Request correction of inaccurate data</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex gap-3 text-slate-400">
                  <span className="text-green-400">✓</span> 
                  <span>Revoke platform access at any time</span>
                </li>
              </ul>
            </section>

            <section className="p-6 backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact</h2>
              <p className="text-slate-400 leading-relaxed">
                For privacy questions or data requests, contact: thomas@rior.systems
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-amber-500/5 rounded-2xl border border-amber-500/20">
              <p className="text-slate-500 text-sm">
                <strong className="text-slate-400">Note for Rior:</strong> This is a draft privacy policy. 
                Have your attorney review before publishing. Adjust data retention periods, 
                add specific security measures, and ensure compliance with GDPR/CCPA if applicable.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
