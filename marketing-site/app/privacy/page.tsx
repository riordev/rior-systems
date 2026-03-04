export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#262626]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="font-bold text-lg">rior.systems</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="text-[#a1a1aa] hover:text-[#fafafa]">Home</a>
            <a href="/builds" className="text-[#a1a1aa] hover:text-[#fafafa]">Build log</a>
            <span className="text-[#fafafa]">Privacy</span>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-sm border border-amber-500/30">DRAFT — REVIEW REQUIRED</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[#a1a1aa] mb-12">Last updated: March 3, 2026</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                Rior Systems (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) builds Profit Intelligence dashboards 
                for e-commerce businesses. This Privacy Policy explains how we collect, use, 
                store, and protect your data when you use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Data We Access</h2>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                To provide our services, we access the following data from your connected platforms:
              </p>
              <ul className="space-y-2 text-[#a1a1aa]">
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Shopify: Orders, products, refunds, customer data (anonymized for analytics)</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Meta Ads: Campaign spend, impressions, clicks, conversions</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Google Ads: Campaign performance, cost data, attribution</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> TikTok Ads: Campaign metrics, spend, engagement data</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">How We Use Data</h2>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                We process your data solely to:
              </p>
              <ul className="space-y-2 text-[#a1a1aa]">
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Calculate true net profit (revenue minus all costs)</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Determine break-even ROAS per SKU</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Generate performance dashboards and reports</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Send alerts when metrics cross thresholds</li>
              </ul>
              <p className="text-[#a1a1aa] leading-relaxed mt-4">
                We do not use your data for any purpose other than providing our services. 
                We do not sell data. We do not train AI models on your data.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Data Storage & Security</h2>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                Your data is stored in Google BigQuery with the following protections:
              </p>
              <ul className="space-y-2 text-[#a1a1aa]">
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Encryption at rest and in transit</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Access limited to authorized personnel only</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Each client in isolated dataset</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Regular access audits</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                We retain your data for the duration of our service agreement plus 30 days 
                after cancellation, unless you request immediate deletion. After 30 days, 
                all data is permanently deleted from our systems.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-[#a1a1aa]">
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Request a copy of your data</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Request correction of inaccurate data</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Request deletion of your data</li>
                <li className="flex gap-2"><span className="text-[#22c55e]">•</span> Revoke platform access at any time</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                For privacy questions or data requests, contact: privacy@rior.systems
              </p>
            </section>

            <section className="p-6 bg-[#141414] border border-[#262626] mt-12">
              <p className="text-[#a1a1aa] text-sm">
                <strong className="text-[#fafafa]">Note for Rior:</strong> This is a draft privacy policy. 
                Have your attorney review before publishing. Adjust data retention periods, 
                add specific security measures, and ensure compliance with GDPR/CCPA if applicable.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[#262626]">
        <div className="max-w-4xl mx-auto text-center text-[#a1a1aa] text-sm">
          <p>Built by John Bot for Rior Systems</p>
        </div>
      </footer>
    </main>
  );
}
