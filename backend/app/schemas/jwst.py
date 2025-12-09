"""Schemas for JWST API endpoints."""

from pydantic import BaseModel, Field


class JWSTImageItem(BaseModel):
    """Single JWST image item."""

    url: str
    caption: str | None = None
    instrument: str | None = None
    program: str | int | None = None
    link: str | None = None


class JWSTFeedResponse(BaseModel):
    """Response schema for JWST feed endpoint."""

    source: str = Field(description="Query source type: jpg, suffix, or program")
    count: int = Field(description="Number of items returned")
    items: list[JWSTImageItem] = Field(default_factory=list, description="List of JWST images")
