from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.iss_repo import ISSRepository
from app.schemas.space import SpaceLatestResponse, SpaceRefreshResponse, SpaceSummaryResponse
from app.services.osdr_service import OSDRService
from app.services.space_service import SpaceService

router = APIRouter(prefix="/space", tags=["Space Cache"])


@router.get("/{src}/latest", response_model=SpaceLatestResponse)
async def space_latest(
    src: str, db: AsyncSession = Depends(get_db)
) -> SpaceLatestResponse:
    """Get latest cached data for a specific source (apod, neo, flr, cme, spacex)."""
    service = SpaceService(db)
    return await service.get_latest(src)


@router.get("/refresh", response_model=SpaceRefreshResponse)
async def space_refresh(
    src: str = Query(default="apod,neo,flr,cme,spacex"),
    db: AsyncSession = Depends(get_db),
) -> SpaceRefreshResponse:
    """Refresh specified data sources. Query param: src=apod,neo,flr,cme,spacex"""
    service = SpaceService(db)
    sources = [s.strip() for s in src.split(",") if s.strip()]
    return await service.refresh(sources)


@router.get("/summary", response_model=SpaceSummaryResponse)
async def space_summary(db: AsyncSession = Depends(get_db)) -> SpaceSummaryResponse:
    """Get summary of all cached data sources plus ISS and OSDR count."""
    space_service = SpaceService(db)
    osdr_service = OSDRService(db)
    iss_repo = ISSRepository(db)

    # Get ISS data
    iss_log = await iss_repo.get_latest()
    iss_data = {}
    if iss_log:
        iss_data = {"at": iss_log.fetched_at, "payload": iss_log.payload}

    # Get OSDR count
    osdr_count = await osdr_service.get_count()

    return await space_service.get_summary(iss_data, osdr_count)
