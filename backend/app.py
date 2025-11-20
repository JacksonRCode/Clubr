from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db  
from queries import create_user, check_existing_user  # Import log-in functions
app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tell FastAPI what data to expect from frontend
class SignupRequest(BaseModel):
    email: str
    password: str
    name: str
    profiledescription: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup_route(user: SignupRequest):
    # 1. Call logic in queries.py (which handles the C++ hashing)
    new_user = create_user(user.email, user.password, user.name, user.profiledescription)
    
    # 2. Check if it failed (e.g., email already exists)
    if new_user is None:
        raise HTTPException(status_code=400, detail="User already exists or creation failed")
    
    return {"status": "success", "user_id": new_user.userid, "email": new_user.email}

@app.post("/login")
def login_route(user: LoginRequest):
    # 1. Call logic in queries.py (which hashes input and compares to DB)
    valid_user = check_existing_user(user.email, user.password)
    
    # 2. Check result
    if valid_user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"status": "success", "message": "Login successful", "user_id": valid_user.userid}

# Checks below

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