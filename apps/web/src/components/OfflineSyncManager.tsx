"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WifiOff, Radio, RefreshCw, Send, Activity, ShieldCheck, Bluetooth } from "lucide-react";

type SyncState = "disconnected" | "scanning" | "syncing" | "synced";

export default function OfflineSyncManager() {
  const [syncState, setSyncState] = useState<SyncState>("disconnected");
  const [packets, setPackets] = useState<{ id: string; size: string; status: "queued" | "sent" }[]>([]);

  const initiateSync = () => {
    if (syncState !== "disconnected") return;
    setSyncState("scanning");
    setTimeout(() => {
      setSyncState("syncing");
      setPackets([
        { id: "tx_9X2qW", size: "4.2kb", status: "queued" },
        { id: "img_OCR_33X", size: "128kb", status: "queued" },
      ]);
      
      // Mock progress
      setTimeout(() => {
        setPackets(p => p.map(x => ({ ...x, status: "sent" })));
        setSyncState("synced");
      }, 2500);
      
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initiateSync();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card p-6 min-h-[400px] flex flex-col relative w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            Waku Telemetry Node
            <span className="ml-3 px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {syncState}
            </span>
          </h2>
          <p className="text-white/50 text-sm mt-1 flex gap-2">
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs">libp2p</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs">PGLite Queue</span>
          </p>
        </div>
        
        <button 
          onClick={initiateSync} 
          disabled={syncState === "scanning" || syncState === "syncing"}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
        >
          {syncState === "syncing" ? (
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          ) : (
            <Radio className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {syncState === "disconnected" && (
          <div className="flex flex-col items-center justify-center h-48 text-white/40 border border-dashed border-white/10 rounded-xl">
            <WifiOff className="w-8 h-8 mb-2" />
            <p>LayerZero Unreachable - Waku Node Isolated</p>
          </div>
        )}

        {syncState === "scanning" && (
          <div className="flex flex-col items-center justify-center h-48 text-primary border border-primary/20 rounded-xl glass-panel relative overflow-hidden">
            <motion.div 
              animate={{ scale: [1, 2, 3], opacity: [0.5, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-20 h-20 border-2 border-primary/50 rounded-full" 
            />
            <Activity className="w-8 h-8 mb-2" />
            <p>Scanning local nodes...</p>
          </div>
        )}

        {(syncState === "syncing" || syncState === "synced") && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-blue-400 mb-4 px-3 py-2 bg-blue-900/10 rounded-lg border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>libp2p gossip handshake successful, synchronizing PGLite queue</span>
            </div>
            
            {packets.map(p => (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                key={p.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${p.status === "sent" ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"}`}>
                    <Bluetooth className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-mono text-sm">{p.id}</h4>
                    <span className="text-xs text-white/40">{p.size}</span>
                  </div>
                </div>
                
                {p.status === "sent" ? (
                  <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                ) : (
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <Send className="w-3 h-3 animate-pulse" /> QUEUED
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
