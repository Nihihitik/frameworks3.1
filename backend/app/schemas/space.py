from datetime import datetime
from typing import Any

from pydantic import BaseModel


class SpaceCacheData(BaseModel):
    at: datetime | None = None
    payload: dict[str, Any] | None = None


class SpaceLatestResponse(BaseModel):
    source: str
    fetched_at: datetime | None = None
    payload: dict[str, Any] | None = None
    message: str | None = None


class SpaceRefreshResponse(BaseModel):
    refreshed: list[str]


class SpaceSummaryResponse(BaseModel):
    apod: dict[str, Any]
    neo: dict[str, Any]
    flr: dict[str, Any]
    cme: dict[str, Any]
    spacex: dict[str, Any]
    iss: dict[str, Any]
    osdr_count: int
