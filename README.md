# Evolet Node

### Intent-Centric, Agent-Executed, Payment-Gated, Privacy-Preserving Web3 Infrastructure — Secured via Restaking and Executed on Monad Testnet.

---

## 📖 Table of Contents

- [What is Evolet Node?](#-what-is-evolet-node)
- [Why We Built This](#-why-we-built-this)
- [The 9-Layer Omni-Architecture](#-the-9-layer-omni-architecture)
- [Core Tech Stack](#-core-tech-stack)
- [Repository Structure](#-repository-structure)
- [Smart Contracts](#-smart-contracts)
- [Agent Architecture](#-agent-architecture)
- [Frontend Deep Dive](#-frontend-deep-dive)
- [Backend Deep Dive](#-backend-deep-dive)
- [Local Development](#-local-development)
- [Production Deployment](#-production-deployment)
- [Environment Variables](#-environment-variables)
- [MetaMask Demo Flow](#-metamask-demo-flow)

---

## 🧬 What is Evolet Node?

Evolet Node is a **full-stack, production-grade Web3 infrastructure platform** that unifies nine distinct protocol layers into a single, coherent execution pipeline. It transforms raw natural-language user intents into verifiable, privacy-preserving, cross-chain blockchain transactions — all orchestrated by autonomous AI agents.

At its core, the system accepts a human sentence like *"Deploy a private health-record proof to Monad Testnet anonymously"* and decomposes it through a structured pipeline:

1. **Parse** the intent using LLM-powered agents (LangChain / AutoGen)
2. **Verify** the user's identity through zero-knowledge ring signatures (Semaphore / DIDKit)
3. **Synchronize** state across offline mesh nodes (libp2p / Waku / PGLite)
4. **Gate** execution behind real-time micropayments (Superfluid / ERC-4337)
5. **Validate** operator security via restaking economics (EigenLayer AVS)
6. **Execute** privately using ZK-SNARK proofs (Circom / snarkjs / Gelato)
7. **Bridge** finality cross-chain to the target network (LayerZero)

The result is a platform where **AI agents act as autonomous middleware**, bridging the gap between human intent and on-chain execution — with cryptographic guarantees at every layer.

---

## 💡 Why We Built This

### The Problem

Modern Web3 infrastructure is **fragmented**. To build a production dApp today, teams must manually integrate identity providers, payment rails, privacy layers, cross-chain bridges, and automation services — each with its own SDK, auth flow, and failure modes. There is no unified pipeline that connects *"what the user wants"* to *"what the blockchain executes"* with privacy, security, and economic alignment baked in.

### Our Approach

We designed Evolet Node around three principles:

| Principle | Implementation |
|-----------|---------------|
| **Intent-Centric** | Users express goals in natural language. AI agents handle the decomposition, routing, and execution. No manual contract interaction required. |
| **Offline-First** | Critical state is cached locally via PGLite (Postgres-in-browser) and synchronized over libp2p mesh networks. The platform remains functional even without persistent internet — critical for edge computing, field medical devices, and IoT deployments. |
| **Economically Secured** | Every agent must pass EigenLayer restaking validation before executing. Operators risk slashing if they produce invalid results. Payment streams are gated via the x402 protocol (Superfluid + ERC-4337), ensuring agents are compensated in real-time. |

### Why Monad?

Monad provides the high-throughput, EVM-compatible L1 that this architecture demands. With 10,000+ TPS and sub-second finality, Monad enables:
- Real-time Superfluid payment streams without gas bottlenecks
- High-frequency ZK proof verification on-chain
- Fast cross-chain settlement via LayerZero endpoints

---

## 🏛️ The 9-Layer Omni-Architecture

Each layer represents a distinct protocol concern. The pipeline executes **sequentially** — each layer must validate before the next unlocks.

```
┌─────────────────────────────────────────────────────┐
│  LAYER 1: INTENT PARSING                            │
│  LangChain → AutoGen/CrewAI multi-agent delegation  │
├─────────────────────────────────────────────────────┤
│  LAYER 2: IDENTITY & TRUST                          │
│  DIDKit (W3C DID) → Semaphore ZK ring signatures    │
├─────────────────────────────────────────────────────┤
│  LAYER 3: MESH COMMUNICATION                        │
│  libp2p gossipsub → Waku v2 → PGLite offline queue  │
├─────────────────────────────────────────────────────┤
│  LAYER 4: PAYMENT GATE (x402 Protocol)              │
│  Superfluid real-time streams → ERC-4337 Paymaster  │
├─────────────────────────────────────────────────────┤
│  LAYER 5: SECURITY & RESTAKING                      │
│  EigenLayer AVS → Operator stake verification       │
├─────────────────────────────────────────────────────┤
│  LAYER 6: PRIVACY & AUTOMATION                      │
│  Circom circuits → snarkjs prover → Gelato tasks    │
├─────────────────────────────────────────────────────┤
│  LAYER 7: CROSS-CHAIN INTEROPERABILITY              │
│  LayerZero OFT → Axelar GMP → Monad finality       │
├─────────────────────────────────────────────────────┤
│  LAYER 8: OBSERVABILITY                             │
│  OpenTelemetry → FastAPI instrumentation → traces   │
├─────────────────────────────────────────────────────┤
│  LAYER 9: DATA PERSISTENCE                          │
│  PGLite (browser) → SQLite → Supabase (production)  │
└─────────────────────────────────────────────────────┘
```

### Layer-by-Layer Breakdown

#### Layer 1 — Intent Parsing (LangChain + AutoGen)
**Why:** Users shouldn't need to write Solidity calldata. Natural language is the interface.  
**How:** LangChain parses the raw intent into a structured execution graph. AutoGen/CrewAI distributes sub-tasks across specialized agents (DID verification, DeFi swapping, proof generation).  
**Benefit:** Converts `"swap 10 USDC privately on Monad"` into discrete, executable machine instructions.

#### Layer 2 — Identity & Trust (DIDKit + Semaphore)
**Why:** Agents must verify *who* is making a request without exposing personal data.  
**How:** W3C Decentralized Identifiers (DIDs) provide portable identity. Semaphore generates zero-knowledge group membership proofs — proving you belong without revealing which member you are.  
**Benefit:** Privacy-preserving authentication. No centralized identity provider. No data leakage.

#### Layer 3 — Mesh Communication (libp2p + Waku)
**Why:** Not every environment has reliable internet. Field devices, IoT sensors, and edge nodes need offline-capable communication.  
**How:** libp2p provides peer-to-peer transport. Waku v2 enables lightweight, censorship-resistant messaging. PGLite (Postgres compiled to WebAssembly) queues intents locally until connectivity is restored.  
**Benefit:** The platform stays operational in offline scenarios — medical dead-zones, disaster relief, rural connectivity.

#### Layer 4 — Payment Gate (Superfluid + ERC-4337)
**Why:** Agent execution costs resources. Without economic gating, the system is vulnerable to spam and resource exhaustion.  
**How:** The x402 protocol pattern locks the pipeline until a real-time payment stream (Superfluid) is authorized. ERC-4337 Account Abstraction enables gasless transactions via a Paymaster contract. MetaMask prompts the user to sign a transaction to unlock execution.  
**Benefit:** Machine-to-machine micropayments. Agents are compensated per-task in real-time. No invoicing, no settlement delays.

#### Layer 5 — Security & Restaking (EigenLayer AVS)
**Why:** Agent operators must have economic skin-in-the-game. Without slashing risk, there's no accountability for bad outputs.  
**How:** EigenLayer's Actively Validated Services (AVS) framework requires operators to restake ETH. If an agent produces an invalid proof or a manipulated result, their stake is slashed.  
**Benefit:** Cryptoeconomic security. The cost of attacking the system exceeds the reward.

#### Layer 6 — Privacy & Automation (Circom + Gelato)
**Why:** Sensitive data (medical records, financial transactions) must be provably correct without revealing the underlying information.  
**How:** Circom circuits compile to WebAssembly. snarkjs generates zero-knowledge proofs client-side. Gelato automates recurring tasks (cron-style on-chain execution) without manual intervention.  
**Benefit:** Verifiable computation. Anyone can check the proof's validity without seeing the private inputs.

#### Layer 7 — Cross-Chain Interoperability (LayerZero)
**Why:** Not all value lives on one chain. Intents may originate on Ethereum but settle on Monad.  
**How:** LayerZero's omnichain messaging protocol bridges intent outcomes across networks. The `OmniOrchestrator` contract dispatches cross-chain payloads via LayerZero endpoints.  
**Benefit:** Chain-agnostic execution. Users don't need to know which chain their intent settles on.

#### Layer 8 — Observability (OpenTelemetry)
**Why:** Production systems need tracing, latency measurement, and error attribution.  
**How:** OpenTelemetry auto-instruments the FastAPI backend. Every request, model call, and database query is traced end-to-end.  
**Benefit:** Full visibility into the pipeline. Debug failures across 9 layers without guesswork.

#### Layer 9 — Data Persistence (PGLite + SQLite + Supabase)
**Why:** Intent history, agent logs, and proof records must persist across sessions.  
**How:** PGLite runs Postgres entirely in the browser (WebAssembly). SQLite handles local API storage. Supabase provides production-grade PostgreSQL with real-time subscriptions.  
**Benefit:** Offline-first by default. Data syncs to cloud when connectivity is available.

---

## ⚙️ Core Tech Stack

### Frontend

| Technology | Version | Why We Chose It |
|-----------|---------|-----------------|
| **Next.js** | 16.2 | App Router with RSC, streaming, and edge runtime support. The industry standard for production React. |
| **React** | 19.2 | Concurrent features, Suspense boundaries, and the new `use()` hook for cleaner async patterns. |
| **TypeScript** | 5.x | Type safety across the entire frontend. Catches integration errors at compile time, not runtime. |
| **Tailwind CSS** | 4.x | Utility-first CSS with JIT compilation. Eliminates dead CSS in production bundles. |
| **Framer Motion** | 12.x | Declarative animations with layout animations, exit animations, and gesture support. Powers the pipeline step transitions. |
| **React Three Fiber** | 9.x | Declarative Three.js in React. Renders the 3D hexagonal wireframe scene on the landing page with bloom post-processing. |
| **Drei** | 10.x | Pre-built R3F helpers — OrbitControls, Float, and Text3D for the orbiting typography. |
| **Recharts** | 3.x | Composable charting library built on D3. Renders the Monad gas analytics and intent success/failure visualizations. |
| **Wagmi** | 3.x | React hooks for Ethereum. Manages wallet connection, transaction sending, and receipt waiting. Configured exclusively for MetaMask on Monad Testnet. |
| **Viem** | 2.x | Low-level TypeScript Ethereum interface. Wagmi's transport layer — handles ABI encoding, RPC calls, and chain definitions. |
| **Vercel AI SDK** | 6.x | Streaming AI responses to the frontend via `useCompletion`. Handles SSE parsing, loading states, and error boundaries. |
| **TanStack Query** | 5.x | Server-state management for React. Caches API responses, handles mutations with optimistic updates, and provides automatic retry logic. |
| **Lenis** | 1.x | Smooth scrolling library. Provides buttery 60fps scroll interpolation across the landing page. |
| **PGLite** | 0.4 | Postgres compiled to WebAssembly. Runs entirely in the browser. Queues intents locally when the network is unavailable. |
| **SimpleWebAuthn** | 13.x | WebAuthn/FIDO2 authentication. Enables biometric passkey login as an alternative to seed phrases. |

### Backend

| Technology | Version | Why We Chose It |
|-----------|---------|-----------------|
| **FastAPI** | 0.115+ | Async Python framework with automatic OpenAPI docs. Native support for streaming responses and dependency injection. |
| **Uvicorn** | 0.30+ | ASGI server. Runs FastAPI with `--reload` for development and `--workers` for production. |
| **SQLAlchemy** | 2.x | Async ORM. Manages the `AIInteractionLog` model with support for SQLite (dev) and PostgreSQL (prod). |
| **aiosqlite** | 0.20+ | Async SQLite driver. Enables non-blocking database operations in the FastAPI event loop. |
| **Pydantic** | 2.10+ | Data validation using Python type hints. Powers request/response schemas across all API endpoints. |
| **PydanticAI** | 1.x | (Optional) Structured AI agent routing. Connects to Groq and Gemini with typed tool calls. Falls back to mock responses if unavailable. |
| **OpenTelemetry** | 1.x | (Optional) Distributed tracing. Auto-instruments every FastAPI route with span creation and latency recording. |

### Smart Contracts

| Technology | Version | Why We Chose It |
|-----------|---------|-----------------|
| **Solidity** | 0.8.24 | The EVM smart contract language. Targets Monad's fully EVM-compatible runtime. |
| **Hardhat** | 2.x | Development environment for compiling, testing, and deploying contracts. |
| **OpenZeppelin** | 5.x | Audited contract libraries. `Ownable`, `ReentrancyGuard`, and access control patterns. |

### Deployment

| Platform | Role | Why We Chose It |
|----------|------|-----------------|
| **Netlify** | Frontend hosting | Edge CDN, automatic HTTPS, built-in Next.js plugin, instant rollbacks. |
| **Render** | Backend hosting | Free tier Python hosting, auto-deploy from Git, native `render.yaml` blueprints. |

---

## 📁 Repository Structure

```
t:\defi\
│
├── apps/
│   ├── web/                          # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx        # Root layout: Web3Provider, ConnectWallet, Lenis
│   │   │   │   ├── page.tsx          # Landing page with 3D R3F scene
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx      # Omni-Architecture Pipeline UI
│   │   │   ├── components/
│   │   │   │   ├── Scene.tsx         # React Three Fiber 3D hexagon + bloom
│   │   │   │   ├── Hero.tsx          # Landing hero section
│   │   │   │   ├── Features.tsx      # Feature cards grid
│   │   │   │   ├── ConnectWallet.tsx  # MetaMask + SimpleWebAuthn passkeys
│   │   │   │   ├── Web3Provider.tsx   # Wagmi + TanStack Query providers
│   │   │   │   ├── OfflineSyncManager.tsx  # Waku/libp2p mesh simulation
│   │   │   │   └── LenisProvider.tsx  # Smooth scrolling wrapper
│   │   │   └── lib/
│   │   │       └── offline-db.ts     # PGLite intent queue
│   │   ├── next.config.ts            # API proxy rewrites + standalone build
│   │   ├── .env.local                # Frontend environment variables
│   │   └── package.json              # Dependencies + 0.0.0.0 binding
│   │
│   ├── api/                          # FastAPI Backend
│   │   ├── main.py                   # App entry: CORS, routers, OpenTelemetry
│   │   ├── database.py               # SQLAlchemy async engine + models
│   │   ├── routers/
│   │   │   ├── ai_agents.py          # /ai/query — PydanticAI streaming endpoint
│   │   │   ├── upload.py             # /upload — File processing
│   │   │   ├── sync.py               # /sync — P2P sync simulation
│   │   │   └── oracles.py            # /oracles — Cross-chain oracle mocks
│   │   ├── requirements.txt          # Python dependencies
│   │   ├── runtime.txt               # Python 3.12 pin for Render
│   │   └── .env                      # Backend environment variables
│   │
│   ├── contracts/                    # Solidity Smart Contracts
│   │   ├── contracts/
│   │   │   ├── OmniProtocolStack.sol # Master: EigenLayer + ZK + LayerZero + Superfluid
│   │   │   ├── AgentBilling.sol      # M2M agent payment tracking
│   │   │   ├── Attestation.sol       # On-chain attestation registry
│   │   │   ├── Escrow.sol            # Intent escrow with dispute resolution
│   │   │   ├── ProofRegistry.sol     # ZK proof storage
│   │   │   ├── Verifier.sol          # Groth16 verifier stub
│   │   │   └── ERC7231.sol           # Identity-bound token standard
│   │   ├── hardhat.config.ts         # Monad Testnet network config
│   │   └── package.json
│   │
│   └── agents/                       # Python Agent Topologies
│       ├── main.py                   # Agent entry point
│       └── core/
│           └── orchestrator.py       # CrewAI/LangChain execution graph
│
├── packages/
│   └── shared/                       # Shared TypeScript/Python schemas
│
├── netlify.toml                      # Netlify deployment config
├── render.yaml                       # Render deployment blueprint
├── Procfile                          # Render fallback start command
├── docker-compose.yml                # Docker orchestration
└── README.md                         # You are here
```

---

## 📜 Smart Contracts

The `OmniProtocolStack.sol` contract is the on-chain anchor for the entire 9-layer pipeline. It defines Solidity interfaces for every external protocol the system touches:

| Interface | Protocol | Function |
|-----------|----------|----------|
| `IEigenLayerAVS` | EigenLayer | `getDelegatedStake()`, `slashOperator()` |
| `ISuperfluidStream` | Superfluid | `startM2MPaymentStream()` |
| `IPaymaster` | ERC-4337 | `validatePaymasterUserOp()` |
| `ICircomVerifier` | Circom/snarkjs | `verifyProof(a, b, c, input)` |
| `IGelatoTask` | Gelato Network | `createTask()` |
| `ILayerZeroEndpoint` | LayerZero | `send()` cross-chain messaging |

The `OmniOrchestrator` contract wires these together into a single `finalizeIntent()` function that:
1. Checks EigenLayer stake ≥ 10 ETH
2. Verifies ZK-SNARK proof validity
3. Opens Superfluid payment stream to the agent
4. Bridges results cross-chain via LayerZero
5. Emits `IntentExecuted` event on Monad Testnet

---

## 🤖 Agent Architecture

The Python agent layer in `apps/agents/core/orchestrator.py` implements the off-chain computation model:

```
User Intent (natural language)
        │
        ▼
┌──────────────────┐
│  LangChain Parser │ ← Decomposes intent into ExecutionNode[] graph
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  Waku Telemetry  │ ← Broadcasts intent metadata over libp2p gossipsub
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  EigenLayer AVS  │ ← Validates operator has sufficient restaked collateral
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  CrewAI Dispatch │ ← Each agent executes its sub-task on target chain
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  Monad Settlement│ ← OmniOrchestrator.finalizeIntent() on-chain
└──────────────────┘
```

---

## 🎨 Frontend Deep Dive

### Landing Page (`/`)
- **3D Scene**: React Three Fiber renders an animated hexagonal wireframe with orbiting "EVOLET" typography. Bloom post-processing creates the signature purple glow aesthetic.
- **Smooth Scrolling**: Lenis provides 60fps scroll interpolation with lerp-based easing.
- **Feature Cards**: Animated with Framer Motion staggered reveals.

### Dashboard (`/dashboard`)
- **Intent Input**: Accepts natural language, dispatches to the AI agent backend.
- **Omni-Pipeline Tracker**: A 7-step visual timeline that animates through each protocol layer. Steps physically halt at the x402 gate until MetaMask signs a transaction.
- **Recharts Analytics**: Live area charts showing Monad gas usage, intent volume, and agent success rates.
- **Waku Telemetry Panel**: Simulates libp2p node discovery, TLS handshake, and PGLite queue synchronization.
- **Wagmi Integration**: `useSendTransaction` prompts MetaMask for a 0 MON transaction to unlock the pipeline. `useWaitForTransactionReceipt` halts execution until block confirmation.

### ConnectWallet
- Primary: MetaMask via Wagmi's injected connector
- Secondary: SimpleWebAuthn passkey registration for biometric authentication

---

## 🔧 Backend Deep Dive

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/ai/query` | POST | Streams AI response via PydanticAI (Groq/Gemini) or mock fallback |
| `/api/v1/upload/process` | POST | Processes uploaded files (PDF, JSON, text extraction) |
| `/api/v1/sync/offline` | POST | Simulates P2P mesh sync state transfer |
| `/api/v1/oracles/monad-status` | GET | Returns Monad Testnet health and gas metrics |
| `/` | GET | Health check |

### Graceful Degradation
The backend is designed to **always boot**, even with missing optional dependencies:
- **PydanticAI not installed?** → Falls back to a mock streaming response that simulates agent execution
- **OpenTelemetry not installed?** → Skips instrumentation, server runs normally
- **No API keys?** → Returns mock responses with clear `[MOCK]` prefixes

---

## 🚀 Local Development

### Prerequisites
- **Node.js** v18+ and **pnpm**
- **Python** 3.12+ (3.14 works with unpinned pydantic)
- **MetaMask** browser extension configured for Monad Testnet (Chain ID: `10143`)

### Terminal 1 — Backend

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd t:\defi\apps\api
python -m venv .venv
.venv\Scripts\Activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 — Frontend

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd t:\defi\apps\web
pnpm install
pnpm run dev
```

### 📱 Wi-Fi / Cross-Device Testing

The dev server binds to `0.0.0.0`, exposing it to your local network:

1. Run `ipconfig` → find your **IPv4 Address** (e.g., `192.168.1.55`)
2. On any device (same Wi-Fi): `http://192.168.1.55:3000/dashboard`

Next.js automatically proxies `/api/proxy/*` to the Python backend — no CORS issues on any device.

---

## ☁️ Production Deployment

### Frontend → Netlify

1. Push repo to GitHub
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Netlify auto-detects `netlify.toml` — no manual config needed
4. Set environment variables in Netlify dashboard:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://evolet-api.onrender.com` |
| `NEXT_PUBLIC_GETBLOCK_RPC_URL` | Your GetBlock RPC URL |

5. Deploy ✅

### Backend → Render

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect GitHub repo — Render auto-reads `render.yaml`
3. Set environment variables:

| Variable | Value |
|----------|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `GROQ_API_KEY` | Your Groq API key |
| `DATABASE_URL` | `sqlite+aiosqlite:///./ai_agents_test.db` |

4. Deploy ✅ (Python 3.12 pinned via `runtime.txt`)

> After Render deploys, copy your Render URL and set it as `NEXT_PUBLIC_API_URL` in Netlify, then redeploy.

---

## 🔑 Environment Variables

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_GETBLOCK_RPC_URL=https://go.getblock.io/YOUR_TOKEN
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Backend (`apps/api/.env`)
```env
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
DATABASE_URL=sqlite+aiosqlite:///./ai_agents_test.db
```

---

## 🦊 MetaMask Demo Flow

1. Open `/dashboard` in your browser
2. Ensure MetaMask is connected to **Monad Testnet** (Chain ID: `10143`)
3. Type an intent → click **"Dispatch Agent"**
4. Watch layers 1-3 (Intent, Identity, Mesh) animate to completion
5. Pipeline **halts** at Layer 4 — **x402 Payment Gate**
6. MetaMask pops up → **Approve the 0 MON transaction**
7. Once the block confirms, layers 5-7 (EigenLayer → Circom → LayerZero) unlock sequentially
8. AI agent streams its response via the Vercel AI SDK
9. Pipeline reaches **"Completed"** state ✅

---

## 📄 License

MIT

---

*Built for the Monad Hackathon. Powered by autonomous agents, restaking economics, and zero-knowledge cryptography.*
