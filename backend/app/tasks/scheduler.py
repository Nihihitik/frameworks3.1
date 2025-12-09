import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.config import settings
from app.database import async_session
from app.services.iss_service import ISSService
from app.services.osdr_service import OSDRService
from app.services.space_service import SpaceService

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def fetch_iss_task() -> None:
    """Background task to fetch ISS data."""
    try:
        async with async_session() as session:
            service = ISSService(session)
            await service.fetch_and_store()
            logger.info("ISS data fetched successfully")
    except Exception as e:
        logger.error(f"ISS fetch error: {e}")


async def fetch_osdr_task() -> None:
    """Background task to fetch OSDR data."""
    try:
        async with async_session() as session:
            service = OSDRService(session)
            written = await service.fetch_and_store()
            logger.info(f"OSDR data fetched: {written} items written")
    except Exception as e:
        logger.error(f"OSDR fetch error: {e}")


async def fetch_apod_task() -> None:
    """Background task to fetch APOD data."""
    try:
        async with async_session() as session:
            service = SpaceService(session)
            await service.fetch_apod()
            logger.info("APOD data fetched successfully")
    except Exception as e:
        logger.error(f"APOD fetch error: {e}")


async def fetch_neo_task() -> None:
    """Background task to fetch NeoWs data."""
    try:
        async with async_session() as session:
            service = SpaceService(session)
            await service.fetch_neo()
            logger.info("NEO data fetched successfully")
    except Exception as e:
        logger.error(f"NEO fetch error: {e}")


async def fetch_donki_task() -> None:
    """Background task to fetch DONKI data (FLR and CME)."""
    try:
        async with async_session() as session:
            service = SpaceService(session)
            await service.fetch_donki_flr()
            await service.fetch_donki_cme()
            logger.info("DONKI data fetched successfully")
    except Exception as e:
        logger.error(f"DONKI fetch error: {e}")


async def fetch_spacex_task() -> None:
    """Background task to fetch SpaceX data."""
    try:
        async with async_session() as session:
            service = SpaceService(session)
            await service.fetch_spacex()
            logger.info("SpaceX data fetched successfully")
    except Exception as e:
        logger.error(f"SpaceX fetch error: {e}")


def start_scheduler() -> None:
    """Start the background scheduler with all tasks."""
    # ISS - every 2 minutes by default
    scheduler.add_job(
        fetch_iss_task,
        trigger=IntervalTrigger(seconds=settings.iss_fetch_interval),
        id="fetch_iss",
        name="Fetch ISS Position",
        replace_existing=True,
    )

    # OSDR - every 10 minutes by default
    scheduler.add_job(
        fetch_osdr_task,
        trigger=IntervalTrigger(seconds=settings.osdr_fetch_interval),
        id="fetch_osdr",
        name="Fetch OSDR Data",
        replace_existing=True,
    )

    # APOD - every 12 hours by default
    scheduler.add_job(
        fetch_apod_task,
        trigger=IntervalTrigger(seconds=settings.apod_fetch_interval),
        id="fetch_apod",
        name="Fetch APOD",
        replace_existing=True,
    )

    # NeoWs - every 2 hours by default
    scheduler.add_job(
        fetch_neo_task,
        trigger=IntervalTrigger(seconds=settings.neo_fetch_interval),
        id="fetch_neo",
        name="Fetch NEO Data",
        replace_existing=True,
    )

    # DONKI - every 1 hour by default
    scheduler.add_job(
        fetch_donki_task,
        trigger=IntervalTrigger(seconds=settings.donki_fetch_interval),
        id="fetch_donki",
        name="Fetch DONKI Data",
        replace_existing=True,
    )

    # SpaceX - every 1 hour by default
    scheduler.add_job(
        fetch_spacex_task,
        trigger=IntervalTrigger(seconds=settings.spacex_fetch_interval),
        id="fetch_spacex",
        name="Fetch SpaceX Data",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Background scheduler started")


def shutdown_scheduler() -> None:
    """Shutdown the background scheduler."""
    scheduler.shutdown()
    logger.info("Background scheduler stopped")
