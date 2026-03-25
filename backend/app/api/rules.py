import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import UserDep
from app.models.schemas import RuleCreate, RuleResponse, RuleUpdate

router = APIRouter()


@router.get(
    "/agents/{agent_id}/rules",
    response_model=List[RuleResponse],
    summary="List rules for an agent",
)
async def list_rules(
    agent_id: uuid.UUID,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> List[RuleResponse]:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.post(
    "/agents/{agent_id}/rules",
    response_model=RuleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a rule to an agent",
)
async def create_rule(
    agent_id: uuid.UUID,
    body: RuleCreate,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> RuleResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.patch(
    "/rules/{rule_id}",
    response_model=RuleResponse,
    summary="Update a rule",
)
async def update_rule(
    rule_id: uuid.UUID,
    body: RuleUpdate,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> RuleResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.delete(
    "/rules/{rule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a rule",
)
async def delete_rule(
    rule_id: uuid.UUID,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> None:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
