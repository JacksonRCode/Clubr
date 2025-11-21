from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models

# Import the Logic functions
from queries import create_user, check_existing_user

# Import DB setup
from database import get_db
from auth import create_access_token, get_current_user
from datetime import timedelta
from auth import ACCESS_TOKEN_EXPIRE_MINUTES

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
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )

    return {
        "status": "success", 
        "message": "User created successfully", 
        "user_id": new_user.userid,
        "email": new_user.email,
        "access_token": access_token,
        "token_type": "bearer"
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
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": valid_user.email}, expires_delta=access_token_expires
    )

    return {
        "status": "success",
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": valid_user.userid,
            "name": valid_user.name,
            "email": valid_user.email
        }
    }
@app.post("/api/save_tags")
def save_user_tags(tags: list[str], current_user: models.Users = Depends(get_current_user), db: Session = Depends(get_db)):
    from queries import create_user_tags
    create_user_tags(db, current_user.userid, tags)
    return {"status": "success", "message": "Tags saved successfully"}
# --- Health Checks ---
@app.get("/")
def read_root():
    return {"status": "online", "message": "Clubr Backend API is running (With C++ Encryption)"}

@app.get("/health")
def health_check():
    return {"status": "online", "message": "Healthy"}