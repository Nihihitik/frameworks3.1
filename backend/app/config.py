from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql+asyncpg://user:pass@db:5432/app"
    debug: bool = False

    # NASA APIs (APOD, NeoWs, DONKI, OSDR)
    nasa_api_key: str = ""

    # JWST API
    jwst_api_key: str = ""
    jwst_email: str = ""

    # Astronomy API
    astro_app_id: str = ""
    astro_app_secret: str = ""

    # Fetch intervals (seconds)
    iss_fetch_interval: int = 120
    apod_fetch_interval: int = 43200  # 12h
    neo_fetch_interval: int = 7200    # 2h
    donki_fetch_interval: int = 3600  # 1h
    spacex_fetch_interval: int = 3600 # 1h
    osdr_fetch_interval: int = 600    # 10min

    # API URLs
    iss_url: str = "https://api.wheretheiss.at/v1/satellites/25544"
    osdr_url: str = "https://visualization.osdr.nasa.gov/biodata/api/v2/datasets/?format=json"
    apod_url: str = "https://api.nasa.gov/planetary/apod"
    neo_url: str = "https://api.nasa.gov/neo/rest/v1/feed"
    donki_flr_url: str = "https://api.nasa.gov/DONKI/FLR"
    donki_cme_url: str = "https://api.nasa.gov/DONKI/CME"
    spacex_url: str = "https://api.spacexdata.com/v4/launches/next"
    jwst_url: str = "https://api.jwstapi.com"
    astro_url: str = "https://api.astronomyapi.com/api/v2/bodies/events"


settings = Settings()
