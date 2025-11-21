from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models

# Import the Logic functions
from queries import create_user, check_existing_user

# Import DB setup
from database import get_db

app = FastAPI()

# --- CORS Setup ---
origins = [
    "http://localhost:3000",      
    "http://127.0.0.1:3000",
    "http://localhost:5173",      
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    profiledescription: str | None = None 

class UserLogin(BaseModel):
    email: str
    password: str

# --- ROUTES ---

@app.post("/api/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    # CALL QUERIES.PY (Pass the 'db' session securely)
    new_user = create_user(db, user.email, user.password, user.name, user.profiledescription)
    print("new user")
    print(new_user)
    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="User already exists or creation failed"
        )
    
    return {
        "status": "success", 
        "message": "User created successfully", 
        "user_id": new_user.userid,
        "email": new_user.email
    }

@app.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # CALL QUERIES.PY (Pass the 'db' session securely)
    valid_user = check_existing_user(db, user.email, user.password)
    
    if valid_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    return {
        "status": "success",
        "message": "Login successful",
        "user": {
            "id": valid_user.userid,
            "name": valid_user.name,
            "email": valid_user.email
        }
    }

# --- Health Checks ---
@app.get("/")
def read_root():
    return {"status": "online", "message": "Clubr Backend API is running (With C++ Encryption)"}

@app.get("/health")
def health_check():
    return {"status": "online", "message": "Healthy"}