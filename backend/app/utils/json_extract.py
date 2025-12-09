from datetime import datetime
from typing import Any


def extract_string(data: dict[str, Any], keys: list[str]) -> str | None:
    """Extract first non-empty string value from dict using list of possible keys.

    Args:
        data: Dictionary to search in
        keys: List of possible key names to try

    Returns:
        First non-empty string found, or None
    """
    for key in keys:
        value = data.get(key)
        if value is not None:
            if isinstance(value, str) and value.strip():
                return value
            if isinstance(value, (int, float)):
                return str(value)
    return None


def extract_timestamp(data: dict[str, Any], keys: list[str]) -> datetime | None:
    """Extract timestamp from dict, supporting multiple formats.

    Supports:
    - ISO 8601 strings
    - "YYYY-MM-DD HH:MM:SS" format
    - Unix timestamps (seconds)

    Args:
        data: Dictionary to search in
        keys: List of possible key names to try

    Returns:
        Parsed datetime (UTC) or None
    """
    for key in keys:
        value = data.get(key)
        if value is None:
            continue

        if isinstance(value, str):
            # Try ISO 8601
            try:
                return datetime.fromisoformat(value.replace("Z", "+00:00"))
            except ValueError:
                pass

            # Try YYYY-MM-DD HH:MM:SS
            try:
                return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                pass

        elif isinstance(value, int):
            # Unix timestamp
            try:
                return datetime.utcfromtimestamp(value)
            except (ValueError, OSError):
                pass

    return None


def extract_number(data: dict[str, Any], key: str) -> float | None:
    """Extract numeric value from dict, supporting both float and string representations.

    Args:
        data: Dictionary to search in
        key: Key name to look for

    Returns:
        Float value or None
    """
    value = data.get(key)
    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            pass

    return None
