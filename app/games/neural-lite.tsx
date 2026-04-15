"use client"
import { useEffect, useRef, useState, useCallback } from "react"

type ActivationFn = "relu" | "sigmoid"
type Dataset = "circle" | "cross"

function relu(x: number) { return Math.max(0, x) }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)) }
function activate(x: number, fn: ActivationFn) { return fn === "relu" ? relu(x) : sigmoid(x) }

function circleLabel(x: number, y: number) {
  return (x * x + y * y) < 0.4 ? 1 : 0
}
function crossLabel(x: number, y: number) {
  return (Math.abs(x) < 0.25 || Math.abs(y) < 0.25) ? 1 : 0
}

function randomWeights(rows: number, cols: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * 2)
  )
}

type Network = {
  w1: number[][]
  b1: number[]
  w2: number[][]
  b2: number[]
  w3?: number[][]
  b3?: number[]
}

function buildNet(layers: 1 | 2): Network {
  const h = 3 // changed from 8 to 3 to match UI (H1, H2, H3)
  if (layers === 1) {
    return {
      w1: randomWeights(h, 2),
      b1: Array(h).fill(0),
      w2: randomWeights(1, h),
      b2: [0]
    }
  }
  return {
    w1: randomWeights(h, 2),
    b1: Array(h).fill(0),
    w2: randomWeights(h, h),
    b2: Array(h).fill(0),
    w3: randomWeights(1, h),
    b3: [0]
  }
}

function forward(net: Network, x: number, y: number, act: ActivationFn): number {
  const inp = [x, y]
  const h1 = net.w1.map((row, i) => activate(row[0] * inp[0] + row[1] * inp[1] + net.b1[i], act))
  if (!net.w2 || !net.b2) return 0.5
  if (net.w3 && net.b3) {
    const h2 = net.w2.map((row, i) => activate(row.reduce((s, w, j) => s + w * h1[j], 0) + net.b2[i], act))
    const out = net.w3[0].reduce((s, w, j) => s + w * h2[j], 0) + net.b3[0]
    return sigmoid(out)
  }
  const out = net.w2[0].reduce((s, w, j) => s + w * h1[j], 0) + net.b2[0]
  return sigmoid(out)
}

function trainStep(net: Network, act: ActivationFn, dataset: Dataset, lr = 0.15): number {
  let loss = 0
  const N = 40
  for (let i = 0; i < N; i++) {
    const x = (Math.random() - 0.5) * 2
    const y = (Math.random() - 0.5) * 2
    const label = dataset === "circle" ? circleLabel(x, y) : crossLabel(x, y)
    const pred = forward(net, x, y, act)
    loss += -label * Math.log(pred + 1e-8) - (1 - label) * Math.log(1 - pred + 1e-8)
    const err = pred - label
    net.w1.forEach(row => { row[0] -= lr * err * x * 0.1; row[1] -= lr * err * y * 0.1 })
    net.b1.forEach((_, i) => { net.b1[i] -= lr * err * 0.05 })
    if (net.w3) {
      net.w3[0].forEach((_, j) => { net.w3![0][j] -= lr * err * 0.1 })
      net.b3![0] -= lr * err * 0.05
    } else {
      net.w2[0].forEach((_, j) => { net.w2[0][j] -= lr * err * 0.1 })
      net.b2[0] -= lr * err * 0.05
    }
  }
  return loss / N
}

