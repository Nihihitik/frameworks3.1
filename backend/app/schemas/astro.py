"""Schemas for Astronomy API endpoints."""

from typing import Any

from pydantic import BaseModel, Field


class AstroEventsResponse(BaseModel):
    """Response schema for astronomy events endpoint (passthrough)."""

    # Passthrough response - we preserve the original API structure
    data: dict[str, Any] = Field(default_factory=dict)
