"""Astronomy API routes for astronomical events."""

from typing import Annotated, Any

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.services.astro_service import AstroService

router = APIRouter(prefix="/astro", tags=["Astronomy"])


@router.get("/events")
async def astro_events(
    lat: Annotated[float, Query(ge=-90, le=90, description="Observer latitude")] = 55.7558,
    lon: Annotated[float, Query(ge=-180, le=180, description="Observer longitude")] = 37.6176,
    days: Annotated[int, Query(ge=1, le=30, description="Number of days to query")] = 7,
) -> Any:
    """
    Get astronomical events for a location and time range.

    Returns raw JSON response from Astronomy API (passthrough).

    - **lat**: Observer latitude (-90 to 90, default: Moscow 55.7558)
    - **lon**: Observer longitude (-180 to 180, default: Moscow 37.6176)
    - **days**: Number of days to query (1-30, default 7)
    """
    service = AstroService()

    try:
        result = await service.get_events(
            latitude=lat,
            longitude=lon,
            days=days,
        )
        # Return raw response as passthrough
        return JSONResponse(content=result)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Astronomy API error: {e}") from e
