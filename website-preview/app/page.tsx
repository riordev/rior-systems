export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Rior Systems — UI Mockup Preview</h1>
      <div className="grid grid-cols-2 gap-6">
        <a href="/terminal" className="p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
          <h2 className="text-xl font-semibold">Terminal</h2>
          <p className="text-slate-400 mt-2">Dark, data-dense, Bloomberg-style</p>
        </a>
        <a href="/amber" className="p-6 bg-amber-900/30 rounded-lg hover:bg-amber-900/50 transition">
          <h2 className="text-xl font-semibold">Amber</h2>
          <p className="text-slate-400 mt-2">Warm, diary-like aesthetic</p>
        </a>
        <a href="/glass" className="p-6 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition">
          <h2 className="text-xl font-semibold">Glass</h2>
          <p className="text-slate-400 mt-2">Floating blur, modern premium</p>
        </a>
        <a href="/editorial" className="p-6 bg-white/10 rounded-lg hover:bg-white/20 transition">
          <h2 className="text-xl font-semibold">Editorial</h2>
          <p className="text-slate-400 mt-2">Bold magazine-style layout</p>
        </a>
      </div>
    </main>
  );
}
