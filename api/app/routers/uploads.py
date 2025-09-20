from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import deps
from ..models.schemas import UploadResponse
from ..services.ingest import ingest_files

router = APIRouter()


@router.post("", response_model=UploadResponse)
async def upload_files(
    files: list[UploadFile] = File(...),
    db_session: Session = Depends(deps.get_db_session),
    user=Depends(deps.get_current_user),
):
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No files uploaded")

    deps.enforce_plan_limits(user, db_session, len(files))

    try:
        batch, reports = ingest_files(db_session, user, files)
        db_session.commit()
    except ValueError as exc:
        db_session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return UploadResponse(
        batchId=batch.id,
        files=[
            {
                "fileId": report.file_id,
                "ticker": report.ticker,
                "strategy": report.strategy,
                "exportDate": report.export_date,
                "rows": report.rows_parsed,
            }
            for report in reports
        ],
    )
