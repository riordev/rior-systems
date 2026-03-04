import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-12 backdrop-blur-xl bg-white/5 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <span className="font-bold text-lg">rior.systems</span>
            <span className="text-white/40 ml-4">Profit Intelligence for Shopify</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="text-white/40 hover:text-white transition">Home</Link>
            <Link href="/demo" className="text-white/40 hover:text-white transition">Demo</Link>
            <Link href="/offers" className="text-white/40 hover:text-white transition">Offers</Link>
            <Link href="/case-studies" className="text-white/40 hover:text-white transition">Case Studies</Link>
            <Link href="/builds" className="text-white/40 hover:text-white transition">Build log</Link>
            <Link href="/privacy" className="text-white/40 hover:text-white transition">Privacy</Link>
          </div>
        </div>
        <div className="text-center text-white/30 text-sm">
          © 2026 Rior Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
