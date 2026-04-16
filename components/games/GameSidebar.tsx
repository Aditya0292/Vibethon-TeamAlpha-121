"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GameSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: "house", href: "/dashboard" },
    { label: "Missions", icon: "crossword", href: "/games", active: true },
    { label: "Armory", icon: "shield", href: "#" },
    { label: "Profile", icon: "verified_user", href: "#" },
  ];

  return (
    <aside className="w-full md:w-64 bg-surface-container-low border-r border-outline-variant/15 flex flex-col h-auto md:min-h-screen relative shrink-0">
      {/* Angled accent top right */}
      <div 
        className="absolute top-0 right-0 w-4 h-4 bg-primary" 
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />
      
      <header className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/15">
        <div className="text-primary material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          terminal
        </div>
        <h2 className="text-on-surface font-headline uppercase tracking-[0.05em] text-sm font-bold truncate">Tactical Hub</h2>
      </header>

      <div className="flex flex-col gap-6 p-4 grow">
        {/* Profile Section */}
        <div className="flex gap-3 items-center bg-surface-container-highest/50 p-3 border border-outline-variant/15">
          <div 
            className="bg-center bg-no-repeat bg-cover w-10 h-10 border border-primary/50"
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzWuohGT5HLdmrP0yK6BPgggL6vEoeGf6eWvIXH4E9-z8zuZWjLeVxHHHNWlCnT36D4fkwTI9yR73n7eUF8Wo2Whwnzg-Sa6TpLs-GcVoKNt1zolk3vzAnuE6C-JiR3Frkwnb2iU0irjt_eMksxfZD1cQOSVPH8roMdOYEZGyl-N1W3nUfd18Bxdf1Fnbs9z7N8-oHiysMpUYyncvYt26u2TS_Un1nV0OIQe9F-9daRHYK9IJkCGHao4t3q6W_yhR_JuRehxluVxY")` }}
          />
          <div className="flex flex-col text-on-surface">
            <h1 className="text-sm font-bold font-headline tracking-wider uppercase">Agent 47</h1>
            <p className="text-secondary font-mono text-[10px] uppercase">Rank: Elite</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.active || pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 transition-colors group relative ${
                  isActive 
                    ? "bg-surface-container-highest border-l-2 border-primary text-primary" 
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-highest"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center justify-center z-10">
                  <span 
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                </div>
                <p className={`text-sm font-bold font-headline uppercase tracking-wider z-10 ${!isActive ? 'group-hover:translate-x-1 transition-transform' : ''}`}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status */}
      <div className="mt-auto p-4 border-t border-outline-variant/15 font-mono text-[10px] text-on-surface-variant flex flex-col gap-1">
        <div className="flex justify-between">
          <span>SYS.STATUS:</span> 
          <span className="text-primary">ONLINE</span>
        </div>
        <div className="flex justify-between">
          <span>UPLINK:</span> 
          <span>SECURE</span>
        </div>
      </div>
    </aside>
  );
}
