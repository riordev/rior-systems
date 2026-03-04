export default function Navigation() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/demo", label: "Demo" },
    { href: "/offers", label: "Offers" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/builds", label: "Builds" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-slate-900/50 border-b border-white/10">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <a href="/" className="font-bold text-lg text-white">rior.systems</a>
        <nav className="hidden md:flex gap-6 text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {/* Mobile menu button */}
        <button className="md:hidden text-slate-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
