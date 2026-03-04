export default function Privacy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative px-6 py-6 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="font-bold text-lg text-white/90">rior.systems</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="text-white/50 hover:text-white/90 transition">Home</a>
            <a href="/builds" className="text-white/50 hover:text-white/90 transition">Build log</a>
            <span className="text-white/90">Privacy</span>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="relative px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/30">
              DRAFT — REVIEW REQUIRED
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-white/40 mb-12">Last updated: March 4, 2026</p>

          <div className="space-y-8">
            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">Overview</h2>
              <p className="text-white/50 leading-relaxed">
                Rior Systems (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) builds Profit Intelligence dashboards 
                for e-commerce businesses. This Privacy Policy explains how we collect, use, 
                store, and protect your data when you use our services.
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">Data We Access</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                To provide our services, we access the following data from your connected platforms:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Shopify: Orders, products, refunds, customer data (anonymized for analytics)</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Meta Ads: Campaign spend, impressions, clicks, conversions</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Google Ads: Campaign performance, cost data, attribution</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>TikTok Ads: Campaign metrics, spend, engagement data</span>
                </li>
              </ul>
            </section>

            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">How We Use Data</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                We process your data solely to:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Calculate true net profit (revenue minus all costs)</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Determine break-even ROAS per SKU</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Generate performance dashboards and reports</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Send alerts when metrics cross thresholds</span>
                </li>
              </ul>
              <p className="text-white/50 leading-relaxed mt-4">
                We do not use your data for any purpose other than providing our services. 
                We do not sell data. We do not train AI models on your data.
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">Data Storage & Security</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Your data is stored in Google BigQuery with the following protections:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Encryption at rest and in transit</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Access limited to authorized personnel only</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Each client in isolated dataset</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Regular access audits</span>
                </li>
              </ul>
            </section>

            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">Data Retention</h2>
              <p className="text-white/50 leading-relaxed">
                We retain your data for the duration of our service agreement plus 30 days 
                after cancellation, unless you request immediate deletion. After 30 days, 
                all data is permanently deleted from our systems.
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">Your Rights</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Request a copy of your data</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Request correction of inaccurate data</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex gap-3 text-white/50">
                  <span className="text-green-400">✓</span> 
                  <span>Revoke platform access at any time</span>
                </li>
              </ul>
            </section>

            <section className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">Contact</h2>
              <p className="text-white/50 leading-relaxed">
                For privacy questions or data requests, contact: thomas@rior.systems
              </p>
            </section>

            <section className="p-6 backdrop-blur-xl bg-amber-500/5 rounded-2xl border border-amber-500/20">
              <p className="text-white/40 text-sm">
                <strong className="text-white/60">Note for Rior:</strong> This is a draft privacy policy. 
                Have your attorney review before publishing. Adjust data retention periods, 
                add specific security measures, and ensure compliance with GDPR/CCPA if applicable.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative px-6 py-12 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          <p>Built by John Bot for Rior Systems</p>
        </div>
      </footer>
    </main>
  );
}
