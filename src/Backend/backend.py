from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
import pymongo

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
client = pymongo.MongoClient(MONGO_URI)
db = client["todo_db"]
collection = db["tasks"]

# FastAPI app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class Task(BaseModel):
    title: str = Field(...)
    desc: str = Field(...)
    status: Optional[str] = "Initiated"   # Default value

class TaskInDB(Task):
    createdAt: datetime
    updatedAt: datetime

# Serializer
def task_serializer(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "desc": task["desc"],
        "status": task.get("status", "Initiated"),
        "createdAt": task["createdAt"].isoformat(),
        "updatedAt": task["updatedAt"].isoformat(),
    }

# Create Task
@app.post("/tasks")
def create_task(task: Task):
    now = datetime.utcnow()
    task_data = {
        "title": task.title,
        "desc": task.desc,
        "status": "Initiated",   # Always store as Initiated first
        "createdAt": now,
        "updatedAt": now,
    }
    result = collection.insert_one(task_data)
    new_task = collection.find_one({"_id": result.inserted_id})
    return task_serializer(new_task)

# Get All Tasks
@app.get("/tasks")
def get_tasks():
    tasks = collection.find()
    return [task_serializer(task) for task in tasks]

# Edit Task
@app.put("/tasks/{task_id}")
def edit_task(task_id: str, task: Task):
    now = datetime.utcnow()
    updated = collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {
            "title": task.title,
            "desc": task.desc,
            "status": task.status,
            "updatedAt": now
        }}
    )
    if updated.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    updated_task = collection.find_one({"_id": ObjectId(task_id)})
    return task_serializer(updated_task)

# Mark Completed
@app.patch("/tasks/{task_id}/complete")
def mark_completed(task_id: str):
    now = datetime.utcnow()
    updated = collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "Completed", "updatedAt": now}}
    )
    if updated.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    updated_task = collection.find_one({"_id": ObjectId(task_id)})
    # return task
    return task_serializer(updated_task)

# Delete Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    deleted = collection.delete_one({"_id": ObjectId(task_id)})
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
