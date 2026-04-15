
import json
import os
from pathlib import Path
from bson import ObjectId
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "placement_platform")


JSON_PATH = Path(__file__).parent.parent / "PlacementPlatform_questions_updated.json"

def migrate():
    client = MongoClient(MONGO_URI)
    db     = client[DB_NAME]
    col    = db["questions"]

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)

    ops = []
    for q in questions:
        raw_id = q.pop("_id", None)
        oid    = ObjectId(raw_id["$oid"]) if isinstance(raw_id, dict) else ObjectId(raw_id)

        ops.append(
            UpdateOne(
                {"_id": oid},
                {
                    "$set": {
                        "function_name": q.get("function_name", ""),
                        "return_type":   q.get("return_type", ""),
                        "input_format":  q.get("input_format", []),
                        # Also upsert the full document fields for safety
                        "title":            q.get("title"),
                        "description":      q.get("description"),
                        "full_description": q.get("full_description", []),
                        "constraints":      q.get("constraints", []),
                        "testcases":        q.get("testcases", []),
                        "tags":             q.get("tags", []),
                        "topic":            q.get("topic"),
                        "difficulty":       q.get("difficulty"),
                        "company":          q.get("company", []),
                    }
                },
                upsert=True,
            )
        )

    if ops:
        result = col.bulk_write(ops)
        print(f"✅ Migration complete.")
        print(f"   Matched:  {result.matched_count}")
        print(f"   Modified: {result.modified_count}")
        print(f"   Upserted: {result.upserted_count}")
    else:
        print("No operations to perform.")


if __name__ == "__main__":
    migrate()