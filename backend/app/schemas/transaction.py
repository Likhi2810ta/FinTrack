from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class TransactionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    type: Literal["income", "expense"]
    category: str = Field(min_length=1, max_length=50)
    date: date
    description: str = Field(default="", max_length=500)

    @field_validator("title", "category", "description")
    @classmethod
    def strip_whitespace(cls, value: str) -> str:
        return value.strip()


class TransactionResponse(TransactionCreate):
    id: str
