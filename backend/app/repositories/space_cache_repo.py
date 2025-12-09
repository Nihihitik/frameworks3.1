from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.space_cache import SpaceCache


class SpaceCacheRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def insert(self, source: str, payload: dict[str, Any]) -> SpaceCache:
        """Insert new cache entry."""
        cache = SpaceCache(source=source, payload=payload)
        self.session.add(cache)
        await self.session.commit()
        await self.session.refresh(cache)
        return cache

    async def get_latest(self, source: str) -> SpaceCache | None:
        """Get the most recent cache entry for a specific source."""
        stmt = (
            select(SpaceCache)
            .where(SpaceCache.source == source)
            .order_by(SpaceCache.id.desc())
            .limit(1)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_latest_dict(self, source: str) -> dict[str, Any]:
        """Get latest cache as dict with 'at' and 'payload' keys."""
        cache = await self.get_latest(source)
        if cache:
            return {"at": cache.fetched_at, "payload": cache.payload}
        return {}
