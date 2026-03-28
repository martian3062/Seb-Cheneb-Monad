"use client";

import { motion } from "framer-motion";
import Scene from "./Scene";
import { Circle } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-3xl mt-4 border border-white/5">
      {/* 3D Scene Layer */}
      <Scene />
      
      {/* Interactive UI Overlays */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="z-10 relative flex flex-col items-center gap-6"
      >
        {/* Top Badge */}
        <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-black/40 backdrop-blur-xl">
          <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
          <span className="font-bold tracking-wide text-purple-200">OmniTrade AI Frame (anon)</span>
        </div>

        {/* Action Card */}
        <div className="glass-panel w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Execute Agent</h2>
          
          <p className="text-sm text-gray-400 font-medium leading-relaxed">
            Run local LLM strategy to swap Monad testnet tokens or execute Hyperliquid fallbacks.
          </p>
          
          <Link href="/dashboard" className="relative w-full py-4 mt-4 rounded-xl font-semibold overflow-hidden group text-center block">
            {/* Button Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#a855f7] transition-transform duration-300 group-hover:scale-105" />
            
            {/* Inner Glow/Shadow effect */}
            <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] rounded-xl" />
            
            <span className="relative text-white tracking-wide z-10">Formulate Intent</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
