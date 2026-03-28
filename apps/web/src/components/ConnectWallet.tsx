"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatEther } from "viem";
import { monadTestnet } from "@/lib/config";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { startRegistration } from "@simplewebauthn/browser";

function trimAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyAuthed, setPasskeyAuthed] = useState(false);

  useEffect(() => setMounted(true), []);
  
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== monadTestnet.id;

  const { data: balance } = useBalance({
    address,
    chainId: monadTestnet.id,
  });

  const handlePasskey = async () => {
    setPasskeyLoading(true);
    try {
      const resp = await fetch('/api/webauthn/generate-options');
      const options = await resp.json();
      const attResp = await startRegistration({ optionsJSON: options });
      
      const verifyResp = await fetch('/api/webauthn/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attResp),
      });
      const verifyJSON = await verifyResp.json();
      if (verifyJSON.verified) {
        setPasskeyAuthed(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPasskeyLoading(false);
    }
  };

  if (!mounted) return <div className="px-5 py-2 w-[140px] h-[36px]"></div>;

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        {passkeyAuthed && (
           <span className="text-xs text-green-400 font-semibold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg whitespace-nowrap">
             Passkey Secured
           </span>
        )}
        {isWrongNetwork && (
          <span className="text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg whitespace-nowrap">
            Wrong Network
          </span>
        )}
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            {trimAddress(address)}
          </span>
          {balance && (
            <span className="text-[10px] text-purple-400 mt-0.5">
              {parseFloat(formatEther(balance.value)).toFixed(4)} MON
            </span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="text-xs text-white/40 hover:text-red-400 transition-colors border border-white/5 px-3 py-1.5 rounded-lg"
        >
          Disconnect
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex gap-2">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handlePasskey}
        disabled={passkeyLoading || passkeyAuthed}
        className="relative px-5 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group disabled:opacity-60 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 transition-colors whitespace-nowrap"
      >
        <span className="relative z-10">
          {passkeyLoading ? "..." : passkeyAuthed ? "Secured" : "Add Passkey"}
        </span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => connect({ connector: injected(), chainId: monadTestnet.id })}
        disabled={isPending}
        className="relative px-5 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group disabled:opacity-60 whitespace-nowrap"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 transition-opacity group-hover:opacity-80" />
        <span className="relative z-10">
          {isPending ? "Connecting…" : "Connect MetaMask"}
        </span>
      </motion.button>
    </div>
  );
}
