from pydantic import BaseModel, Field


class Budget(BaseModel):
    category: str = Field(min_length=1, max_length=50)
    amount: float = Field(gt=0)
    month: str = Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")
