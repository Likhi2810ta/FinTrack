from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pymongo import ReturnDocument

from app.database import budgets_collection
from app.models.budget import Budget
from app.utils.ids import parse_object_id
from app.utils.token import verify_token

router = APIRouter()


def serialize_budget(budget: dict) -> dict:
    return {
        "id": str(budget["_id"]),
        "category": budget["category"],
        "amount": budget["amount"],
        "month": budget["month"],
    }


@router.get("/")
def get_budgets(month: Optional[str] = None, user_id: str = Depends(verify_token)):
    query = {"user_id": user_id}
    if month:
        query["month"] = month
    return [serialize_budget(b) for b in budgets_collection.find(query).sort("category", 1)]


@router.post("/")
def save_budget(budget: Budget, user_id: str = Depends(verify_token)):
    """Create a budget, or update it if one exists for this category + month."""
    data = budget.model_dump()
    data["category"] = data["category"].strip()
    data["user_id"] = user_id

    saved = budgets_collection.find_one_and_update(
        {"user_id": user_id, "category": data["category"], "month": data["month"]},
        {"$set": data},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return serialize_budget(saved)


@router.delete("/{budget_id}")
def delete_budget(budget_id: str, user_id: str = Depends(verify_token)):
    result = budgets_collection.delete_one(
        {"_id": parse_object_id(budget_id, "budget ID"), "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": "Budget deleted successfully"}
