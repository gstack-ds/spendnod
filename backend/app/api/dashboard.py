from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import UserDep
from app.models.schemas import ActivityItem, DashboardStats

router = APIRouter()


@router.get(
    "/dashboard/stats",
    response_model=DashboardStats,
    summary="Spending summary and approval rate stats",
)
async def get_stats(
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> DashboardStats:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.get(
    "/dashboard/activity",
    response_model=List[ActivityItem],
    summary="Recent activity feed",
)
async def get_activity(
    user: UserDep,
    db: AsyncSession = Depends(get_db),
) -> List[ActivityItem]:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
