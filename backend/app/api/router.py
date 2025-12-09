from fastapi import APIRouter

from app.api.astro import router as astro_router
from app.api.health import router as health_router
from app.api.iss import router as iss_router
from app.api.jwst import router as jwst_router
from app.api.osdr import router as osdr_router
from app.api.space import router as space_router

router = APIRouter()

# Include all routers
router.include_router(health_router)
router.include_router(iss_router)
router.include_router(osdr_router)
router.include_router(space_router)
router.include_router(jwst_router)
router.include_router(astro_router)
