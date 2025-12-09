import httpx


class HttpClient:
    """Shared HTTP client with configurable timeout."""

    def __init__(self, timeout: float = 30.0):
        self.timeout = timeout

    async def get(
        self,
        url: str,
        params: dict | None = None,
        headers: dict | None = None,
    ) -> dict:
        """Perform GET request and return JSON response."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()

    async def get_with_basic_auth(
        self,
        url: str,
        username: str,
        password: str,
        params: dict | None = None,
    ) -> dict:
        """Perform GET request with Basic Auth."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                url,
                params=params,
                auth=(username, password),
            )
            response.raise_for_status()
            return response.json()
