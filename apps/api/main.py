from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    HAS_OTEL = True
except ImportError:
    HAS_OTEL = False
from routers import upload, sync, ai_agents, oracles
import database

app = FastAPI(
    title="Builder Base / Monad AI Off-Chain Extractor",
    description="Backend API for heavy data extraction, offline P2P sync simulation, and AI transformation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1/upload", tags=["Upload"])
app.include_router(sync.router, prefix="/api/v1/sync", tags=["Sync"])
app.include_router(ai_agents.router, prefix="/api/v1/ai", tags=["AI inference"])
app.include_router(oracles.router, prefix="/api/v1/oracles", tags=["Cross-Chain Oracles"])

# Instrument FastAPI with OpenTelemetry (if available)
if HAS_OTEL:
    FastAPIInstrumentor.instrument_app(app)

@app.on_event("startup")
async def startup_event():
    await database.init_db()


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Builder Base Extraction Engine MVP"}
