export default function Builds() {
  const builds = [
    {
      date: "2026-03-04",
      title: "BigQuery infrastructure live",
      description: "Complete data pipeline with $286k demo data, 24.4% profit margin. Shopify and Meta connectors ready.",
      tags: ["bigquery", "infrastructure", "revenue"],
      highlight: true
    },
    {
      date: "2026-03-04",
      title: "API connectors complete",
      description: "Shopify Admin API and Meta Marketing API connectors built. Pull orders, products, campaigns, spend data automatically.",
      tags: ["api", "connectors"],
      highlight: true
    },
    {
      date: "2026-03-03",
      title: "Glass Admin Panel",
      description: "iOS-style admin dashboard with live agent monitoring, client management, and deployment controls. Backdrop blur throughout.",
      tags: ["admin", "glass-ui"]
    },
    {
      date: "2026-03-03",
      title: "Harbor Demo v2",
      description: "Interactive profit dashboard with Recharts, mobile-responsive, glass aesthetic. Sample data from BigQuery.",
      tags: ["demo", "dashboard"]
    },
    {
      date: "2026-03-03",
      title: "Workflow optimization analysis",
      description: "Mapped complete client journey, identified 78% cost reduction potential, 6 automation opportunities.",
      tags: ["workflow", "optimization"]
    },
    {
      date: "2026-03-03",
      title: "Self-service onboarding portal",
      description: "Client-facing portal for automated Shopify/Meta connection. Reduces manual onboarding by 3-4 hours per client.",
      tags: ["onboarding", "automation"]
    },
    {
      date: "2026-03-03",
      title: "UI mockup variations complete",
      description: "Created 4 dashboard design vibes: Terminal, Amber, Glass, Editorial. All viewable at localhost:3000.",
      tags: ["design", "ui"]
    },
    {
      date: "2026-03-03",
      title: "rior.systems website",
      description: "Glass aesthetic marketing site with homepage, build log, and privacy policy. Next.js, Vercel-ready.",
      tags: ["website", "nextjs"]
    },
    {
      date: "2026-03-02",
      title: "D&D campaign 'The Shattered Veil'",
      description: "205+ page campaign world with 5 locations, 6 factions, 12-session arc. Critical Role-level depth.",
      tags: ["dnd", "content"]
    },
    {
      date: "2026-03-02",
      title: "Multi-agent system live",
      description: "5 agents: main (Kimi), samantha (coding), jackson (writing), harper (heartbeats), atlas (search).",
      tags: ["agents", "infrastructure"]
    },
    {
      date: "2026-03-02",
      title: "iMessage bridge active",
      description: "Can send/receive texts from Mac. Critical for automated client notifications.",
      tags: ["imessage", "integration"]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative px-6 py-6 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <a href="/" className="font-bold text-lg text-white/90">rior.systems</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="text-white/50 hover:text-white/90 transition">Home</a>
            <span className="text-white/90">Build log</span>
            <a href="/privacy" className="text-white/50 hover:text-white/90 transition">Privacy</a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="relative px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
              Build log
            </h1>
            <p className="text-white/50 text-lg">How Rior Systems is built. Updated as work happens.</p>
          </div>

          <div className="space-y-6">
            {builds.map((build, i) => (
              <article 
                key={i} 
                className={`p-6 backdrop-blur-xl rounded-2xl border transition hover:border-white/20 ${
                  build.highlight 
                    ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <time className="text-white/40 text-sm font-mono">{build.date}</time>
                  <div className="flex gap-2">
                    {build.tags.map(tag => (
                      <span 
                        key={tag} 
                        className={`px-3 py-1 rounded-full text-xs ${
                          build.highlight 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                            : 'bg-white/10 text-white/60 border border-white/10'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white/90">{build.title}</h2>
                <p className="text-white/50 leading-relaxed">{build.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative px-6 py-12 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center text-white/40 text-sm">
          <p>Built by John Bot for Rior Systems</p>
        </div>
      </footer>
    </main>
  );
}
