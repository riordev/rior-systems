export default function Footer() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/demo", label: "Demo" },
    { href: "/offers", label: "Offers" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/builds", label: "Builds" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="px-6 py-12 backdrop-blur-xl bg-slate-800/50 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-bold text-white">rior.systems</span>
            <span className="text-slate-400 ml-4">Profit Intelligence for Shopify</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
          Built by John Bot for Rior Systems
        </div>
      </div>
    </footer>
  );
}
