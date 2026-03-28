import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

# Start with SQLite for local development.
# To switch to Supabase later, supply DATABASE_URL="postgresql+asyncpg://postgres:pass@db.url..."
# Example: "sqlite+aiosqlite:///./test.db"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ai_agents_test.db")

engine = create_async_engine(DATABASE_URL, echo=False)

# Session local
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Example Model abstraction (Agents interactions)
from sqlalchemy import Column, Integer, String, Text

class AIInteractionLog(Base):
    __tablename__ = "ai_interactions"
    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(50), index=True)  # 'gemini' or 'groq'
    prompt = Column(Text)
    response = Column(Text)

# Initialize DB (Run on startup)
async def init_db():
    async with engine.begin() as conn:
        # Create tables mapped to Base above
        await conn.run_sync(Base.metadata.create_all)
