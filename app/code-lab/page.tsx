"use client"
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { executeCode, challenges, CodingChallenge, validateChallenge } from "@/lib/piston";

type Message = {
  sender: "Syn_Intel" | "Operator";
  time: string;
  text: string;
  type?: "warning" | "success" | "info" | "error";
};

export default function CodeLabPage() {
  const [terminalInput, setTerminalInput] = useState("");
  const [sessionActive, setSessionActive] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAssisting, setIsAssisting] = useState(false);
  const [activeMsn, setActiveMsn] = useState<CodingChallenge>(challenges[0]);
  const [hintVisible, setHintVisible] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  
  const [code, setCode] = useState(activeMsn.starterCode);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Syn_Intel",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: "SYSTEM_ONLINE. Awaiting neural code synthesis from Operator 01.",
      type: "info",
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setCode(activeMsn.starterCode);
    setSuggestion("");
    setHintVisible(false);
    setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `NEW_MISSION: ${activeMsn.title}. OBJECTIVE: ${activeMsn.description}`,
        type: "info",
      }]);
  }, [activeMsn]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const newMsg: Message = {
      sender: "Operator",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: terminalInput,
    };

    setMessages((prev) => [...prev, newMsg]);
    const cmd = terminalInput.toUpperCase().trim();
    setTerminalInput("");

    setTimeout(() => {
      let response: Message = {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "COMMAND_RECOGNIZED: EXECUTION_PENDING...",
        type: "info",
      };

      if (cmd === "START" || cmd === "INITIATE") {
        setSessionActive(true);
        response.text = "SYSTEM_RE-INITIATED. SYNCHRONIZING_COGNITIVE_NODES...";
        response.type = "success";
      } else if (cmd === "STOP" || cmd === "HALT") {
        setSessionActive(false);
        response.text = "SYSTEM_HALTED. ALL_PROCESSES_SUSPENDED.";
        response.type = "warning";
      } else if (cmd === "HELP") {
        response.text = "AVAILABLE_COMMANDS: START, STOP, RESET, EXECUTE, HINT, SUGGEST, MSN_1..5";
      } else if (cmd === "EXECUTE" || cmd === "RUN") {
        evaluateCode();
        return;
      } else if (cmd === "HINT") {
          handleAssist("hint");
          return;
      } else if (cmd === "SUGGEST") {
          handleAssist("suggest");
          return;
      } else if (cmd === "CLEAN" || cmd === "CLEAR") {
        setMessages([]);
        return;
      } else if (cmd.startsWith("MSN_")) {
          const idx = parseInt(cmd.split("_")[1]) - 1;
          if (challenges[idx]) {
              setActiveMsn(challenges[idx]);
              return;
          }
      } 
      setMessages((prev) => [...prev, response]);
    }, 400);
  };

  const handleAssist = async (type: "suggest" | "hint") => {
    if (!sessionActive || isAssisting) return;
    setIsAssisting(true);

    try {
        const res = await fetch("/api/code-assist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, mission: activeMsn.title, type })
        });
        const data = await res.json();
        
        if (type === "hint") {
            setMessages((prev) => [...prev, {
                sender: "Syn_Intel",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `TACTICAL_HINT: ${data.message}`,
                type: "warning",
            }]);
        } else {
            setSuggestion(data.message);
        }
    } catch (err) {
        setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: "ERROR: Assistance downlink compromised.",
            type: "error",
        }]);
    } finally {
        setIsAssisting(false);
    }
  };

  const evaluateCode = async () => {
    if (!sessionActive) {
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "ERROR: System offline. Use 'START' to restore power.",
        type: "error",
      }]);
      return;
    }

    setIsEvaluating(true);
    setMessages((prev) => [...prev, {
      sender: "Operator",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: "EXECUTING_ALGORITHMIC_STEP...",
    }]);

    try {
      const { output, error } = await executeCode(code);
      
      if (output) {
         setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `>>> OUT:\n${output}`,
            type: "info",
          }]);
      }
      
      if (error) {
         setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `>>> ERR:\n${error}`,
            type: "error",
          }]);
      }

      const isCorrect = validateChallenge(output, activeMsn.expectedOutput);

      const res = await fetch("/api/code-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, challenge: activeMsn.title, output, error, isCorrect })
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: data.message,
        type: data.message.includes("APPROVED") ? "success" : "warning",
      }]);

      if (isCorrect) {
          setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            text: `MISSION_SUCCESS: Objective ${activeMsn.title} finalized. XP Gain: +${activeMsn.xp}`,
            type: "success",
          }]);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "COMMUNICATION_FAILURE: Neural link terminated unexpectedly.",
        type: "error",
      }]);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-50 scanlines mix-blend-screen" />
      <Sidebar />

      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col overflow-y-auto min-h-screen relative z-10">
          <div className="mb-8 flex justify-between items-end border-b border-outline-variant/10 pb-6">
            <div>
              <h1 className="text-3xl font-headline font-black uppercase text-on-surface tracking-widest flex items-center gap-2">
                SYN_INTEL LAB <span className="text-primary animate-pulse">_</span>
              </h1>
              <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em] mt-2">
                AI_Ensemble: Gemini | OpenRouter | Grok
              </p>
            </div>
            <div className="flex gap-10 items-center">
                 <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase">Current_Mission</span>
                    <span className="font-headline font-bold text-xl text-primary">{activeMsn.id.split('_').slice(1).join('_').toUpperCase()}</span>
                 </div>
                 <div className="h-10 w-[1px] bg-outline-variant/20" />
                 <div className="flex px-4 py-2 border border-primary/20 bg-primary/5 gap-3">
                    <button onClick={() => handleAssist("hint")} disabled={isAssisting} className="font-mono text-[10px] text-primary hover:text-white transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lightbulb</span> REQUEST_HINT
                    </button>
                    <div className="w-[1px] h-4 bg-primary/20" />
                    <button onClick={() => handleAssist("suggest")} disabled={isAssisting} className="font-mono text-[10px] text-secondary hover:text-white transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">auto_fix</span> GET_SUGGESTION
                    </button>
                 </div>
            </div>
          </div>

          <div className="flex flex-col 2xl:flex-row gap-8 flex-1 mb-8 overflow-hidden">
            <div className="w-full 2xl:w-[380px] flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {challenges.map((msn, idx) => (
                <div 
                    key={msn.id} 
                    onClick={() => setActiveMsn(msn)}
                    className={`p-6 relative group cursor-pointer transition-all border shadow-2xl overflow-hidden ${activeMsn.id === msn.id ? "bg-surface-container-high border-primary/50" : "bg-surface-container-low/40 border-outline-variant/10 hover:border-primary/30"}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`font-mono text-[9px] px-2 py-0.5 border ${activeMsn.id === msn.id ? "bg-primary text-on-primary border-primary" : "text-on-surface-variant border-outline-variant/20"}`}>
                            MSN_0{idx + 1}
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-outline-variant/40">rocket</span>
                    </div>
                    <h4 className="font-headline font-black text-on-surface text-base mb-2 uppercase group-hover:text-primary transition-colors">
                        {msn.title}
                    </h4>
                    <p className="font-body text-[11px] text-on-surface-variant leading-relaxed opacity-70">
                        {msn.description}
                    </p>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col gap-6 min-h-[700px]">
                <div className="flex-1 border border-outline-variant/20 bg-[#060a15] relative overflow-hidden shadow-2xl flex flex-col group">
                    <div className="flex items-center justify-between border-b border-outline-variant/15 bg-surface-container-low/80 backdrop-blur-md px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                            <span className="font-mono text-xs text-on-surface font-bold uppercase">neural_synthesis.py</span>
                        </div>
                        <button onClick={evaluateCode} disabled={isEvaluating || !sessionActive} className="px-8 py-2.5 bg-primary text-on-primary font-headline font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(105,246,184,0.3)]">
                            {isEvaluating ? "SYNTHESIZING..." : "EXECUTE_SEQUENCE"}
                        </button>
                    </div>

                    <div className={`flex-1 flex overflow-hidden relative ${!sessionActive || isEvaluating ? "opacity-40" : ""}`}>
                        <div className="w-[50px] bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col items-center py-6 text-on-surface-variant/20 font-mono text-[11px] select-none">
                            {code.split('\n').map((_, i) => <span key={i} className="h-[22px]">{i + 1}</span>)}
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            className="flex-1 bg-transparent text-primary/80 font-mono text-sm leading-[22px] p-6 resize-none outline-none custom-scrollbar whitespace-pre w-full h-full"
                        />
                    </div>

                    {suggestion && (
                        <div className="absolute bottom-4 right-4 max-w-sm bg-surface-container-high border border-secondary/30 p-4 shadow-2xl animate-fade-in z-30">
                            <div className="flex justify-between items-center mb-2 border-b border-outline-variant/10 pb-1">
                                <span className="font-mono text-[9px] text-secondary uppercase font-bold">Tactical Suggestion</span>
                                <button onClick={() => setSuggestion("")} className="material-symbols-outlined text-[14px]">close</button>
                            </div>
                            <p className="font-mono text-[10px] text-on-surface-variant leading-relaxed">
                                {suggestion}
                            </p>
                        </div>
                    )}
                </div>

                <div className="h-[340px] border border-primary/20 bg-[#080d19] shadow-2xl flex flex-col relative z-20">
                     <div className="px-4 py-2.5 border-b border-primary/10 flex justify-between items-center bg-primary/5">
                        <span className="font-headline font-black text-[10px] uppercase tracking-widest text-on-surface flex items-center gap-2">SYN_INTEL COGNITIVE_BUFFER</span>
                        {isAssisting && <div className="text-secondary font-mono text-[9px] animate-pulse">DOWNLINK_ACTIVE...</div>}
                    </div>
                    <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col gap-1.5 ${m.sender === "Operator" ? "items-end" : "items-start"}`}>
                                <div className="font-mono text-[8px] text-on-surface-variant/60 uppercase">{m.sender} {"//"} {m.time}</div>
                                <div className={`border font-mono text-[11px] p-4 max-w-[90%] whitespace-pre-wrap ${m.sender === "Operator" ? "bg-surface/20 border-outline-variant/10" : (m.type === 'error' ? 'bg-error/10 border-error/20 text-error' : (m.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface/40 border-outline-variant/10'))}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleCommand} className="p-3 border-t border-outline-variant/10 bg-surface-container-low flex">
                        <input value={terminalInput} onChange={e => setTerminalInput(e.target.value)} placeholder="ENTER_COMMAND... (HINT/SUGGEST)" className="flex-1 bg-transparent border-none text-on-surface font-mono text-[11px] outline-none placeholder-on-surface-variant/20 uppercase" />
                    </form>
                </div>
            </div>
          </div>
        </main>
    </div>
  );
}
