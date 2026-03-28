import os
import asyncio
from core.agent_manager import AgentManager

async def main():
    print("Initializing Builder Base AI Agent Framework...")
    # This expects MONAD_RPC_URL and AI API keys in standard env vars later
    
    agent = AgentManager()
    
    # Example intent: user uploads a PDF from a medical device without internet, 
    # SMS relay turns it into binary, API extracts small JSON, Agent processes it and commits receipt to Monad.
    
    mock_payload = {
        "event_type": "OFFLINE_MEDICAL_EXTRACTION",
        "description": "Blood test params OCR extracted from low-res image via Bluetooth.",
        "language": "es" # Spanish, needs translation to EN by agent
    }
    
    print("\n--- Processing Intent ---")
    receipt = await agent.process_intent(mock_payload)
    
    print("\n--- Agent Execution Complete ---")
    print(f"Receipt Proof Hash: {receipt['proof_hash']}")
    print(f"Billed Engine Amount: {receipt['billing']}")

if __name__ == "__main__":
    asyncio.run(main())
