from pymongo import ASCENDING, MongoClient

from app.config import DB_NAME, MONGO_URL

client = MongoClient(MONGO_URL)

db = client[DB_NAME]

transactions_collection = db["transactions"]
users_collection = db["users"]
budgets_collection = db["budgets"]


def ensure_indexes():
    users_collection.create_index("email", unique=True)
    transactions_collection.create_index([("user_id", ASCENDING), ("date", ASCENDING)])
    budgets_collection.create_index(
        [("user_id", ASCENDING), ("category", ASCENDING), ("month", ASCENDING)],
        unique=True,
    )
