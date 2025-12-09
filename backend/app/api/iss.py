from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.iss import ISSResponse, TrendResponse
from app.services.iss_service import ISSService

router = APIRouter()


@router.get("/last", response_model=ISSResponse)
async def last_iss(db: AsyncSession = Depends(get_db)) -> ISSResponse:
    """Get the most recent ISS position data."""
    service = ISSService(db)
    return await service.get_latest()


@router.get("/fetch", response_model=ISSResponse)
async def fetch_iss(db: AsyncSession = Depends(get_db)) -> ISSResponse:
    """Trigger immediate ISS data fetch and return result."""
    service = ISSService(db)
    await service.fetch_and_store()
    return await service.get_latest()


@router.get("/iss/trend", response_model=TrendResponse)
async def iss_trend(db: AsyncSession = Depends(get_db)) -> TrendResponse:
    """Calculate ISS movement trend from last two records."""
    service = ISSService(db)
    return await service.get_trend()
