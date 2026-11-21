from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pymongo import DESCENDING

from app.database import transactions_collection
from app.schemas.transaction import TransactionCreate
from app.utils.ids import parse_object_id
from app.utils.token import verify_token

router = APIRouter()


def serialize_transaction(transaction: dict) -> dict:
    date_value = transaction.get("date")
    if isinstance(date_value, datetime):
        date_value = date_value.strftime("%Y-%m-%d")

    description = transaction.get("description", "")
    return {
        "id": str(transaction["_id"]),
        # Older records may have been saved without a title
        "title": transaction.get("title") or description or transaction.get("category", ""),
        "amount": transaction["amount"],
        "type": transaction["type"],
        "category": transaction.get("category", "Other"),
        "date": date_value,
        "description": description,
    }


def _to_document(transaction: TransactionCreate) -> dict:
    data = transaction.model_dump()
    data["date"] = datetime.combine(data["date"], datetime.min.time())
    return data


@router.get("/")
def get_transactions(user_id: str = Depends(verify_token)):
    cursor = transactions_collection.find({"user_id": user_id}).sort(
        [("date", DESCENDING), ("_id", DESCENDING)]
    )
    return [serialize_transaction(t) for t in cursor]


@router.post("/", status_code=201)
def create_transaction(transaction: TransactionCreate, user_id: str = Depends(verify_token)):
    document = _to_document(transaction)
    document["user_id"] = user_id
    result = transactions_collection.insert_one(document)
    document["_id"] = result.inserted_id
    return serialize_transaction(document)


@router.get("/{transaction_id}")
def get_transaction(transaction_id: str, user_id: str = Depends(verify_token)):
    transaction = transactions_collection.find_one(
        {"_id": parse_object_id(transaction_id, "transaction ID"), "user_id": user_id}
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return serialize_transaction(transaction)


@router.put("/{transaction_id}")
def update_transaction(
    transaction_id: str,
    updated_transaction: TransactionCreate,
    user_id: str = Depends(verify_token),
):
    object_id = parse_object_id(transaction_id, "transaction ID")
    result = transactions_collection.find_one_and_update(
        {"_id": object_id, "user_id": user_id},
        {"$set": _to_document(updated_transaction)},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return serialize_transaction(result)


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str, user_id: str = Depends(verify_token)):
    result = transactions_collection.delete_one(
        {"_id": parse_object_id(transaction_id, "transaction ID"), "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}
