"""Astronomy API service for fetching astronomical events."""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from app.config import settings
from app.services.http_client import HttpClient

logger = logging.getLogger(__name__)


class AstroService:
    """Service for interacting with Astronomy API."""

    def __init__(self) -> None:
        self.base_url = settings.astro_url
        self.app_id = settings.astro_app_id
        self.app_secret = settings.astro_app_secret
        self.client = HttpClient(timeout=25.0)

    def _validate_credentials(self) -> None:
        """Validate that API credentials are configured."""
        if not self.app_id or not self.app_secret:
            raise ValueError("Missing ASTRO_APP_ID or ASTRO_APP_SECRET configuration")

    async def get_events(
        self,
        latitude: float = 55.7558,
        longitude: float = 37.6176,
        days: int = 7,
    ) -> dict[str, Any]:
        """
        Get astronomical events for a location and time range.

        Args:
            latitude: Observer latitude (default: Moscow)
            longitude: Observer longitude (default: Moscow)
            days: Number of days to query (1-30)

        Returns:
            Raw JSON response from Astronomy API
        """
        self._validate_credentials()

        # Clamp days to valid range
        days = max(1, min(30, days))

        # Calculate date range
        now = datetime.now(timezone.utc)
        from_date = now.strftime("%Y-%m-%d")
        to_date = (now + timedelta(days=days)).strftime("%Y-%m-%d")

        params = {
            "latitude": latitude,
            "longitude": longitude,
            "from": from_date,
            "to": to_date,
        }

        try:
            data = await self.client.get_with_basic_auth(
                url=self.base_url,
                username=self.app_id,
                password=self.app_secret,
                params=params,
            )
            return data
        except Exception as e:
            logger.error(f"Astronomy API error: {e}")
            raise
