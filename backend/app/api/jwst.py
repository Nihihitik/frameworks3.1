"""JWST API routes for James Webb Space Telescope images."""

from enum import Enum
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from app.schemas.jwst import JWSTFeedResponse
from app.services.jwst_service import JWSTService

router = APIRouter(prefix="/jwst", tags=["JWST"])


class JWSTSource(str, Enum):
    """Valid JWST feed source types."""

    JPG = "jpg"
    SUFFIX = "suffix"
    PROGRAM = "program"


class JWSTInstrument(str, Enum):
    """Valid JWST instrument filters."""

    NIRCAM = "NIRCam"
    MIRI = "MIRI"
    NIRISS = "NIRISS"
    NIRSPEC = "NIRSpec"
    FGS = "FGS"


@router.get("/feed", response_model=JWSTFeedResponse)
async def jwst_feed(
    source: Annotated[JWSTSource, Query(description="Query source type")] = JWSTSource.JPG,
    suffix: Annotated[str | None, Query(description="Suffix filter (for source=suffix)")] = None,
    program: Annotated[str | None, Query(description="Program ID (for source=program)")] = None,
    instrument: Annotated[
        JWSTInstrument | None, Query(description="Instrument filter")
    ] = None,
    perPage: Annotated[int, Query(ge=1, le=100, description="Items per page")] = 24,
) -> JWSTFeedResponse:
    """
    Get JWST image feed.

    - **source**: Query type - 'jpg' (all JPG images), 'suffix', or 'program'
    - **suffix**: Required when source='suffix', specifies the suffix filter
    - **program**: Required when source='program', specifies the program ID
    - **instrument**: Optional filter by JWST instrument
    - **perPage**: Number of items to return (1-100, default 24)
    """
    # Validate suffix/program requirements
    if source == JWSTSource.SUFFIX and not suffix:
        raise HTTPException(
            status_code=400,
            detail="Parameter 'suffix' is required when source='suffix'",
        )
    if source == JWSTSource.PROGRAM and not program:
        raise HTTPException(
            status_code=400,
            detail="Parameter 'program' is required when source='program'",
        )

    service = JWSTService()

    try:
        result = await service.get_feed(
            source=source.value,
            suffix=suffix,
            program=program,
            instrument=instrument.value if instrument else None,
            per_page=perPage,
        )
        return JWSTFeedResponse(
            source=result["source"],
            count=result["count"],
            items=result["items"],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"JWST API error: {e}") from e
