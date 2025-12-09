"""JWST API service for fetching James Webb Space Telescope images."""

import logging
import re
from typing import Any

from app.config import settings
from app.services.http_client import HttpClient

logger = logging.getLogger(__name__)


class JWSTService:
    """Service for interacting with JWST API."""

    VALID_INSTRUMENTS = frozenset({"NIRCam", "MIRI", "NIRISS", "NIRSpec", "FGS"})

    def __init__(self) -> None:
        self.base_url = settings.jwst_url.rstrip("/")
        self.api_key = settings.jwst_api_key
        self.email = settings.jwst_email
        self.client = HttpClient(timeout=30.0)

    def _get_headers(self) -> dict[str, str]:
        """Build request headers for JWST API."""
        headers: dict[str, str] = {}
        if self.api_key:
            headers["X-API-KEY"] = self.api_key
        if self.email:
            headers["User-Agent"] = f"space-dashboard/1.0 ({self.email})"
            headers["email"] = self.email
        return headers

    @staticmethod
    def _pick_image_url(data: Any) -> str | None:
        """
        Recursively search for image URL in arbitrary data structure.
        Based on PHP JwstHelper::pickImageUrl pattern.
        """
        if isinstance(data, str):
            if re.match(r"^https?://.*\.(jpg|jpeg|png)$", data, re.IGNORECASE):
                return data
            return None

        if isinstance(data, dict):
            for value in data.values():
                result = JWSTService._pick_image_url(value)
                if result:
                    return result

        if isinstance(data, list):
            for item in data:
                result = JWSTService._pick_image_url(item)
                if result:
                    return result

        return None

    def _extract_image_item(self, item: dict[str, Any]) -> dict[str, Any] | None:
        """Extract image data from JWST API response item."""
        image_url = self._pick_image_url(item)
        if not image_url:
            return None

        # Build structured item
        return {
            "url": image_url,
            "caption": item.get("observation_id") or item.get("file_name") or "",
            "instrument": item.get("instrume") or item.get("instrument") or "",
            "program": item.get("program") or str(item.get("program_id", "")),
            "link": item.get("details_url") or image_url,
        }

    async def _fetch(self, path: str, params: dict[str, Any] | None = None) -> list[Any]:
        """Fetch data from JWST API."""
        url = f"{self.base_url}/{path.lstrip('/')}"
        headers = self._get_headers()

        try:
            data = await self.client.get(url, params=params, headers=headers)
            if isinstance(data, list):
                return data
            if isinstance(data, dict) and "body" in data:
                return data["body"] if isinstance(data["body"], list) else [data["body"]]
            return [data] if data else []
        except Exception as e:
            logger.error(f"JWST API error for {path}: {e}")
            raise

    async def get_feed(
        self,
        source: str = "jpg",
        suffix: str | None = None,
        program: str | None = None,
        instrument: str | None = None,
        per_page: int = 24,
    ) -> dict[str, Any]:
        """
        Get JWST image feed.

        Args:
            source: Type of query - 'jpg', 'suffix', or 'program'
            suffix: Suffix filter (when source='suffix')
            program: Program ID (when source='program')
            instrument: Optional instrument filter (NIRCam, MIRI, NIRISS, NIRSpec, FGS)
            per_page: Number of items to return

        Returns:
            Dict with source, count, and items list
        """
        # Build API path based on source type
        if source == "suffix" and suffix:
            path = f"suffix/{suffix}"
        elif source == "program" and program:
            path = f"program/{program}"
        else:
            path = "all/type/jpg"
            source = "jpg"

        # Fetch raw data
        raw_items = await self._fetch(path, params={"perPage": min(per_page * 2, 100)})

        # Extract image items
        items: list[dict[str, Any]] = []
        for raw_item in raw_items:
            if not isinstance(raw_item, dict):
                continue
            item = self._extract_image_item(raw_item)
            if item:
                # Apply instrument filter if specified
                if instrument and instrument in self.VALID_INSTRUMENTS:
                    item_instrument = item.get("instrument", "").upper()
                    if instrument.upper() not in item_instrument:
                        continue
                items.append(item)
                if len(items) >= per_page:
                    break

        return {
            "source": source,
            "count": len(items),
            "items": items,
        }
