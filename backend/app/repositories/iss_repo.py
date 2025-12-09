from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.iss import ISSFetchLog


class ISSRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def insert(self, source_url: str, payload: dict[str, Any]) -> ISSFetchLog:
        """Insert new ISS fetch log entry."""
        log = ISSFetchLog(source_url=source_url, payload=payload)
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log

    async def get_latest(self) -> ISSFetchLog | None:
        """Get the most recent ISS fetch log entry."""
        stmt = select(ISSFetchLog).order_by(ISSFetchLog.id.desc()).limit(1)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_last_two(self) -> list[ISSFetchLog]:
        """Get the two most recent ISS fetch log entries for trend calculation."""
        stmt = select(ISSFetchLog).order_by(ISSFetchLog.id.desc()).limit(2)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
