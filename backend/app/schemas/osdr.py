from datetime import datetime
from typing import Any

from pydantic import BaseModel


class OSDRItemResponse(BaseModel):
    id: int
    dataset_id: str | None = None
    title: str | None = None
    status: str | None = None
    updated_at: datetime | None = None
    inserted_at: datetime
    raw: dict[str, Any]


class OSDRListResponse(BaseModel):
    items: list[OSDRItemResponse]


class OSDRSyncResponse(BaseModel):
    written: int
