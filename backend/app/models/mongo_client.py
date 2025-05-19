from pymongo import MongoClient
from app.core.config import MONGODB_URI, MONGO_DB

if not MONGO_DB:
    raise ValueError("MONGO_DB environment variable or config is not set")

client = MongoClient(MONGODB_URI)
db = client[MONGO_DB]
weather_collection = db["weather"]
heatwave_collection = db["heatwaves"]