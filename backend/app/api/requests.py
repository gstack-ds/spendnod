import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import UserDep
from app.models.schemas import ApproveRequest, AuthorizeResponse, DenyRequest

router = APIRouter()


@router.get(
    "/requests",
    response_model=List[AuthorizeResponse],
    summary="List pending and recent requests",
    description="Returns the human's view of recent authorization requests, newest first.",
)
async def list_requests(
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> List[AuthorizeResponse]:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.post(
    "/requests/{request_id}/approve",
    response_model=AuthorizeResponse,
    summary="Approve a pending request",
)
async def approve_request(
    request_id: uuid.UUID,
    body: ApproveRequest,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> AuthorizeResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.post(
    "/requests/{request_id}/deny",
    response_model=AuthorizeResponse,
    summary="Deny a pending request",
)
async def deny_request(
    request_id: uuid.UUID,
    body: DenyRequest,
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> AuthorizeResponse:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
