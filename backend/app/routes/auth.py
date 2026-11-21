from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError

from app.database import users_collection
from app.schemas.user import UserCreate, UserResponse
from app.utils.ids import parse_object_id
from app.utils.security import hash_password, verify_password
from app.utils.token import create_access_token, verify_token

router = APIRouter()


def _token_response(user: dict) -> dict:
    return {
        "access_token": create_access_token({"sub": str(user["_id"])}),
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
        },
    }


@router.post("/register", status_code=201)
def register_user(user: UserCreate):
    email = user.email.lower()

    if users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "username": user.username.strip(),
        "email": email,
        "password": hash_password(user.password),
    }

    try:
        result = users_collection.insert_one(new_user)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user["_id"] = result.inserted_id
    return _token_response(new_user)


@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username.strip().lower()
    # Fall back to an exact match for accounts created before emails were lowercased
    user = users_collection.find_one({"email": email}) or users_collection.find_one(
        {"email": form_data.username.strip()}
    )

    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return _token_response(user)


@router.get("/me", response_model=UserResponse)
def get_current_user(user_id: str = Depends(verify_token)):
    user = users_collection.find_one({"_id": parse_object_id(user_id, "user ID")})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {"id": str(user["_id"]), "username": user["username"], "email": user["email"]}
