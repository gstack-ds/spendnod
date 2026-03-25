import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import UserDep
from app.models.schemas import AgentCreate, AgentCreateResponse, AgentResponse, AgentUpdate

router = APIRouter()


@router.get(
    "/agents",
    response_model=List[AgentResponse],
    summary="List my agents",
)
async def list_agents(
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> List[AgentResponse]:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.post(
    "/agents",
    response_model=AgentCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new agent",
    description=(
        "Creates a new agent and returns its API key. "
        "The API key is only returned once — store it securely."
    ),
)
async def create_agent(
    body: AgentCreate,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> AgentCreateResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.patch(
    "/agents/{agent_id}",
    response_model=AgentResponse,
    summary="Update an agent",
)
async def update_agent(
    agent_id: uuid.UUID,
    body: AgentUpdate,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> AgentResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.delete(
    "/agents/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke an agent",
)
async def revoke_agent(
    agent_id: uuid.UUID,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> None:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
