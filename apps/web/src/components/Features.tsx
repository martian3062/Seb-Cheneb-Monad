"use client";

import { motion } from "framer-motion";
import { Network, DatabaseZap, HardDriveUpload, Cpu } from "lucide-react";

const features = [
  {
    title: "Offline-First Network",
    description: "Mesh networking using BLE, Radio, or SMS ensuring data transmission even in medical dead-zones or remote locations.",
    icon: <Network className="w-8 h-8 text-blue-400" />
  },
  {
    title: "Agentic Verification",
    description: "Edge-computed LLM analysis with zero-knowledge attestations stored autonomously using Monad smart contracts.",
    icon: <Cpu className="w-8 h-8 text-purple-400" />
  },
  {
    title: "Instant Verification",
    description: "Rapid high-throughput execution leveraging Monad testnet sub-second confirmation times for agent transactions.",
    icon: <DatabaseZap className="w-8 h-8 text-yellow-400" />
  },
  {
    title: "Decentralized Escrow",
    description: "Built-in dynamic billing where providers and clinics trustlessly fund agent inferences for local data processing.",
    icon: <HardDriveUpload className="w-8 h-8 text-green-400" />
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative z-10 w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Core Infrastructure</h2>
        <p className="text-white/50 text-xl max-w-2xl mx-auto">Bridging the gap between isolated edge devices and highly scalable L1 blockchains.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full max-w-7xl mx-auto">
        {features.map((ft, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            key={idx}
            className="glass-card p-8 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              {ft.icon}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              {ft.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-3">{ft.title}</h3>
            <p className="text-white/60 leading-relaxed text-lg">{ft.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
