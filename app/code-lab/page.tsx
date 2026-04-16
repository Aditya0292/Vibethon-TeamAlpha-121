"use client"

import React, { useState, useEffect, useRef } from "react"
import { Editor } from "@monaco-editor/react"
import { 
  ChevronRight, 
  Terminal as TerminalIcon, 
  Play, 
  Cpu, 
  ShieldCheck, 
  Activity,
  Code2,
  Lock,
  Zap,
  MessageSquare,
  ChevronLeft,
  Settings,
  BrainCircuit,
  Target
} from "lucide-react"
import Sidebar from "@/components/dashboard/Sidebar"
import { challenges, CodingChallenge } from "@/lib/piston"
import { calculateLevel, getProgressToNextLevel } from "@/lib/xp"

export default function CodeLabPage() {
  // Session Stats & Progression
  const [totalXp, setTotalXp] = useState(0)
  const [completedMsns, setCompletedMsns] = useState<string[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  
  // Mission State
  const [activeMsn, setActiveMsn] = useState<CodingChallenge>(challenges[0])
  const [code, setCode] = useState(activeMsn.starterCode)
  
  // Tactical Buffers
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] > NEURAL_OS v4.2.0 INITIALIZED",
    "[SYSTEM] > WAITING FOR OPERATOR SEQUENCE..."
  ])
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState<"briefing" | "advisor">("briefing")

  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  // Tactical Initializer: Fetch live state and find first incomplete mission
  useEffect(() => {
    async function syncProgress() {
      try {
        const res = await fetch("/api/xp")
        const profile = await res.json()
        if (profile) {
          setTotalXp(profile.xp || 0)
          const done = profile.completed_msns || []
          setCompletedMsns(done)
          
          // Auto-select first incomplete mission
          const nextIncomplete = challenges.find(c => !done.includes(c.id))
          if (nextIncomplete) {
            setActiveMsn(nextIncomplete)
          }
        }
      } catch (err) {
        console.error("Progression sync failed:", err)
      } finally {
        setIsInitializing(false)
      }
    }
    syncProgress()
  }, [])

  // Sync code when mission changes
  useEffect(() => {
    setCode(activeMsn.starterCode)
    setSuggestion(null)
    setLogs([`[SYSTEM] > MISSION_UPLINK: ${activeMsn.title} ESTABLISHED.`])
  }, [activeMsn])

  const executeSequence = async () => {
    if (isExecuting) return
    setIsExecuting(true)
    
    setLogs(prev => [...prev, `[SYSTEM] > ${new Date().toLocaleTimeString()} :: INITIATING_GRADIENT_PASS...`])

    try {
      const response = await fetch("/api/code-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code, 
          challengeId: activeMsn.id, 
          userId: "test-user-1" 
        }),
      })

      const data = await response.json()

      if (data.error) setLogs(prev => [...prev, `[ERROR] > ${data.error}`])
      if (data.output) setLogs(prev => [...prev, `[STDOUT] > ${data.output}`])
      
      if (data.feedback) {
        setSuggestion(data.feedback)
        setActiveTab("advisor")
      }

      if (data.passed) {
        setLogs(prev => [
          ...prev, 
          `[SYSTEM] > MISSION_COMPLETE. XP_ACQUIRED: ${data.xp_earned}`
        ])
        setTotalXp(prev => prev + data.xp_earned)
        
        // Update local completion state
        const updatedDone = [...completedMsns, activeMsn.id]
        setCompletedMsns(updatedDone)

        // AUTO-PROGRESS: find next mission after a short delay
        setTimeout(() => {
          const currentIndex = challenges.findIndex(c => c.id === activeMsn.id)
          const nextMsn = challenges[currentIndex + 1]
          if (nextMsn) {
            setLogs(prev => [...prev, `[SYSTEM] > NEXT_OBJECTIVE_ID: ${nextMsn.id} :: INITIATING_UPLINK...`])
            setActiveMsn(nextMsn)
          } else {
            setLogs(prev => [...prev, `[SYSTEM] > ALL_TACTICAL_OBJECTIVES_SECURED. COMMANDER_RATING: OPTIMAL.`])
          }
        }, 2500)

      } else if (data.output || data.error) {
        setLogs(prev => [...prev, `[SYSTEM] > MISSION_FAILED: LOGIC_FAULT_DETECTED.`])
      }

    } catch (err) {
      setLogs(prev => [...prev, `[ERROR] > UPLINK_LOST: CORE_FAULT.`])
    } finally {
      setIsExecuting(false)
    }
  }

  const { current, needed, percentage } = getProgressToNextLevel(totalXp)
  const currentLevel = calculateLevel(totalXp)

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden font-mono relative">
      <Sidebar title="Nova_Core" />

      {/* Main Command Deck */}
      <div className="flex-1 ml-72 flex flex-col min-w-0 bg-background">
        
        {/* Tactical Header */}
        <header className="h-20 border-b border-outline-variant/30 flex items-center justify-between px-8 bg-surface-container-high/40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
               <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                         <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Operator_Uplink: Live</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-on-surface uppercase italic">
                         {activeMsn.title}
                    </h1>
               </div>
          </div>

          {/* XP Telemetry */}
          <div className="flex items-center gap-8">
               <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">{currentLevel}</span>
                        <span className="text-xs font-black text-primary">{totalXp} XP</span>
                    </div>
                    <div className="w-48 h-1 bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/20">
                        <div 
                            className="h-full bg-gradient-to-r from-primary-container to-primary shadow-[0_0_10px_rgba(105,246,184,0.5)] transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="text-[8px] text-on-surface-variant opacity-60 uppercase tracking-tighter italic">Next Sync: {needed} XP required</span>
               </div>

               <button 
                    onClick={executeSequence}
                    disabled={isExecuting}
                    className={`
                         relative group flex items-center gap-3 px-8 py-3 rounded-sm font-black text-sm tracking-tighter transition-all duration-500
                         ${isExecuting 
                             ? "bg-surface-container-highest text-on-surface-variant opacity-50 scale-95" 
                             : "bg-primary text-on-primary hover:bg-primary-dim shadow-[0_0_25px_rgba(105,246,184,0.3)] active:scale-90 overflow-hidden"
                         }
                    `}
               >
                    {!isExecuting && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 italic" />}
                    <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} fill="currentColor" />
                    <span className="relative z-10">{isExecuting ? "SYNCING..." : "EXECUTE_SEQUENCE"}</span>
               </button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          
          {/* Left Wing: Mission Matrix */}
          <div className="w-72 border-r border-outline-variant/30 bg-surface-container-low/40 flex flex-col">
               <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <Target className="w-3 h-3 text-on-surface-variant opacity-60" />
                         <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Mission_Matrix</span>
                    </div>
               </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {isInitializing ? (
                         <div className="p-4 text-[10px] text-slate-600 animate-pulse italic">Decoding_Matrix...</div>
                    ) : challenges.map((msn) => {
                         const isLocked = totalXp < msn.requiredXp
                         const isActive = activeMsn.id === msn.id
                         const isDone = completedMsns.includes(msn.id)
                         return (
                              <button
                                   key={msn.id}
                                   disabled={isLocked}
                                   onClick={() => setActiveMsn(msn)}
                                   className={`
                                        w-full p-4 rounded-sm border text-left transition-all group relative overflow-hidden
                                        ${isActive 
                                             ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(105,246,184,0.1)]" 
                                             : "bg-transparent border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface-container-high/40"
                                        }
                                        ${isLocked ? "opacity-40 cursor-not-allowed grayscale" : ""}
                                   `}
                              >
                                   <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                             <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
                                                  [{msn.difficulty}]
                                             </span>
                                             {isDone && (
                                                  <span className="text-[8px] bg-primary text-on-primary px-1 font-black">DONE</span>
                                             )}
                                        </div>
                                        {isLocked ? (
                                            <Lock className="w-3 h-3 text-on-surface-variant opacity-40" />
                                        ) : isDone ? (
                                             <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant animate-pulse" />
                                        )}
                                   </div>
                                   <div className={`text-xs font-bold ${isActive ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                                        {msn.title}
                                   </div>
                                   <div className="text-[9px] text-on-surface-variant opacity-50 mt-1 line-clamp-1 italic">
                                        {isLocked ? `Sync Required: ${msn.requiredXp} XP` : msn.shortDesc}
                                   </div>
                              </button>
                         )
                    })}
               </div>
          </div>

          {/* Center: Core Control */}
          <div className="flex-1 flex flex-col min-w-0 bg-background/50">
               <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        options={{
                            fontSize: 14,
                            fontFamily: 'JetBrains Mono, monospace',
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            padding: { top: 20 }
                        }}
                    />
               </div>
               {/* Terminal Buffer */}
               <div className="h-64 border-t border-outline-variant/30 flex flex-col bg-black/60 relative overflow-hidden">
                    <div className="h-8 border-b border-outline-variant/30 bg-surface-container-high/50 flex items-center justify-between px-4">
                         <div className="flex items-center gap-2">
                              <TerminalIcon className="w-3 h-3 text-primary" />
                              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Neural_Buffer_Output</span>
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                         {logs.map((log, i) => (
                              <div key={i} className={`text-xs flex gap-3 ${
                                   log.startsWith("[ERROR]") ? "text-error" :
                                   log.startsWith("[STDOUT]") ? "text-primary" :
                                   log.startsWith("[SYSTEM]") ? "text-on-surface-variant opacity-60" : "text-tertiary"
                              }`}>
                                   <span className="opacity-30 shrink-0 select-none">{i+1}</span>
                                   <span className="whitespace-pre-wrap">{log}</span>
                              </div>
                         ))}
                         <div ref={terminalEndRef} />
                    </div>
               </div>
          </div>

           {/* Right Wing: AI Advisor */}
          <div className="w-80 border-l border-outline-variant/30 bg-surface-container-low/60 flex flex-col">
               <div className="flex border-b border-outline-variant/30">
                    <button 
                        onClick={() => setActiveTab("briefing")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black tracking-widest uppercase transition-all
                            ${activeTab === 'briefing' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant opacity-60 hover:text-on-surface'}
                        `}
                    >
                        <Zap className="w-3 h-3" /> Briefing
                    </button>
                    <button 
                        onClick={() => setActiveTab("advisor")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black tracking-widest uppercase transition-all
                            ${activeTab === 'advisor' ? 'bg-tertiary/10 text-tertiary border-b-2 border-tertiary' : 'text-on-surface-variant opacity-60 hover:text-on-surface'}
                        `}
                    >
                        <BrainCircuit className="w-3 h-3" /> Syn_Intel
                    </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 transition-all duration-500">
                    {activeTab === "briefing" ? (
                         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                               <div className="space-y-2">
                                   <span className="text-[10px] text-primary opacity-60 font-black uppercase tracking-widest">Objective</span>
                                   <p className="text-sm leading-relaxed text-on-surface-variant font-medium">
                                        {activeMsn.description}
                                   </p>
                              </div>
                              <div className="p-4 rounded-sm bg-primary/5 border border-primary/20 space-y-2">
                                   <div className="flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">Tactical_Parameters</span>
                                   </div>
                                   <div className="text-[11px] text-on-surface-variant space-y-1">
                                        <div className="flex justify-between">
                                             <span>XP Reward:</span>
                                             <span className="text-primary font-bold">+{activeMsn.xp}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span>Difficulty:</span>
                                             <span className="text-primary">{activeMsn.difficulty}</span>
                                        </div>
                                   </div>
                              </div>
                              <div className="space-y-2">
                                   <span className="text-[10px] text-on-surface-variant opacity-60 font-bold uppercase tracking-widest">Field_Notes</span>
                                   <p className="text-[11px] text-on-surface-variant opacity-50 italic leading-relaxed">
                                        Ensure the output is strictly formatted as requested. Syn_Intel will analyze all execution pulses.
                                   </p>
                              </div>
                         </div>
                    ) : (
                         <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                               <div className="p-5 rounded-sm bg-tertiary/5 border border-tertiary/20 relative group overflow-hidden">
                                   <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <BrainCircuit className="w-8 h-8 text-tertiary" />
                                   </div>
                                   <div className="flex items-center gap-2 mb-4">
                                        <MessageSquare className="w-3 h-3 text-tertiary" />
                                        <span className="text-[10px] text-tertiary font-black uppercase tracking-widest">Neural_Analysis</span>
                                   </div>
                                   <div className="text-[13px] text-on-surface leading-relaxed font-medium italic">
                                        {suggestion ? suggestion : "Awaiting code execution pulse. Analyze the parameters in the Briefing tab to begin calibration."}
                                   </div>
                              </div>
                              
                              {activeMsn.hint && (
                                   <div className="space-y-3 p-4 border-l-2 border-outline-variant/30">
                                        <span className="text-[10px] text-on-surface-variant opacity-60 font-bold uppercase tracking-widest">Direct_Link_Hint</span>
                                        <p className="text-[11px] text-on-surface-variant opacity-50 leading-relaxed">
                                             {activeMsn.hint}
                                        </p>
                                   </div>
                              )}
                         </div>
                    )}
               </div>

               {/* Stats Footer */}
               <div className="p-4 border-t border-outline-variant/30 bg-black/40 text-[9px] text-on-surface-variant opacity-60 space-y-2">
                    <div className="flex justify-between">
                         <span className="uppercase tracking-widest">System_Integrity</span>
                         <span className="text-primary font-bold">OPTIMAL</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="uppercase tracking-widest">Neural_Load</span>
                         <span>0.0032ms</span>
                    </div>
               </div>
          </div>
        </div>
      </div>
    </div>
  )
}
