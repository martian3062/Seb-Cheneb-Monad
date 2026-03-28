import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from database import get_db, AIInteractionLog

try:
    from pydantic_ai import Agent
    HAS_PYDANTIC_AI = True
except ImportError:
    HAS_PYDANTIC_AI = False

router = APIRouter()

# Schema
class PromptRequest(BaseModel):
    prompt: str = "" # Default from Vercel AI SDK
    message: str = "" # Fallback
    model_provider: str = 'groq'

@router.post("/query")
async def process_ai_query(request: PromptRequest, db: AsyncSession = Depends(get_db)):
    """
    Routes queries to Google Gemini or Groq using PydanticAI.
    Streams output compatible with Vercel AI SDK `useCompletion`.
    Falls back to mock responses if PydanticAI is unavailable.
    """
    prompt = request.prompt or request.message
    provider = request.model_provider.lower()

    # If PydanticAI is not installed, return a mock streamed response
    if not HAS_PYDANTIC_AI:
        async def mock_stream():
            import asyncio
            mock_response = f"[Evolet Node] Intent received: '{prompt}'. Agent routing via {provider} engine. Executing on Monad Testnet (Chain 10143). Status: SUCCESS ✅"
            for word in mock_response.split(" "):
                yield word + " "
                await asyncio.sleep(0.05)
            # Log it
            log_entry = AIInteractionLog(provider=provider, prompt=prompt, response=mock_response)
            db.add(log_entry)
            await db.commit()
        return StreamingResponse(mock_stream(), media_type="text/plain")

    if provider == "groq":
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {"provider": provider, "result": "[MOCK] Groq API Key missing. Simulating ultra-fast response."}
        agent = Agent("groq:llama3-70b-8192")
    elif provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"provider": provider, "result": "[MOCK] Gemini API Key missing. Simulating fallback..."}
        agent = Agent("gemini-1.5-pro")
    else:
        raise HTTPException(status_code=400, detail="Invalid provider. Choose 'gemini' or 'groq'")

    async def generate():
        response_text = ""
        try:
            async with agent.run_stream(prompt) as result:
                async for chunk in result.stream(text_only=True):
                    response_text += chunk
                    yield chunk
            
            # Save to SQLite/Supabase dynamically after stream completes
            log_entry = AIInteractionLog(provider=provider, prompt=prompt, response=response_text)
            db.add(log_entry)
            await db.commit()
            
        except Exception as e:
            yield f"\n[PydanticAI Error]: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")
