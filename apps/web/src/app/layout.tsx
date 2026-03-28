import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/LenisProvider";
import Web3Provider from "@/components/Web3Provider";
import ConnectWallet from "@/components/ConnectWallet";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evolet Node — Monad Testnet",
  description: "Cross-chain autonomous agent platform on Monad Testnet",
  openGraph: {
    title: "Evolet Node — Monad Testnet",
    description: "Cross-chain autonomous agent platform on Monad Testnet",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://builderbase.com/frame-image.png",
    "fc:frame:button:1": "Connect & Execute",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <Web3Provider>
          <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 py-3 px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-violet-400" />
              <span className="text-xl font-bold tracking-tight text-white">Evolet Node</span>
              {/* Monad Testnet badge */}
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                MONAD TESTNET
              </span>
            </div>
            <nav className="flex items-center gap-5">
              <a href="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Home</a>
              <a href="/dashboard" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Dashboard</a>
              <ConnectWallet />
            </nav>
          </header>
          <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
            <SmoothScroller>
              {children}
            </SmoothScroller>
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
