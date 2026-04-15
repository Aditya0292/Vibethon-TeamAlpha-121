export default function GamesPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="pointer-events-none fixed inset-0 z-50 scanlines mix-blend-screen" />

      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="relative h-auto w-full shrink-0 border-r border-outline-variant/15 bg-surface-container-low md:min-h-screen md:w-64">
          <div
            className="absolute right-0 top-0 h-4 w-4 bg-primary"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          />
          <header className="flex items-center gap-3 border-b border-outline-variant/15 px-6 py-5">
            <div className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              terminal
            </div>
            <h2 className="truncate font-headline text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Tactical Hub</h2>
          </header>

          <div className="grow flex-col gap-6 p-4 md:flex">
            <div className="flex items-center gap-3 border border-outline-variant/15 bg-surface-container-highest/50 p-3">
              <div
                className="h-10 w-10 border border-primary/50 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzWuohGT5HLdmrP0yK6BPgggL6vEoeGf6eWvIXH4E9-z8zuZWjLeVxHHHNWlCnT36D4fkwTI9yR73n7eUF8Wo2Whwnzg-Sa6TpLs-GcVoKNt1zolk3vzAnuE6C-JiR3Frkwnb2iU0irjt_eMksxfZD1cQOSVPH8roMdOYEZGyl-N1W3nUfd18Bxdf1Fnbs9z7N8-oHiysMpUYyncvYt26u2TS_Un1nV0OIQe9F-9daRHYK9IJkCGHao4t3q6W_yhR_JuRehxluVxY")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">Agent 47</h1>
                <p className="font-mono text-[10px] uppercase text-secondary">Rank: Elite</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <a className="group flex items-center gap-3 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary" href="#">
                <span className="material-symbols-outlined text-[20px]">house</span>
                <p className="font-headline text-sm font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1">Home</p>
              </a>
              <a className="group relative flex items-center gap-3 border-l-2 border-primary bg-surface-container-highest px-3 py-2 text-primary" href="#">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                <span className="material-symbols-outlined z-10 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  crossword
                </span>
                <p className="z-10 font-headline text-sm font-bold uppercase tracking-wider">Missions</p>
              </a>
              <a className="group flex items-center gap-3 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary" href="#">
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <p className="font-headline text-sm font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1">Armory</p>
              </a>
              <a className="group flex items-center gap-3 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary" href="#">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <p className="font-headline text-sm font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1">Profile</p>
              </a>
            </nav>
          </div>

          <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/15 p-4 font-mono text-[10px] text-on-surface-variant">
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

        <main className="relative z-10 flex flex-1 flex-col gap-10 overflow-y-auto p-6 md:p-10">
          <header className="mb-4">
            <h1 className="font-headline text-4xl font-bold uppercase tracking-[0.05em] text-on-surface">Game Zone</h1>
            <p className="mt-2 flex items-center gap-2 font-mono text-sm text-primary">
              <span className="material-symbols-outlined text-[16px]">subdirectory_arrow_right</span>
              Tactical Mini-Games Directory
            </p>
          </header>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-2">
              <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-secondary">KNN Matcher</h2>
              <span className="border border-secondary/30 bg-secondary/10 px-2 py-0.5 font-mono text-xs text-secondary">
                MODULE_01
              </span>
            </div>
            <div className="game-corner-br game-corner-tl relative border border-outline-variant/15 bg-surface-container-low p-1">
              <div className="group relative aspect-video w-full overflow-hidden border border-surface-container-highest bg-surface md:aspect-[21/9]">
                <div className="grid-bg absolute inset-0 opacity-50" />

                <div className="absolute left-1/4 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/20">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-primary/30">
                    <div className="absolute h-32 w-32 rounded-full border border-primary/40" />
                    <div className="radar-sweep absolute inset-0 rounded-full" />
                    <div className="absolute h-full w-1 bg-primary/50" />
                    <div className="absolute h-1 w-full bg-primary/50" />
                  </div>
                </div>

                <div className="absolute left-1/3 top-1/3 h-3 w-3 rounded-full bg-secondary shadow-[0_0_10px_#b2f746]" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-error shadow-[0_0_8px_#ff716c]" />
                <div className="absolute bottom-1/4 right-1/3 h-2 w-2 rounded-full bg-on-surface shadow-[0_0_8px_#dfe4fe]" />

                <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="33%" y1="33%" x2="50%" y2="50%" stroke="#41475b" strokeWidth="1" strokeDasharray="4" />
                  <line x1="33%" y1="33%" x2="66%" y2="75%" stroke="#41475b" strokeWidth="1" strokeDasharray="4" />
                </svg>

                <div className="absolute right-4 top-4 flex w-48 flex-col gap-2 border border-primary/30 bg-surface-variant/80 p-3 font-mono text-[10px] text-on-surface backdrop-blur-md">
                  <div className="mb-1 border-b border-primary/30 pb-1 text-primary">TARGET_DATA</div>
                  <div className="flex justify-between">
                    <span>DIST:</span>
                    <span>14.2u</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TYPE:</span>
                    <span className="text-secondary">HOSTILE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PROB:</span>
                    <span>87.4%</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between border-t border-outline-variant/30 bg-surface-container-highest/80 p-3 backdrop-blur">
                  <div className="font-mono text-xs text-on-surface-variant">AWAITING_INPUT_</div>
                  <button
                    type="button"
                    className="relative border-b-2 border-secondary bg-primary px-6 py-2 font-headline text-sm font-bold uppercase text-on-primary transition-all hover:shadow-[0_0_15px_#69f6b8]"
                  >
                    Execute Sweep
                    <div
                      className="absolute right-0 top-0 h-3 w-3 bg-surface-container-highest/80 backdrop-blur"
                      style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-2">
              <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-tertiary">Neural Playground</h2>
              <span className="border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 font-mono text-xs text-tertiary">
                MODULE_02
              </span>
            </div>
            <div className="game-corner-tl relative border border-outline-variant/15 bg-surface-container-low p-1">
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border border-surface-container-highest bg-[#040812] p-8 md:aspect-[21/9]">
                <div className="relative h-full w-full max-w-2xl">
                  <div className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-tertiary bg-surface font-mono text-xs text-tertiary shadow-[0_0_15px_rgba(97,194,255,0.2)]">
                      I1
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center border border-tertiary bg-surface font-mono text-xs text-tertiary shadow-[0_0_15px_rgba(97,194,255,0.2)]">
                      I2
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-6">
                    <div className="flex h-12 w-12 items-center justify-center border border-primary bg-surface font-mono text-xs text-primary shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                      H1
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center border border-primary bg-primary/20 font-mono text-xs text-primary shadow-[0_0_25px_rgba(105,246,184,0.5)]">
                      H2
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center border border-primary bg-surface font-mono text-xs text-primary shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                      H3
                    </div>
                  </div>

                  <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-secondary bg-secondary/20 font-mono text-xs text-secondary shadow-[0_0_20px_rgba(178,247,70,0.4)]">
                      O1
                    </div>
                  </div>

                  <svg className="-z-10 pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
                    <path d="M 40,25 C 150,25 200, -20 300,-20" fill="none" stroke="#41475b" strokeWidth="2" />
                    <path d="M 40,25 C 150,25 200, 60 300,60" fill="none" stroke="#69f6b8" strokeWidth="3" opacity="0.6" />
                    <path d="M 40,25 C 150,25 200, 140 300,140" fill="none" stroke="#41475b" strokeWidth="2" />
                    <path d="M 40,105 C 150,105 200, -20 300,-20" fill="none" stroke="#41475b" strokeWidth="2" />
                    <path d="M 40,105 C 150,105 200, 60 300,60" fill="none" stroke="#69f6b8" strokeWidth="2" opacity="0.4" />
                    <path d="M 40,105 C 150,105 200, 140 300,140" fill="none" stroke="#41475b" strokeWidth="2" />
                    <path d="M 348,-20 C 450,-20 500, 60 620,60" fill="none" stroke="#41475b" strokeWidth="2" />
                    <path d="M 348,60 C 450,60 500, 60 620,60" fill="none" stroke="#b2f746" strokeWidth="4" opacity="0.8" />
                    <path d="M 348,140 C 450,140 500, 60 620,60" fill="none" stroke="#41475b" strokeWidth="2" />
                  </svg>
                </div>

                <div className="absolute bottom-4 right-4 flex w-64 flex-col gap-3 border border-outline-variant/50 bg-surface-variant/90 p-4 backdrop-blur">
                  <div className="border-b border-outline-variant/50 pb-1 font-headline text-xs font-bold uppercase tracking-wide text-on-surface-variant">
                    Training Status
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-mono text-[10px] text-on-surface">
                      <span>EPOCH_PROGRESS</span>
                      <span className="text-secondary">65%</span>
                    </div>
                    <div className="flex h-3 w-full gap-[2px]">
                      {Array.from({ length: 20 }).map((_, index) => (
                        <div
                          key={`epoch-segment-${index}`}
                          className={`flex-1 ${index < 13 ? "bg-secondary" : "bg-surface-container-highest"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 font-mono text-[10px]">
                    <div className="flex-1 border border-outline-variant/30 bg-surface-container-low px-2 py-1">
                      <span className="block text-outline">LOSS</span>
                      <span className="text-error">0.024</span>
                    </div>
                    <div className="flex-1 border border-outline-variant/30 bg-surface-container-low px-2 py-1">
                      <span className="block text-outline">ACCURACY</span>
                      <span className="text-primary">97.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}

