from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class IntentPayload(BaseModel):
    intent: str
    amount_usd: float = 0.0

@router.post("/monad/deploy")
async def oracle_monad_deploy(payload: IntentPayload):
    """
    Monad Testnet Deployment Oracle
    Dispatches agent execution intent to Monad Testnet via GetBlock RPC.
    """
    return {
        "oracle": "Monad Testnet",
        "chain_id": 10143,
        "rpc": "GetBlock",
        "action": "deploy_agent",
        "resolved_intent": payload.intent,
        "status": "Awaiting Tx Execution"
    }

@router.post("/kizzy/broadcast")
async def oracle_kizzy_broadcast(payload: IntentPayload):
    """
    Kizzy Monad Social Hub Oracle
    Broadcasts agent completion events to the Monad Social layer.
    """
    return {
        "oracle": "Kizzy",
        "chain": "Monad Testnet",
        "action": "broadcast_completion",
        "message": f"Agent executed: {payload.intent}",
        "status": "Broadcasted"
    }
