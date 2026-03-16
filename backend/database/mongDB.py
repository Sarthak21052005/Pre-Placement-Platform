import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["PlacementPlatform"]

questions_collection = db["questions"]
users_collection = db["users"]
topics_collection = db["topics"]
 