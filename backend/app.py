from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db  # Import the DB tool we just made

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Clubr Backend API is running"}

@app.get("/health")
def health_check():
    return {"status": "online", "message": "Clubr Backend API is running healthy"}

# Example of an integrated DB route
@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        # Try a simple query to check connection
        result = db.execute(text("SELECT 1"))
        return {"status": "success", "db_response": result.scalar()}
    except Exception as e:
        return {"status": "error", "details": str(e)}