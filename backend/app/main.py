from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.agents import router as agents_router
from app.api.authorize import router as authorize_router
from app.api.dashboard import router as dashboard_router
from app.api.requests import router as requests_router
from app.api.rules import router as rules_router

app = FastAPI(
    title="AgentGate API",
    description=(
        "Human authorization gateway for AI agent transactions. "
        "Agents submit requests; humans approve or deny via the dashboard."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        ["*"]
        if settings.ENVIRONMENT == "development"
        else ["https://agentgate.dev"]
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agent-facing endpoints (API key auth)
app.include_router(authorize_router, prefix="/v1", tags=["authorization"])

# Human-facing endpoints (Supabase JWT auth)
app.include_router(agents_router, prefix="/v1", tags=["agents"])
app.include_router(rules_router, prefix="/v1", tags=["rules"])
app.include_router(requests_router, prefix="/v1", tags=["requests"])
app.include_router(dashboard_router, prefix="/v1", tags=["dashboard"])


@app.get("/health", tags=["meta"])
async def health() -> dict:
    return {"status": "ok", "version": "0.1.0"}
