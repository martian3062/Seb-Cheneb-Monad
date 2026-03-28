from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import uuid
import asyncio

router = APIRouter()

class ExtractionResult(BaseModel):
    task_id: str
    status: str
    payload_size_kb: float
    minimal_binary_hash: str
    mock_data: dict

@router.post("/", response_model=ExtractionResult)
async def upload_file(file: UploadFile = File(...)):
    """
    Mock upload and extraction endpoint.
    Simulates extracting dense data (e.g., Medical PDF) into a minimized payload.
    """
    # Simulate processing delay
    await asyncio.sleep(1)
    
    # In a real scenario, this would apply OCR or LLM translation
    # to yield a minimal JSON ready to be hashed for on-chain storage.
    return ExtractionResult(
        task_id=str(uuid.uuid4()),
        status="processed",
        payload_size_kb=len(file.filename) * 0.1, # mock size
        minimal_binary_hash=f"0x{uuid.uuid4().hex}",
        mock_data={
            "description": "Minimal extracted metadata",
            "detected_language": "en",
            "privacy_mode": "active"
        }
    )
