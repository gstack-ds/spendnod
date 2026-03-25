import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import AgentDep
from app.models.schemas import AuthorizeRequest, AuthorizeResponse

router = APIRouter()


@router.post(
    "/authorize",
    response_model=AuthorizeResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit an authorization request",
    description=(
        "Agent submits a transaction for authorization. Returns immediately if "
        "auto-approved or denied by rules. Returns 202 Accepted with status=pending "
        "if human review is required."
    ),
)
async def create_authorization_request(
    body: AuthorizeRequest,
    agent: AgentDep,
    db: AsyncSession = Depends(get_db),
) -> AuthorizeResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.get(
    "/authorize/{request_id}",
    response_model=AuthorizeResponse,
    summary="Poll authorization request status",
    description="Agent polls for the current status of a pending authorization request.",
)
async def get_authorization_request(
    request_id: uuid.UUID,
    agent: AgentDep,
    db: AsyncSession = Depends(get_db),
) -> AuthorizeResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.delete(
    "/authorize/{request_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel a pending authorization request",
    description="Agent cancels a request it previously submitted that is still pending.",
)
async def cancel_authorization_request(
    request_id: uuid.UUID,
    agent: AgentDep,
    db: AsyncSession = Depends(get_db),
) -> None:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
