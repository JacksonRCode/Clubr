from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from sqlalchemy.orm import Session
from sqlalchemy import text


app = FastAPI(
    root_path="/api"
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Clubr Backend API is running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "message": "Clubr Backend API is running healthy"
    }

# Vercel serverless function handler
handler = Mangum(app, lifespan="off")