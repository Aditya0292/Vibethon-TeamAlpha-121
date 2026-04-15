"use client"
import { useState, useEffect, useCallback } from "react"
import type { QuizQuestion } from "@/lib/gemini"

const TOPICS = ["Machine Learning", "Neural Networks", "Gradient Descent", "Loss Functions", "Optimizers", "Deep Learning"]
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]
const BLITZ_TIME = 15 // seconds per question

type Phase = "intro" | "loading" | "playing" | "result"

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const r = 36, c = 2 * Math.PI * r
  return (
    <div className="relative flex items-center justify-center">
        <svg width="100" height="100" className="rotate-[-90deg]">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--primary)" strokeWidth="4"
            strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
            strokeLinecap="square" className="transition-all duration-500" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-headline font-black text-xl text-primary">{label}</span>
            <span className="font-mono text-[8px] text-on-surface-variant uppercase">Accuracy</span>
        </div>
    </div>
  )
}

export default function QuizBlitz() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [topic, setTopic] = useState(TOPICS[0])
  const [difficulty, setDifficulty] = useState("Intermediate")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(BLITZ_TIME)
  const [xpEarned, setXpEarned] = useState(0)
  const [error, setError] = useState("")

  const question = questions[current]

  const submitAnswer = useCallback((ans: number | null) => {
    setAnswers(prev => {
      const next = [...prev]
      next[current] = ans
      return next
    })
    if (current + 1 >= questions.length) {
      setPhase("result")
    } else {
      setSelected(null)
      setTimeLeft(BLITZ_TIME)
      setCurrent(c => c + 1)
    }
  }, [current, questions.length])

  useEffect(() => {
    if (phase !== "playing" || selected !== null) return
    if (timeLeft <= 0) { submitAnswer(null); return }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft, selected, submitAnswer])

  useEffect(() => {
    if (phase !== "result") return
    const correct = answers.filter((a, i) => a === questions[i]?.correct).length
    setXpEarned(correct * 100)
  }, [phase, answers, questions])

  const startQuiz = async () => {
    setPhase("loading")
    setError("")
    try {
      const res = await fetch(`/api/quiz?topic=${encodeURIComponent(topic)}&difficulty=${difficulty.toLowerCase()}`)
      if (!res.ok) throw new Error("Synchronization failure with Syn_Intel Core.")
      const json = await res.json()
      const data: QuizQuestion[] = json.questions ?? json
      if (!data || data.length === 0) throw new Error("No telemetry data returned.")
      setQuestions(data.slice(0, 5))
      setAnswers([])
      setCurrent(0)
      setSelected(null)
      setTimeLeft(BLITZ_TIME)
      setPhase("playing")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Access Denied.")
      setPhase("intro")
    }
  }

  const reset = () => {
    setPhase("intro")
    setQuestions([])
    setAnswers([])
    setCurrent(0)
    setSelected(null)
    setXpEarned(0)
  }

  const correctCount = answers.filter((a, i) => a === questions[i]?.correct).length

  if (phase === "intro") return (
    <div className="flex flex-col gap-10 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-headline font-black text-on-surface uppercase tracking-tight">Intelligence Parameters</h2>
        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Select objective and difficulty for neural profiling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest flex items-center gap-2">
                <span className="size-1 bg-primary rounded-full animate-pulse" /> TARGET_TOPIC
            </label>
            <div className="flex flex-wrap gap-2">
            {TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase transition-all border ${
                    topic === t ? "bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(105,246,184,0.2)]" : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:border-primary/40"
                }`}>{t}</button>
            ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-mono text-[10px] text-secondary uppercase font-bold tracking-widest flex items-center gap-2">
                <span className="size-1 bg-secondary rounded-full animate-pulse" /> THREAT_LEVEL
            </label>
            <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase transition-all border ${
                    difficulty === d ? "bg-secondary text-on-secondary border-secondary shadow-[0_0_15px_rgba(255,165,0,0.2)]" : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:border-secondary/40"
                }`}>{d}</button>
            ))}
            </div>
          </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 p-4 font-mono text-[10px] text-error flex items-center gap-3">
             <span className="material-symbols-outlined text-sm">warning</span>
             <span>{error}</span>
        </div>
      )}

      <button onClick={startQuiz}
        className="w-full md:w-max px-12 py-4 bg-primary text-on-primary font-headline font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] shadow-[0_0_30px_rgba(105,246,184,0.2)] transition-all">
        Initiate Sync Sequence 🚀
      </button>
    </div>
  )

  if (phase === "loading") return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="size-12 border-2 border-primary border-t-transparent animate-spin" />
      <div className="text-center space-y-2">
        <p className="font-mono text-[10px] text-primary uppercase animate-pulse">Synchronizing with AI core...</p>
        <p className="font-mono text-[8px] text-on-surface-variant uppercase">Retrieving tactical assessment data</p>
      </div>
    </div>
  )

  if (phase === "result") return (
    <div className="flex flex-col gap-10 py-4">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-6">
          <h2 className="text-2xl font-headline font-black text-on-surface uppercase tracking-tight">After Action Report</h2>
          <div className="flex flex-col items-end">
             <p className="font-mono text-[10px] text-on-surface-variant uppercase">Status</p>
             <p className="font-headline font-bold text-lg text-primary">COMPLETE</p>
          </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
            <ProgressRing pct={(correctCount / 5) * 100} label={`${correctCount}/5`} />
            <div className="text-center md:text-left space-y-1">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase">XP_Rewards_Allocated</p>
                <p className="text-5xl font-headline font-black text-primary animate-pulse">+{xpEarned} XP</p>
            </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questions.map((q, i) => {
          const ua = answers[i]
          const isCorrect = ua === q.correct
          return (
            <div key={i} className={`p-6 border transition-all ${isCorrect ? "bg-primary/5 border-primary/20" : "bg-error/5 border-error/20 opacity-80"}`}>
              <div className="flex justify-between items-start mb-3">
                 <p className="font-mono text-[10px] text-on-surface-variant uppercase">Segment 0{i+1}</p>
                 <span className={`material-symbols-outlined text-[16px] ${isCorrect ? "text-primary" : "text-error"}`}>
                    {isCorrect ? "check_circle" : "cancel"}
                 </span>
              </div>
              <p className="font-headline font-bold text-on-surface mb-3 uppercase tracking-tight">{q.question}</p>
              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <p className={isCorrect ? "text-primary" : "text-error"}>
                  DETERMINED_AS: {ua !== null ? q.options[ua] : "NO_DATA_TIMEOUT"}
                </p>
                {!isCorrect && <p className="text-on-surface/60">THEORETICAL_IDEAL: {q.options[q.correct]}</p>}
                <p className="mt-3 p-3 bg-surface border border-outline-variant/10 text-on-surface-variant leading-relaxed">
                   <span className="text-primary font-bold mr-2">LOG:</span> {q.explanation}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={reset}
        className="px-12 py-4 bg-primary text-on-primary font-headline font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all">
        Recalibrate Operator
      </button>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-outline-variant/10 pb-6">
        <div className="flex flex-col gap-1">
             <span className="font-mono text-[9px] text-on-surface-variant uppercase">Assigned_Topic</span>
             <span className="font-headline font-bold text-xl text-on-surface uppercase">{topic}</span>
        </div>
        
        <div className="flex gap-12">
            <div className="flex flex-col items-center">
                 <span className="font-mono text-[9px] text-on-surface-variant uppercase">Time_Remaining</span>
                 <span className={`font-headline font-black text-2xl tabular-nums ${timeLeft <= 5 ? "text-error animate-shake" : "text-primary"}`}>
                    {timeLeft}s
                 </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] text-on-surface-variant uppercase mb-1">Sync_Progress</span>
                <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 border ${
                        i < current ? "bg-primary border-primary shadow-[0_0_8px_rgba(105,246,184,0.5)]" :
                        i === current ? "bg-surface-container-highest border-primary animate-pulse" : "bg-surface border-outline-variant/30"
                        }`} />
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="w-full h-1 bg-surface-container overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? "bg-error" : "bg-primary"}`}
          style={{ width: `${(timeLeft / BLITZ_TIME) * 100}%` }} />
      </div>

      <div className="p-8 border border-outline-variant/15 bg-surface-container-low shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
               <span className="material-symbols-outlined text-[100px] text-primary">data_object</span>
          </div>
          <p className="font-headline font-black text-xl text-on-surface leading-tight uppercase tracking-tight relative z-10 group-hover:text-primary transition-colors">
            {question?.question}
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question?.options.map((opt, idx) => {
          let style = "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:border-primary/50 hover:bg-surface-container-high"
          if (selected !== null) {
            if (idx === question.correct) style = "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(105,246,184,0.1)]"
            else if (idx === selected) style = "bg-error/20 border-error text-error"
            else style = "bg-surface opacity-40 border-outline-variant/10 text-on-surface-variant"
          }
          return (
            <button key={idx} disabled={selected !== null}
              onClick={() => {
                setSelected(idx)
                setTimeout(() => submitAnswer(idx), 900)
              }}
              className={`w-full text-left px-6 py-4 border font-mono text-xs font-bold transition-all relative overflow-hidden group/opt ${style}`}>
              <div className="flex justify-between items-center relative z-10">
                <span>{opt}</span>
                <span className="text-[10px] opacity-20 font-black group-hover/opt:opacity-100 transition-opacity">[{["A","B","C","D"][idx]}]</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
