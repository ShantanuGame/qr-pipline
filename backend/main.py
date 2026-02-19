from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import qrcode
import base64
from io import BytesIO
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="QR Batch Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI", "your_mongodb_connection_string_here")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

client = MongoClient(MONGO_URI)
db = client["batchtracker"]
batches_collection = db["batches"]

class BatchCreate(BaseModel):
    batch_no: str
    parent_id: str
    lot_no: str
    balls: int
    roller_with_roller_cages: int
    balls_cages: int

def generate_qr_base64(data: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    encoded = base64.b64encode(buffer.read()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


@app.get("/")
def root():
    return {"message": "QR Batch Tracker API is running ✅"}


@app.post("/api/batches", status_code=201)
def create_batch(payload: BatchCreate):
    doc = {
        "batch_no": payload.batch_no,
        "parent_id": payload.parent_id,
        "lot_no": payload.lot_no,
        "balls": payload.balls,
        "roller_with_roller_cages": payload.roller_with_roller_cages,
        "balls_cages": payload.balls_cages,
        "created_at": datetime.utcnow(),
    }
    result = batches_collection.insert_one(doc)
    inserted_id = str(result.inserted_id)
    view_url = f"{FRONTEND_URL}/view/{inserted_id}"
    qr_data_url = generate_qr_base64(view_url)
    doc["_id"] = inserted_id
    doc["created_at"] = doc["created_at"].isoformat()
    return {
        "batch": doc,
        "qr_data_url": qr_data_url,
        "view_url": view_url,
    }


@app.get("/api/batches")
def get_all_batches():
    batches = list(batches_collection.find().sort("created_at", -1))
    result = []
    for b in batches:
        b["_id"] = str(b["_id"])
        if isinstance(b.get("created_at"), datetime):
            b["created_at"] = b["created_at"].isoformat()
        else:
            b["created_at"] = str(b.get("created_at", ""))
        result.append(b)
    return result


@app.get("/api/batches/{batch_id}")
def get_batch(batch_id: str):
    try:
        obj_id = ObjectId(batch_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid batch ID format.")
    batch = batches_collection.find_one({"_id": obj_id})
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")
    batch["_id"] = str(batch["_id"])
    if isinstance(batch.get("created_at"), datetime):
        batch["created_at"] = batch["created_at"].isoformat()
    else:
        batch["created_at"] = str(batch.get("created_at", ""))
    return batch