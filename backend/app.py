# from fastapi import FastAPI, Depends, HTTPException, status
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# from passlib.context import CryptContext

# # Import your existing database setup and models
# from database import get_db, engine
# import models 

# # Create tables if they don't exist (useful for dev, though Alembic is better for prod)
# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # --- Security Setup ---
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# # --- CORS Setup ---
# origins = [
#     "http://localhost:3000",      # The port your React app runs on
#     "http://127.0.0.1:3000",      # Alternative localhost URL
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,        # Use specific list instead of ["*"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Pydantic Models (Validation) ---
# class UserSignup(BaseModel):
#     name: str
#     email: str
#     password: str

# class UserLogin(BaseModel):
#     email: str
#     password: str

# # --- Real Database Endpoints ---

# @app.post("/api/signup")
# def signup(user: UserSignup, db: Session = Depends(get_db)):
#     # 1. Check if user already exists in your 'users' table
#     # Note: using models.Users as defined in your models.py
#     existing_user = db.query(models.Users).filter(models.Users.email == user.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     # 2. Hash the password
#     hashed_pw = get_password_hash(user.password)
    
#     # 3. Create new User instance
#     # Note: Your model uses 'userid' as PK, but it autoincrements, so we don't pass it.
#     new_user = models.Users(
#         name=user.name,
#         email=user.email,
#         password=hashed_pw  # Storing the hash in the 'password' column
#     )
    
#     # 4. Save to Database
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
    
#     return {
#         "status": "success", 
#         "message": "User created successfully", 
#         "user_id": new_user.userid
#     }

# @app.post("/api/login")
# def login(user: UserLogin, db: Session = Depends(get_db)):
#     # 1. Query the DB for the user
#     db_user = db.query(models.Users).filter(models.Users.email == user.email).first()
    
#     # 2. Check if user exists and password matches
#     if not db_user or not verify_password(user.password, db_user.password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password"
#         )
    
#     # 3. Return success response
#     return {
#         "status": "success",
#         "message": "Login successful",
#         "user": {
#             "id": db_user.userid,
#             "name": db_user.name,
#             "email": db_user.email
#         }
#     }

# @app.get("/")
# def read_root():
#     return {"status": "online", "message": "Clubr Backend API is running with Real DB"}

# @app.get("/health")
# def health_check():
#     return {"status": "online", "message": "Healthy"}

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Import your existing database setup and models
from database import get_db, engine
import models 

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Setup ---
origins = [
    "http://localhost:3000",      
    "http://127.0.0.1:3000",      
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
# --- Pydantic Models (Validation) ---
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- Real Database Endpoints (No Hashing) ---

@app.post("/api/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(models.Users).filter(models.Users.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Create new User instance (Storing PLAIN TEXT password)
    new_user = models.Users(
        name=user.name,
        email=user.email,
        password=user.password  # DIRECT ASSIGNMENT
    )
    
    # 3. Save to Database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "status": "success", 
        "message": "User created successfully", 
        "user_id": new_user.userid
    }

@app.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Query the DB for the user
    db_user = db.query(models.Users).filter(models.Users.email == user.email).first()
    
    # 2. Check if user exists and password matches (DIRECT COMPARISON)
    if not db_user or user.password != db_user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # 3. Return success response
    return {
        "status": "success",
        "message": "Login successful",
        "user": {
            "id": db_user.userid,
            "name": db_user.name,
            "email": db_user.email
        }
    }

@app.get("/")
def read_root():
    return {"status": "online", "message": "Clubr Backend API is running (No Hashing)"}

@app.get("/health")
def health_check():
    return {"status": "online", "message": "Healthy"}