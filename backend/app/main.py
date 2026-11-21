from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FRONTEND_ORIGINS
from app.database import ensure_indexes
from app.routes import auth, budgets, transactions


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        ensure_indexes()
    except Exception as exc:  # don't block startup if Mongo is briefly unavailable
        print(f"Warning: could not create MongoDB indexes: {exc}")
    yield


app = FastAPI(
    title="Expense Tracker API",
    description="Backend API for Expense Tracker",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Expense Tracker API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(budgets.router, prefix="/api/budgets", tags=["Budgets"])
