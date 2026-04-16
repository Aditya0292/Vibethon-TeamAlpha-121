"use client";

import { useState } from "react";

export default function TopBar() {
  const [command, setCommand] = useState("");

  return (
    <div className="flex justify-between items-center w-full pb-4 border-b ghost-border">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-headline font-bold uppercase tracking-wider text-on-surface">
          Intelligence Dashboard
        </h1>
        <p className="text-primary font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">subdirectory_arrow_right</span>
          Neural OS v4.2.0 • Sector: Quantitative Analysis
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <p className="text-on-surface-variant font-mono text-[10px] uppercase tracking-tighter">System Connectivity</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-on-surface font-mono text-xs uppercase">Encrypted_Link_Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container-highest p-2 hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface border border-outline-variant/15">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="bg-surface-container-highest p-2 hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface md:hidden border border-outline-variant/15">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
