from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.osdr import OSDRListResponse, OSDRSyncResponse
from app.services.osdr_service import OSDRService

router = APIRouter(prefix="/osdr", tags=["OSDR"])


@router.get("/sync", response_model=OSDRSyncResponse)
async def osdr_sync(db: AsyncSession = Depends(get_db)) -> OSDRSyncResponse:
    """Trigger OSDR data sync and return count of written items."""
    service = OSDRService(db)
    return await service.sync()


@router.get("/list", response_model=OSDRListResponse)
async def osdr_list(db: AsyncSession = Depends(get_db)) -> OSDRListResponse:
    """Get list of OSDR items."""
    service = OSDRService(db)
    return await service.get_list(limit=settings.osdr_list_limit)
