import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.repositories.space_cache_repo import SpaceCacheRepository
from app.schemas.space import SpaceLatestResponse, SpaceRefreshResponse, SpaceSummaryResponse
from app.services.http_client import HttpClient

logger = logging.getLogger(__name__)


class SpaceService:
    def __init__(self, session: AsyncSession):
        self.repo = SpaceCacheRepository(session)
        self.client = HttpClient(timeout=30.0)

    def _get_date_range(self, days: int = 2) -> tuple[str, str]:
        """Get date range for API queries."""
        today = datetime.now(timezone.utc).date()
        start = today - timedelta(days=days)
        return str(start), str(today)

    async def fetch_apod(self) -> None:
        """Fetch Astronomy Picture of the Day."""
        url = settings.apod_url
        params = {"thumbs": "true"}
        if settings.nasa_api_key:
            params["api_key"] = settings.nasa_api_key

        try:
            data = await self.client.get(url, params=params)
            await self.repo.insert(source="apod", payload=data)
        except Exception as e:
            logger.error(f"APOD fetch error: {e}")
            raise

    async def fetch_neo(self) -> None:
        """Fetch Near-Earth Objects data."""
        url = settings.neo_url
        start_date, end_date = self._get_date_range(2)
        params = {"start_date": start_date, "end_date": end_date}
        if settings.nasa_api_key:
            params["api_key"] = settings.nasa_api_key

        try:
            data = await self.client.get(url, params=params)
            await self.repo.insert(source="neo", payload=data)
        except Exception as e:
            logger.error(f"NEO fetch error: {e}")
            raise

    async def fetch_donki_flr(self) -> None:
        """Fetch Solar Flare data from DONKI."""
        url = settings.donki_flr_url
        start_date, end_date = self._get_date_range(5)
        params = {"startDate": start_date, "endDate": end_date}
        if settings.nasa_api_key:
            params["api_key"] = settings.nasa_api_key

        try:
            data = await self.client.get(url, params=params)
            await self.repo.insert(source="flr", payload=data)
        except Exception as e:
            logger.error(f"DONKI FLR fetch error: {e}")
            raise

    async def fetch_donki_cme(self) -> None:
        """Fetch Coronal Mass Ejection data from DONKI."""
        url = settings.donki_cme_url
        start_date, end_date = self._get_date_range(5)
        params = {"startDate": start_date, "endDate": end_date}
        if settings.nasa_api_key:
            params["api_key"] = settings.nasa_api_key

        try:
            data = await self.client.get(url, params=params)
            await self.repo.insert(source="cme", payload=data)
        except Exception as e:
            logger.error(f"DONKI CME fetch error: {e}")
            raise

    async def fetch_spacex(self) -> None:
        """Fetch next SpaceX launch data."""
        url = settings.spacex_url

        try:
            data = await self.client.get(url)
            await self.repo.insert(source="spacex", payload=data)
        except Exception as e:
            logger.error(f"SpaceX fetch error: {e}")
            raise

    async def get_latest(self, source: str) -> SpaceLatestResponse:
        """Get latest cached data for a specific source."""
        cache = await self.repo.get_latest(source)
        if cache:
            return SpaceLatestResponse(
                source=source,
                fetched_at=cache.fetched_at,
                payload=cache.payload,
            )
        return SpaceLatestResponse(source=source, message="no data")

    async def refresh(self, sources: list[str]) -> SpaceRefreshResponse:
        """Refresh specified sources."""
        refreshed = []
        for src in sources:
            src_lower = src.strip().lower()
            try:
                if src_lower == "apod":
                    await self.fetch_apod()
                    refreshed.append("apod")
                elif src_lower == "neo":
                    await self.fetch_neo()
                    refreshed.append("neo")
                elif src_lower == "flr":
                    await self.fetch_donki_flr()
                    refreshed.append("flr")
                elif src_lower == "cme":
                    await self.fetch_donki_cme()
                    refreshed.append("cme")
                elif src_lower == "spacex":
                    await self.fetch_spacex()
                    refreshed.append("spacex")
            except Exception as e:
                logger.error(f"Failed to refresh {src}: {e}")

        return SpaceRefreshResponse(refreshed=refreshed)

    async def get_summary(
        self, iss_data: dict[str, Any], osdr_count: int
    ) -> SpaceSummaryResponse:
        """Get summary of all cached data sources."""
        apod = await self.repo.get_latest_dict("apod")
        neo = await self.repo.get_latest_dict("neo")
        flr = await self.repo.get_latest_dict("flr")
        cme = await self.repo.get_latest_dict("cme")
        spacex = await self.repo.get_latest_dict("spacex")

        return SpaceSummaryResponse(
            apod=apod,
            neo=neo,
            flr=flr,
            cme=cme,
            spacex=spacex,
            iss=iss_data,
            osdr_count=osdr_count,
        )
