from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()

class SyncStatus(BaseModel):
    device_id: str
    status: str
    last_ping: int

@router.get("/status", response_model=SyncStatus)
def get_sync_status():
    """
    Provides a mockup status of the offline P2P Sync (Radio/Bluetooth imitation).
    """
    return SyncStatus(
        device_id="BLB-SYNC-NODE-01",
        status="waiting_for_peer_connection",
        last_ping=int(time.time())
    )
