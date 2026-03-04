export default function Builds() {
  const builds = [
    {
      date: "2026-03-03",
      title: "UI mockup variations complete",
      description: "Created 4 dashboard design vibes: Terminal (dark/data-dense), Amber (warm/diary), Glass (floating/modern), Editorial (bold/magazine). All viewable at localhost:3000.",
      tags: ["design", "ui"]
    },
    {
      date: "2026-03-03",
      title: "rior.systems website launched",
      description: "Marketing site with homepage, build log, and privacy policy. Dark terminal aesthetic, Next.js, Vercel-ready.",
      tags: ["website", "nextjs"]
    },
    {
      date: "2026-03-03",
      title: "Daily briefing system live",
      description: "8am automated briefings now posting to #daily-briefing with completed tasks, in-progress work, and blockers.",
      tags: ["automation", "process"]
    },
    {
      date: "2026-03-02",
      title: "Harbor Goods demo system",
      description: "Complete BigQuery schema + Python ETL with 90 days realistic data. $238k revenue, 23.8% net margin, 3.10x ROAS.",
      tags: ["bigquery", "etl", "demo"]
    },
    {
      date: "2026-03-02",
      title: "Cold email sequence",
      description: "5-touch sequence with discovery call script and objection handling guide. Direct, founder-to-founder tone.",
      tags: ["outreach", "copy"]
    },
    {
      date: "2026-03-02",
      title: "Multi-agent system live",
      description: "5 agents configured: main (Kimi), samantha (coding), jackson (writing), harper (heartbeats/local), atlas (search/local).",
      tags: ["agents", "infrastructure"]
    },
    {
      date: "2026-03-02",
      title: "Discord infrastructure",
      description: "Created #daily-briefing, #approvals, #builds, #alerts, #outreach channels. Added to personal server with routing.",
      tags: ["discord", "infrastructure"]
    },
    {
      date: "2026-03-02",
      title: "GitHub repo initialized",
      description: "rior-systems repo live with Harbor Goods demo, outreach sequences, website code. All commits pushed.",
      tags: ["github", "repo"]
    },
    {
      date: "2026-03-02",
      title: "iMessage bridge active",
      description: "Can now send/receive texts from Mac. Tested successfully with multiple contacts.",
      tags: ["imessage", "integration"]
    },
    {
      date: "2026-03-02",
      title: "Local Ollama models",
      description: "llama3.2:3b, gemma3:4b active. mistral:7b and codellama:7b downloading. Reducing API costs.",
      tags: ["ollama", "local", "models"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#262626]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="font-bold text-lg">rior.systems</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="text-[#a1a1aa] hover:text-[#fafafa]">Home</a>
            <span className="text-[#fafafa]">Build log</span>
            <a href="/privacy" className="text-[#a1a1aa] hover:text-[#fafafa]">Privacy</a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Build log</h1>
          <p className="text-[#a1a1aa] mb-12">How Rior Systems is built. Updated as work happens.</p>

          <div className="space-y-8">
            {builds.map((build, i) => (
              <article key={i} className="p-6 bg-[#141414] border border-[#262626]">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <time className="text-[#a1a1aa] text-sm font-mono">{build.date}</time>
                  <div className="flex gap-2">
                    {build.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#262626] text-[#a1a1aa] text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{build.title}</h2>
                <p className="text-[#a1a1aa] leading-relaxed">{build.description}</p>
              </article>
            ))}
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