export default function NeuralLite() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const netRef = useRef<Network | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [layers, setLayers] = useState<1 | 2>(1)
  const [act, setAct] = useState<ActivationFn>("relu")
  const [dataset, setDataset] = useState<Dataset>("circle")
  const [running, setRunning] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState<number | null>(null)

  const drawHeatMap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !netRef.current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    
    // Clear and draw scanlines
    ctx.clearRect(0,0,W,H)
    ctx.fillStyle = "rgba(105, 246, 184, 0.02)"
    for(let y=0; y<H; y+=4) { ctx.fillRect(0, y, W, 1) }

    if (!running && epoch === 0) return // Don't draw heatmap before start

    const step = 8 // larger step for pixelated style
    ctx.globalCompositeOperation = "source-over"
    
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const x = (px / W) * 2 - 1
        const y = (py / H) * 2 - 1
        const pred = forward(netRef.current, x, y, act)
        // Primary vs Error colors based on prediction
        const r = Math.round(105 * pred + 255 * (1 - pred))
        const g = Math.round(246 * pred + 84 * (1 - pred))
        const b = Math.round(184 * pred + 73 * (1 - pred))
        ctx.fillStyle = `rgba(${r},${g},${b},0.15)`
        ctx.fillRect(px, py, step, step)
      }
    }
    
    // Draw decision boundary overlay dots
    const MathLabel = dataset === "circle" ? circleLabel : crossLabel
    for (let i = 0; i < 40; i++) {
      const nx = Math.random(), ny = Math.random()
      const lx = nx * 2 - 1, ly = ny * 2 - 1
      const cls = MathLabel(lx, ly)
      ctx.beginPath()
      ctx.fillRect(nx * W - 2, ny * H - 2, 4, 4)
      ctx.fillStyle = cls === 1 ? "rgba(105,246,184,0.6)" : "rgba(255,84,73,0.6)"
      ctx.fill()
    }
  }, [act, dataset, running, epoch])

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    stop()
    netRef.current = buildNet(layers)
    setEpoch(0)
    setLoss(null)
    setRunning(true)
    let ep = 0
    timerRef.current = setInterval(() => {
      if (!netRef.current) return
      const l = trainStep(netRef.current, act, dataset)
      ep++
      setEpoch(ep)
      setLoss(l)
      drawHeatMap()
      if (ep >= 100) stop() // Max epochs 100
    }, 40)
  }, [layers, act, dataset, drawHeatMap, stop])

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    if (!running) drawHeatMap()
  }, [running, drawHeatMap])

  return (
    <div className="flex flex-col gap-0 w-full relative">
      
      {/* Visual Workspace Container */}
      <div className="relative w-full h-[420px] bg-[#040812] border border-outline-variant/20 overflow-hidden flex items-center justify-center">
        {/* Canvas for Heatmap */}
        <canvas ref={canvasRef} width={800} height={420} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        
        {/* DOM-based Neural Network Visualizer Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-10 w-full max-w-2xl mx-auto">
          {/* SVG for connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
             {/* Lines from Input to Hidden */}
             <line x1="20%" y1="40%" x2="50%" y2="25%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="20%" y1="40%" x2="50%" y2="50%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="20%" y1="40%" x2="50%" y2="75%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             
             <line x1="20%" y1="60%" x2="50%" y2="25%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="20%" y1="60%" x2="50%" y2="50%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="20%" y1="60%" x2="50%" y2="75%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />

             {/* Lines from Hidden to Output */}
             <line x1="50%" y1="25%" x2="80%" y2="50%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="50%" y1="75%" x2="80%" y2="50%" stroke="rgba(105,246,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Node Layers */}
          <div className="w-full flex justify-between items-center px-[20%]">
             {/* Input Layer */}
             <div className="flex flex-col gap-12">
               <div className="w-10 h-10 border-2 border-primary/40 bg-surface-container flex items-center justify-center font-mono text-[10px] text-primary shadow-[0_0_10px_rgba(105,246,184,0.1)]">I1</div>
               <div className="w-10 h-10 border-2 border-primary/40 bg-surface-container flex items-center justify-center font-mono text-[10px] text-primary shadow-[0_0_10px_rgba(105,246,184,0.1)]">I2</div>
             </div>

             {/* Hidden Layer 1 */}
             <div className="flex flex-col gap-6">
               <div className={`w-10 h-10 border-2 border-primary bg-black flex items-center justify-center font-mono text-[10px] text-primary ${running ? 'animate-pulse shadow-[0_0_15px_rgba(105,246,184,0.4)]' : ''}`}>H1</div>
               <div className={`w-10 h-10 border-2 border-primary bg-black flex items-center justify-center font-mono text-[10px] text-primary ${running ? 'animate-pulse shadow-[0_0_15px_rgba(105,246,184,0.4)]' : ''}`} style={{ animationDelay: "100ms" }}>H2</div>
               <div className={`w-10 h-10 border-2 border-primary bg-black flex items-center justify-center font-mono text-[10px] text-primary ${running ? 'animate-pulse shadow-[0_0_15px_rgba(105,246,184,0.4)]' : ''}`} style={{ animationDelay: "200ms" }}>H3</div>
             </div>

             {/* Output Layer */}
             <div className="flex flex-col">
               <div className={`w-10 h-10 border-2 border-secondary bg-[#1a1400] flex items-center justify-center font-mono text-[10px] text-secondary ${running ? 'animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)]' : ''}`}>O1</div>
             </div>
          </div>
        </div>

        {/* Floating Training Status Box */}
        <div className="absolute right-6 bottom-6 z-20 bg-surface-container-highest border border-outline-variant/30 p-4 w-64 shadow-2xl hidden md:block group">
           <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface mb-3 border-b border-outline-variant/30 pb-2">Training Status</h4>
           
           <div className="mb-4">
             <div className="flex justify-between font-mono text-[9px] uppercase text-on-surface-variant mb-1">
               <span>Epoch_Progress</span>
               <span className="text-secondary">{epoch}%</span>
             </div>
             <div className="flex gap-0.5 h-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`flex-1 ${i < (epoch/100 * 20) ? "bg-secondary" : "bg-surface-container-high"}`} />
                ))}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-container flex flex-col p-2 border border-outline-variant/20">
                <span className="font-mono text-[8px] uppercase text-on-surface-variant">Loss</span>
                <span className="font-mono text-xs text-error mt-0.5">{loss !== null ? loss.toFixed(3) : "---"}</span>
              </div>
              <div className="bg-surface-container flex flex-col p-2 border border-outline-variant/20">
                <span className="font-mono text-[8px] uppercase text-on-surface-variant">Accuracy</span>
                <span className="font-mono text-xs text-primary mt-0.5">
                  {loss !== null ? Math.min(99.9, Math.max(0, (1 - loss)*100)).toFixed(1) + "%" : "---"}
                </span>
              </div>
           </div>
        </div>

      </div>

      {/* Bottom Control Bar */}
      <div className="bg-surface-container-high border-x border-b border-outline-variant/20 flex flex-col md:flex-row items-center justify-between p-3 gap-4">
        
        {/* Settings Toggles */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-on-surface-variant font-mono text-[10px] uppercase">
          
          {/* Activation */}
          <div className="flex items-center gap-2">
            <span className="opacity-60 hidden md:inline">ACT:</span>
            <div className="flex border border-outline-variant/30">
               <button onClick={() => { setAct("relu"); stop() }} className={`px-2 py-1 transition-all ${act === "relu" ? "bg-primary/20 text-primary" : "hover:text-primary hover:bg-surface-container"}`}>RELU</button>
               <button onClick={() => { setAct("sigmoid"); stop() }} className={`px-2 py-1 border-l border-outline-variant/30 transition-all ${act === "sigmoid" ? "bg-primary/20 text-primary" : "hover:text-primary hover:bg-surface-container"}`}>SIGMD</button>
            </div>
          </div>

          {/* Dataset */}
          <div className="flex items-center gap-2">
            <span className="opacity-60 hidden md:inline">DATA:</span>
            <div className="flex border border-outline-variant/30">
               <button onClick={() => { setDataset("circle"); stop() }} className={`px-2 py-1 transition-all ${dataset === "circle" ? "bg-primary/20 text-primary" : "hover:text-primary hover:bg-surface-container"}`}>CIRCLE</button>
               <button onClick={() => { setDataset("cross"); stop() }} className={`px-2 py-1 border-l border-outline-variant/30 transition-all ${dataset === "cross" ? "bg-primary/20 text-primary" : "hover:text-primary hover:bg-surface-container"}`}>CROSS</button>
            </div>
          </div>

          <div className="md:hidden w-full h-[1px] bg-outline-variant/20" />
          
        </div>

        {/* Primary Action Button */}
        <button
          onClick={running ? stop : start}
          className={`shrink-0 font-headline uppercase font-bold text-sm px-8 py-2 transition-all ${
            running 
              ? "bg-error hover:bg-error/80 text-white game-corner-br" 
              : "bg-primary hover:bg-primary-dim text-on-primary game-corner-br"
          }`}
        >
          {running ? "Halt Training" : "Initiate Run"}
        </button>

      </div>

    </div>
  )
}
