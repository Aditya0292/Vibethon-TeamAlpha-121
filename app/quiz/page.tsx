"use client"
import QuizBlitz from "./quiz-blitz"
import Sidebar from "@/components/dashboard/Sidebar";

export default function QuizPage() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 scanlines mix-blend-screen" />

      <Sidebar />

      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col min-h-screen relative z-10">
        <header className="mb-10 flex justify-between items-end border-b border-outline-variant/10 pb-6 uppercase">
          <div>
            <h1 className="text-4xl font-headline font-black text-on-surface tracking-widest flex items-center gap-3">
              Quiz Arena <span className="text-primary animate-pulse">{"//"}</span>
            </h1>
            <p className="font-mono text-[10px] text-secondary tracking-[0.4em] mt-3">
              Cognitive_Profiling {"//"} Neural_Assessment_Unit
            </p>
          </div>
          <div className="flex gap-8 font-mono text-[10px]">
             <div className="flex flex-col items-end">
                <span className="text-on-surface-variant">Unit_Status</span>
                <span className="text-primary">ACTIVE</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-on-surface-variant">Assessment_Type</span>
                <span className="text-secondary text-right">AI_ENCORE</span>
             </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto w-full relative">
           {/* Decorative elements */}
           <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-primary/30" />
           <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-primary/30" />

           <div className="glass-panel border border-outline-variant/15 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                  <span className="material-symbols-outlined text-[64px] text-primary">analytics</span>
              </div>
              <QuizBlitz />
           </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto flex justify-between items-center text-[10px] font-mono text-on-surface-variant uppercase tracking-widest px-2">
            <div className="flex items-center gap-2">
                <span className="size-1.5 bg-primary/40 rounded-full" />
                <span>Synchronizing with Syn_Intel Core...</span>
            </div>
            <div className="flex gap-4">
                <span>Ref: AI_QUIZ_V10.2</span>
                <span>Port: 8081</span>
            </div>
        </div>
      </main>
    </div>
  )
}
