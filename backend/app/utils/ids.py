from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException


def parse_object_id(value: str, label: str = "ID") -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid {label}")
