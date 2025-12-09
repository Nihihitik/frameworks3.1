from datetime import datetime
from typing import Any

from sqlalchemy import func, select, text
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.osdr import OSDRItem


class OSDRRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def upsert(
        self,
        dataset_id: str | None,
        title: str | None,
        status: str | None,
        updated_at: datetime | None,
        raw: dict[str, Any],
    ) -> None:
        """Upsert OSDR item by dataset_id."""
        if dataset_id:
            # Use PostgreSQL ON CONFLICT DO UPDATE
            stmt = insert(OSDRItem).values(
                dataset_id=dataset_id,
                title=title,
                status=status,
                updated_at=updated_at,
                raw=raw,
            )
            stmt = stmt.on_conflict_do_update(
                index_elements=["dataset_id"],
                set_={
                    "title": stmt.excluded.title,
                    "status": stmt.excluded.status,
                    "updated_at": stmt.excluded.updated_at,
                    "raw": stmt.excluded.raw,
                },
            )
            await self.session.execute(stmt)
        else:
            # No dataset_id - just insert
            item = OSDRItem(
                dataset_id=None,
                title=title,
                status=status,
                updated_at=updated_at,
                raw=raw,
            )
            self.session.add(item)

        await self.session.commit()

    async def get_list(self, limit: int = 20) -> list[OSDRItem]:
        """Get list of OSDR items ordered by inserted_at desc."""
        stmt = select(OSDRItem).order_by(OSDRItem.inserted_at.desc()).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count(self) -> int:
        """Get total count of OSDR items."""
        stmt = select(func.count()).select_from(OSDRItem)
        result = await self.session.execute(stmt)
        return result.scalar() or 0
