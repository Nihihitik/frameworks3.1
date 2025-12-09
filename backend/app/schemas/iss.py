from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ISSResponse(BaseModel):
    id: int | None = None
    fetched_at: datetime | None = None
    source_url: str | None = None
    payload: dict[str, Any] | None = None
    message: str | None = None


class TrendResponse(BaseModel):
    movement: bool
    delta_km: float
    dt_sec: float
    velocity_kmh: float | None = None
    from_time: datetime | None = None
    to_time: datetime | None = None
    from_lat: float | None = None
    from_lon: float | None = None
    to_lat: float | None = None
    to_lon: float | None = None
