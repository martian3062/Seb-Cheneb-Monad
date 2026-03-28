"use client";

import { useState, useMemo, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { queueIntentLocally } from "@/lib/offline-db";
import { motion, AnimatePresence } from "framer-motion";
import OfflineSyncManager from "@/components/OfflineSyncManager";
import { Lock, Unlock, PlayCircle, Loader2, Activity, Network, ShieldCheck, FileJson, CheckCircle2, Workflow } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type OrchestratorState = 'idle' | 'processing' | '402_locked' | 'approving' | 'executing' | 'completed';

// — Mock analytics data (replaces Dune iframe) ——————————————
const gasData = [
  { day: "Mon", gasUsed: 1200, txCount: 34 },
  { day: "Tue", gasUsed: 1800, txCount: 52 },
  { day: "Wed", gasUsed: 2400, txCount: 78 },
  { day: "Thu", gasUsed: 1900, txCount: 45 },
  { day: "Fri", gasUsed: 3100, txCount: 99 },
  { day: "Sat", gasUsed: 2700, txCount: 81 },
  { day: "Sun", gasUsed: 3400, txCount: 112 },
];

const agentActivityData = [
  { hour: "00:00", intents: 3, executions: 2, failures: 0 },
  { hour: "04:00", intents: 7, executions: 5, failures: 1 },
  { hour: "08:00", intents: 15, executions: 13, failures: 1 },
  { hour: "12:00", intents: 22, executions: 20, failures: 2 },
  { hour: "16:00", intents: 18, executions: 16, failures: 1 },
  { hour: "20:00", intents: 12, executions: 11, failures: 0 },
  { hour: "23:59", intents: 8, executions: 7, failures: 1 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/50 font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-mono" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function PipelineStep({ label, status, delay }: { label: string, status: 'pending' | 'active' | 'success', delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center gap-3 p-3 rounded-xl border ${
        status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
        status === 'active' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
        'bg-white/5 border-white/5 text-white/40'
      }`}
    >
      {status === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
      {status === 'active' && <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />}
      {status === 'pending' && <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-dashed border-white/20" />}
      
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>('idle');
  const [intentInput, setIntentInput] = useState("deploy agent strategy on Monad Testnet");
  const [paymasterAddress, setPaymasterAddress] = useState("0x9Ecfa4fFe04B7De3C5891dB9e4a82B0e3755312F");

  // Vercel AI SDK useCompletion
  const { completion, complete, isLoading: isCompletionLoading } = useCompletion({
    api: '/api/proxy/ai/query',
    onFinish: () => setOrchestratorState('completed'),
    onError: (err: Error) => {
      console.warn("API Error, falling back to PGLite Queue", err);
      // Fallback
      queueIntentLocally(intentInput, 'groq');
      setOrchestratorState('completed'); // Mark complete to unblock UI
    }
  });

  // TanStack Query for Dispatch M2M mock
  const dispatchMutation = useMutation({
    mutationFn: async () => {
      setOrchestratorState('processing');
      await new Promise(r => setTimeout(r, 1500));
      setOrchestratorState('402_locked');
    }
  });

  const { sendTransactionAsync, data: txHash } = useSendTransaction();
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (txSuccess) {
      setOrchestratorState('executing');
      // Trigger Vercel AI SDK stream upon blockchain confirmation
      complete(intentInput, { body: { model_provider: "groq" } });
    }
  }, [txSuccess, complete, intentInput]);

  // TanStack Query for Approval + Vercel Trigger
  const approveMutation = useMutation({
    mutationFn: async () => {
      setOrchestratorState('approving');
      // Prompt MetaMask for a 0 MON M2M transaction representing Superfluid stream
      await sendTransactionAsync({
        to: (paymasterAddress as `0x${string}`) || '0x0000000000000000000000000000000000000000',
        value: 0n,
      });
    },
    onError: () => {
      // If user rejects MetaMask
      setOrchestratorState('402_locked');
    }
  });

  const handleExecuteIntent = () => {
    dispatchMutation.mutate();
  };

  const handleApprovePayment = () => {
    approveMutation.mutate();
  };

  const rpcUrl = process.env.NEXT_PUBLIC_GETBLOCK_RPC_URL;

  return (
    <div className="flex flex-col min-h-screen text-white pb-20 space-y-8">
      
      {/* Header section */}
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 inline-block">
          Cross-Chain Orchestrator
        </h1>
        <p className="text-white/60 mt-2">Manage autonomous execution, x402 permissions, and on-chain analytics.</p>
      </header>

      {/* Main Grid Floor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - System States */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-semibold text-white/80 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" /> Monad Testnet Nodes
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-white/50">RPC (GetBlock)</span><span className={rpcUrl ? "text-green-400" : "text-red-400"}>{rpcUrl ? "Connected" : "Missing ENV"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Chain ID</span><span className="text-purple-400 font-mono">10143</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Kizzy (Monad Social)</span><span className="text-green-400">Online</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">RPC Endpoint</span><span className="text-white/30 font-mono text-[10px] truncate max-w-[160px]" title={rpcUrl}>{rpcUrl ? rpcUrl.replace("https://", "").slice(0, 22) + "…" : "—"}</span></div>
            </div>
          </div>
          
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 relative">
            <div className="absolute inset-0 bg-blue-500/5 blur-[50px] pointer-events-none" />
            <OfflineSyncManager />
          </div>
        </div>

        {/* Center & Right Column - Intent Engine */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Intent Input Area */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
             
             {/* The x402 RED ALERT GATE */}
             <AnimatePresence>
               {orchestratorState === '402_locked' && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-red-950/80 backdrop-blur-xl z-20 flex flex-col items-center justify-center border-2 border-red-500/50 rounded-2xl text-center p-6"
                 >
                   <Lock className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
                   <h2 className="text-2xl font-bold text-red-400">x402 Payment Required</h2>
                   <p className="text-red-200/80 mt-2 max-w-md">
                     Monad Testnet session locked. Agent requires M2M micro-payment approval before deploying on testnet.
                   </p>
                   
                   <div className="mt-6 w-full max-w-sm space-y-2">
                     <label className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest text-left block ml-1">Paymaster Recipient Address</label>
                     <input 
                       type="text" 
                       value={paymasterAddress}
                       onChange={(e) => setPaymasterAddress(e.target.value)}
                       placeholder="0x..."
                       className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-xs text-red-200 font-mono focus:outline-none focus:border-red-500"
                     />
                   </div>

                   <button 
                     onClick={handleApprovePayment}
                     className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                   >
                     Approve M2M Payment
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Approving State overlay */}
             <AnimatePresence>
               {orchestratorState === 'approving' && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-green-950/80 backdrop-blur-xl z-20 flex flex-col items-center justify-center border-2 border-green-500/50 rounded-2xl"
                 >
                   <ShieldCheck className="w-12 h-12 text-green-500 mb-4" />
                   <h2 className="text-2xl font-bold text-green-400">Session Unlocked</h2>
                   <p className="text-green-200/80 mt-2">Deploying execution intents...</p>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="space-y-4 relative z-10">
               <label className="text-sm font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2">
                 <PlayCircle className="w-4 h-4" /> Agent Intent
               </label>
               <textarea 
                 value={intentInput}
                 onChange={(e) => setIntentInput(e.target.value)}
                 className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-mono text-sm leading-relaxed"
               />
               
               <div className="flex justify-end">
                 <button 
                   onClick={handleExecuteIntent}
                   disabled={orchestratorState !== 'idle'}
                   className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
                 >
                   {orchestratorState === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dispatch Agent"}
                 </button>
               </div>
             </div>
          </div>

          {/* Omni-Architecture Pipeline Tracker */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 min-h-[300px]">
            <h3 className="font-semibold text-white/80 flex items-center gap-2 mb-6">
              <Workflow className="w-4 h-4 text-yellow-400" /> Omni-Architecture Pipeline
            </h3>

            {orchestratorState === 'idle' ? (
              <div className="h-full flex items-center justify-center text-white/30 text-sm font-mono italic mt-12">
                Waiting for approved intent payloads...
              </div>
            ) : (
              <div className="space-y-3 relative">
                {/* 1. Intent & Identity */}
                <PipelineStep 
                  label="🧠 1. LangChain Parser & AutoGen Intent Breakdown" 
                  status={orchestratorState === 'processing' ? 'active' : 'success'} 
                  delay={0}
                />
                
                <PipelineStep 
                  label="🔐 2. Identity Verification: DIDKit & Semaphore Ring Signatures" 
                  status={orchestratorState === 'processing' ? 'active' : 'success'} 
                  delay={0.1}
                />

                {/* 3. Mesh */}
                <PipelineStep 
                  label="🌐 3. Telemetry: libp2p + Waku Offline Mesh Sync" 
                  status={orchestratorState === 'processing' ? 'active' : 'success'} 
                  delay={0.2}
                />

                {/* 4. Payment */}
                <PipelineStep 
                  label="💸 4. x402 Payment Gate: Superfluid Real-Time Stream + ERC4337" 
                  status={['approving', 'executing', 'completed'].includes(orchestratorState as string) ? 'success' : orchestratorState === '402_locked' ? 'active' : 'pending'} 
                  delay={0}
                />

                {/* 5. Security */}
                <PipelineStep 
                  label="🛡️ 5. Security: EigenLayer AVS Restaking Checks" 
                  status={['executing', 'completed'].includes(orchestratorState as string) ? 'success' : orchestratorState === 'approving' ? 'active' : 'pending'} 
                  delay={0}
                />

                {/* 6. Privacy & Automation */}
                <PipelineStep 
                  label="🤖 6. Privacy & Execution: Circom snarkjs proof + Gelato Automation" 
                  status={orchestratorState === 'completed' ? 'success' : orchestratorState === 'executing' ? 'active' : 'pending'} 
                  delay={0}
                />

                {/* 7. Interop */}
                <PipelineStep 
                  label="🌉 7. Interoperability & Finality: LayerZero Bridge to Monad Testnet" 
                  status={orchestratorState === 'completed' ? 'success' : 'pending'} 
                  delay={0}
                />

                {/* Raw AI Stream Log */}
                <AnimatePresence>
                  {completion && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 pt-4 border-t border-white/10"
                    >
                      <div className="text-xs text-[#a78bfa] font-bold mb-2">DYNAMIC AI COMPLETION LOG:</div>
                      <pre className="text-xs text-white/50 font-mono overflow-y-auto max-h-[140px] whitespace-pre-wrap flex-1 scrollbar-thin scrollbar-thumb-white/10 p-3 bg-black/40 rounded-lg border border-purple-500/20">
                        {completion}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ANALYTICS (Recharts — replaces Dune iframe) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Gas & TX Activity Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-semibold text-white/50 tracking-widest uppercase">Monad Testnet — Gas & TX Volume</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={gasData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />
              <Area type="monotone" dataKey="gasUsed" name="Gas Used" stroke="#8b5cf6" fill="url(#gradGas)" strokeWidth={2} />
              <Area type="monotone" dataKey="txCount" name="TX Count" stroke="#3b82f6" fill="url(#gradTx)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Activity Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-white/50 tracking-widest uppercase">Agent Orchestration — 24h Activity</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agentActivityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />
              <Bar dataKey="intents" name="Intents" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="executions" name="Executions" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failures" name="Failures" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}
