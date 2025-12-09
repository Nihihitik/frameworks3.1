import logging
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.repositories.osdr_repo import OSDRRepository
from app.schemas.osdr import OSDRItemResponse, OSDRListResponse, OSDRSyncResponse
from app.services.http_client import HttpClient
from app.utils.json_extract import extract_string, extract_timestamp

logger = logging.getLogger(__name__)


class OSDRService:
    def __init__(self, session: AsyncSession):
        self.repo = OSDRRepository(session)
        self.client = HttpClient(timeout=30.0)

    async def fetch_and_store(self) -> int:
        """Fetch OSDR data from API and upsert into database."""
        url = settings.osdr_url
        params = {}
        if settings.nasa_api_key:
            params["api_key"] = settings.nasa_api_key

        try:
            data = await self.client.get(url, params=params if params else None)
        except Exception as e:
            logger.error(f"OSDR fetch error: {e}")
            raise

        # Parse items from response - handle multiple formats
        items: list[dict[str, Any]] = []
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            if "items" in data and isinstance(data["items"], list):
                items = data["items"]
            elif "results" in data and isinstance(data["results"], list):
                items = data["results"]
            else:
                items = [data]

        written = 0
        for item in items:
            if not isinstance(item, dict):
                continue

            dataset_id = extract_string(
                item,
                ["dataset_id", "id", "uuid", "studyId", "accession", "osdr_id"],
            )
            title = extract_string(item, ["title", "name", "label"])
            status = extract_string(item, ["status", "state", "lifecycle"])
            updated_at = extract_timestamp(
                item,
                ["updated", "updated_at", "modified", "lastUpdated", "timestamp"],
            )

            await self.repo.upsert(
                dataset_id=dataset_id,
                title=title,
                status=status,
                updated_at=updated_at,
                raw=item,
            )
            written += 1

        return written

    async def sync(self) -> OSDRSyncResponse:
        """Trigger sync and return count of written items."""
        written = await self.fetch_and_store()
        return OSDRSyncResponse(written=written)

    async def get_list(self, limit: int = 20) -> OSDRListResponse:
        """Get list of OSDR items."""
        items = await self.repo.get_list(limit=limit)
        return OSDRListResponse(
            items=[
                OSDRItemResponse(
                    id=item.id,
                    dataset_id=item.dataset_id,
                    title=item.title,
                    status=item.status,
                    updated_at=item.updated_at,
                    inserted_at=item.inserted_at,
                    raw=item.raw,
                )
                for item in items
            ]
        )

    async def get_count(self) -> int:
        """Get total count of OSDR items."""
        return await self.repo.count()
