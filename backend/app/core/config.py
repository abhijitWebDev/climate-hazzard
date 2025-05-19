import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
