import logging
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.iss import ISSFetchLog
from app.repositories.iss_repo import ISSRepository
from app.schemas.iss import ISSResponse, TrendResponse
from app.services.http_client import HttpClient
from app.utils.haversine import haversine_km
from app.utils.json_extract import extract_number

logger = logging.getLogger(__name__)


class ISSService:
    def __init__(self, session: AsyncSession):
        self.repo = ISSRepository(session)
        self.client = HttpClient(timeout=20.0)

    async def fetch_and_store(self) -> ISSFetchLog:
        """Fetch ISS data from API and store in database."""
        url = settings.iss_url
        payload = await self.client.get(url)
        return await self.repo.insert(source_url=url, payload=payload)

    async def get_latest(self) -> ISSResponse:
        """Get the most recent ISS data."""
        log = await self.repo.get_latest()
        if log:
            return ISSResponse(
                id=log.id,
                fetched_at=log.fetched_at,
                source_url=log.source_url,
                payload=log.payload,
            )
        return ISSResponse(message="no data")

    async def get_trend(self) -> TrendResponse:
        """Calculate ISS movement trend from last two records."""
        logs = await self.repo.get_last_two()

        if len(logs) < 2:
            return TrendResponse(
                movement=False,
                delta_km=0.0,
                dt_sec=0.0,
            )

        # logs[0] is newer, logs[1] is older
        newer, older = logs[0], logs[1]

        lat1 = extract_number(older.payload, "latitude")
        lon1 = extract_number(older.payload, "longitude")
        lat2 = extract_number(newer.payload, "latitude")
        lon2 = extract_number(newer.payload, "longitude")
        velocity = extract_number(newer.payload, "velocity")

        delta_km = 0.0
        movement = False

        if all(v is not None for v in [lat1, lon1, lat2, lon2]):
            delta_km = haversine_km(lat1, lon1, lat2, lon2)
            movement = delta_km > 0.1

        dt_sec = (newer.fetched_at - older.fetched_at).total_seconds()

        return TrendResponse(
            movement=movement,
            delta_km=delta_km,
            dt_sec=dt_sec,
            velocity_kmh=velocity,
            from_time=older.fetched_at,
            to_time=newer.fetched_at,
            from_lat=lat1,
            from_lon=lon1,
            to_lat=lat2,
            to_lon=lon2,
        )
