from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models

# Import the Logic functions
from queries import create_user, check_existing_user
from core_logic import (
    signup_user_core, login_user_core,create_event_core, list_events_for_club_core, list_all_events_core, 
    create_post_core, list_posts_for_club_core, update_event_core, delete_event_core, update_post_core,
    delete_post_core
)
# Import DB setup
from database import get_db
from auth import create_access_token, get_current_user
from datetime import timedelta, datetime
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

class EventCreate(BaseModel):
    club_id: int
    title: str
    description: str
    start_datetime: datetime
    end_datetime: datetime
    location: str

class PostCreate(BaseModel):
    club_id: int
    title: str
    content: str

class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    location: str | None = None

class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


# --- ROUTES ---

@app.post("/api/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    return signup_user_core(user, db)

@app.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return login_user_core(user, db)

@app.post("/api/save_tags")
def save_user_tags(tags: list[str], current_user: models.Users = Depends(get_current_user), db: Session = Depends(get_db)):
    from queries import create_user_tags
    create_user_tags(db, current_user.userid, tags)
    return {"status": "success", "message": "Tags saved successfully"}

@app.post("/api/events")
def create_event(
    event: EventCreate,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_event_core(event, current_user, db)

@app.get("/api/clubs/{club_id}/events")
def get_events_for_club(
    club_id: int,
    db: Session = Depends(get_db),
):
    return list_events_for_club_core(club_id, db)

@app.get("/api/events")
def get_all_events(db: Session = Depends(get_db)):
    return list_all_events_core(db)

@app.post("/api/posts")
def create_post(
    post: PostCreate,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_post_core(post, current_user, db)

@app.get("/api/clubs/{club_id}/posts")
def get_posts_for_club(
    club_id: int,
    db: Session = Depends(get_db),
):
    return list_posts_for_club_core(club_id, db)

# --- Health Checks ---
@app.get("/")
def read_root():
    return {"status": "online", "message": "Clubr Backend API is running (With C++ Encryption)"}

@app.get("/health")
def health_check():
    return {"status": "online", "message": "Healthy"}

@app.put("/api/events/{event_id}")
def update_event(
    event_id: int,
    event: EventUpdate,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_event_core(event_id, event, current_user, db)


@app.delete("/api/events/{event_id}")
def delete_event(
    event_id: int,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_event_core(event_id, current_user, db)

@app.put("/api/posts/{post_id}")
def update_post(
    post_id: int,
    post: PostUpdate,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_post_core(post_id, post, current_user, db)


@app.delete("/api/posts/{post_id}")
def delete_post(
    post_id: int,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_post_core(post_id, current_user, db)
