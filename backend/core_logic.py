# backend/core_logic.py

# backend/core_logic.py

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

# USER / AUTH
from queries import *

from auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

def signup_user_core(user: Any, db: Session) -> dict:
    """
    Core signup logic, extracted from app.py:

    - Call create_user() (hashing is handled in queries.py / cpp_bridge).
    - Optionally attach tags to the new user.
    - If user already exists, raise HTTPException 400.
    - Create a JWT using the existing auth.create_access_token helper.
    - Return the SAME response shape your teammates already used.
    """
    # 1. Create user via existing DB helper
    new_user = create_user(
        db,
        user.email,
        user.password,
        user.name,
        getattr(user, "profiledescription", None),
    )

    if new_user is None:
        # Same error behaviour as before
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists or creation failed",
        )

    # 2. Optional tags (new bit of logic)
    user_tags = getattr(user, "tags", None)
    if user_tags:
        create_user_tags(db, new_user.userid, user_tags)

    # 3. JWT creation, using the *existing* helper and config
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )

    # 4. Return SAME JSON shape as original app.py signup route
    return {
        "status": "success",
        "message": "User created successfully",
        "user_id": new_user.userid,
        "email": new_user.email,
        "access_token": access_token,
        "token_type": "bearer",
    }


def login_user_core(user: Any, db: Session) -> dict:
    """
    Core login logic, extracted from app.py:

    - Use check_existing_user() to validate email/password.
    - If invalid, raise HTTPException 401.
    - If valid, create JWT with existing helper.
    - Return SAME response shape as original login route.
    """
    valid_user = check_existing_user(db, user.email, user.password)

    if valid_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
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
    }

from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session
import models
from models import Events, Posts, Clubs


# ---------- Helpers to serialise DB models ----------

def _event_to_dict(event: Events, club: Clubs | None = None) -> dict[str, Any]:
    club_name = club.clubname if club else None
    start = event.startdatetime
    end = event.enddatetime

    return {
        "id": event.eventid,
        "clubId": str(event.clubid),
        "clubName": club_name,
        "title": event.title,
        # Frontend-friendly fields
        "date": start.date().isoformat() if start else None,
        "time": start.time().strftime("%H:%M") if start else None,
        "location": event.location,
        "description": event.description,
        # Raw timestamps in case you need them later
        "startdatetime": start.isoformat() if start else None,
        "enddatetime": end.isoformat() if end else None,
    }


def _post_to_dict(post: Posts, club: Clubs | None = None) -> dict[str, Any]:
    club_name = club.clubname if club else None

    return {
        "id": post.postid,
        "clubId": str(post.clubid),
        "clubName": club_name,
        "title": post.title,
        "content": post.content,
        "createdAt": post.timestamp.isoformat() if post.timestamp else None,
        # Placeholder fields the frontend type expects
        "clubAvatar": None,
        "image": None,
        "likes": 0,
    }


# ---------- EVENTS CORE LOGIC ----------

def create_event_core(event_in: Any, current_user: models.Users, db: Session) -> dict:
    """
    Create a new event for a club.

    event_in: Pydantic model with fields:
      - club_id: int
      - title: str
      - description: str
      - start_datetime: datetime
      - end_datetime: datetime
      - location: str
    """

    # TODO: If you want to restrict this to club admins,
    #       check ClubMembership here.

    # Make sure club exists
    club = db.query(Clubs).filter(Clubs.clubid == event_in.club_id).first()
    if club is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Club not found",
        )

    new_event = Events(
        clubid=event_in.club_id,
        title=event_in.title,
        description=event_in.description,
        startdatetime=event_in.start_datetime,
        enddatetime=event_in.end_datetime,
        location=event_in.location,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "status": "success",
        "message": "Event created successfully",
        "event": _event_to_dict(new_event, club),
    }


def list_events_for_club_core(club_id: int, db: Session) -> dict:
    club = db.query(Clubs).filter(Clubs.clubid == club_id).first()
    if club is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Club not found",
        )

    events = (
        db.query(Events)
        .filter(Events.clubid == club_id)
        .order_by(Events.startdatetime.asc())
        .all()
    )

    return {
        "status": "success",
        "club_id": club_id,
        "club_name": club.clubname,
        "events": [_event_to_dict(e, club) for e in events],
    }


def list_all_events_core(db: Session) -> dict:
    events = db.query(Events).order_by(Events.startdatetime.asc()).all()
    club_ids = {e.clubid for e in events}
    clubs = (
        db.query(Clubs)
        .filter(Clubs.clubid.in_(club_ids))
        .all()
        if club_ids
        else []
    )
    club_map = {c.clubid: c for c in clubs}

    return {
        "status": "success",
        "events": [
            _event_to_dict(e, club_map.get(e.clubid)) for e in events
        ],
    }


# ---------- POSTS CORE LOGIC ----------

def create_post_core(post_in: Any, current_user: models.Users, db: Session) -> dict:
    """
    Create a new post for a club.

    post_in: Pydantic model with fields:
      - club_id: int
      - title: str
      - content: str
    """

    club = db.query(Clubs).filter(Clubs.clubid == post_in.club_id).first()
    if club is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Club not found",
        )

    new_post = Posts(
        clubid=post_in.club_id,
        title=post_in.title,
        content=post_in.content,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {
        "status": "success",
        "message": "Post created successfully",
        "post": _post_to_dict(new_post, club),
    }


def list_posts_for_club_core(club_id: int, db: Session) -> dict:
    club = db.query(Clubs).filter(Clubs.clubid == club_id).first()
    if club is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Club not found",
        )

    posts = (
        db.query(Posts)
        .filter(Posts.clubid == club_id)
        .order_by(Posts.timestamp.desc())
        .all()
    )

    return {
        "status": "success",
        "club_id": club_id,
        "club_name": club.clubname,
        "posts": [_post_to_dict(p, club) for p in posts],
    }

# ---------- EVENT UPDATE / DELETE CORE LOGIC ----------

def update_event_core(
    event_id: int,
    event_in: Any,
    current_user: models.Users,
    db: Session,
) -> dict:
    """
    Partially update an existing event.

    Only fields that are not None on event_in will be updated.
    """
    event = db.query(Events).filter(Events.eventid == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    # TODO: enforce that only club admins can edit (if your schema supports it)

    # Apply partial updates
    if getattr(event_in, "title", None) is not None:
        event.title = event_in.title
    if getattr(event_in, "description", None) is not None:
        event.description = event_in.description
    if getattr(event_in, "start_datetime", None) is not None:
        event.startdatetime = event_in.start_datetime
    if getattr(event_in, "end_datetime", None) is not None:
        event.enddatetime = event_in.end_datetime
    if getattr(event_in, "location", None) is not None:
        event.location = event_in.location

    db.commit()
    db.refresh(event)

    club = db.query(Clubs).filter(Clubs.clubid == event.clubid).first()

    return {
        "status": "success",
        "message": "Event updated successfully",
        "event": _event_to_dict(event, club),
    }


def delete_event_core(
    event_id: int,
    current_user: models.Users,
    db: Session,
) -> dict:
    """
    Delete an existing event.
    """
    event = db.query(Events).filter(Events.eventid == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    # TODO: enforce that only club admins can delete

    db.delete(event)
    db.commit()

    return {
        "status": "success",
        "message": "Event deleted successfully",
    }


# ---------- POST UPDATE / DELETE CORE LOGIC ----------

def update_post_core(
    post_id: int,
    post_in: Any,
    current_user: models.Users,
    db: Session,
) -> dict:
    """
    Partially update an existing post.

    Only fields that are not None on post_in will be updated.
    """
    post = db.query(Posts).filter(Posts.postid == post_id).first()
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # TODO: enforce that only the post author or club admin can edit

    if getattr(post_in, "title", None) is not None:
        post.title = post_in.title
    if getattr(post_in, "content", None) is not None:
        post.content = post_in.content

    db.commit()
    db.refresh(post)

    club = db.query(Clubs).filter(Clubs.clubid == post.clubid).first()

    return {
        "status": "success",
        "message": "Post updated successfully",
        "post": _post_to_dict(post, club),
    }


def delete_post_core(
    post_id: int,
    current_user: models.Users,
    db: Session,
) -> dict:
    """
    Delete an existing post.
    """
    post = db.query(Posts).filter(Posts.postid == post_id).first()
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # TODO: enforce that only the post author or club admin can delete

    db.delete(post)
    db.commit()

    return {
        "status": "success",
        "message": "Post deleted successfully",
    }

# ---------- FEED POPULATION CORE LOGIC ----------



"""
class Feed:

posts = queue()
followed = get_all_followed_clubs()
def enqRecentPost()                 # Get most recent post not included
    query most recent post
        if not in queue:
            queue.append(post)
        else:
            next post
def initQueue():                    # Create a queue of 10 posts (3 to be delivered, others staged)
    for 10:
        enqRecentPost()
def populate():                     # Deliver 3 most recent, stage 3 more
    out = queue()
    for 3:
        out.append(getNext())
    return out
def getNext():
    enqRecentPost() older than posts[-1]
    return posts.popleft()
"""


class AbstractFeed:         # Opting for objects since feeds need some persistent memory (know what's already in the feed)
    index = None            # "index" is the last item(id) in the feed, if another is needed this is used for finding the next via query
    def __init__(self, db: Session, current_user = models.Users):
        self.db = db
        self.current_user = current_user
        self.in_feed = set()        # IDs of items already delivered
    
    def mark_delivered(self, item_id):
        self.in_feed.add(item_id)

    def get_newest(self):
        raise NotImplementedError
    
    def get_feed(self, n=10):
        items = []
        for _ in range(n):
            item = self.get_next()
            if item is None:
                break
            items.append(item)
            self.mark_delivered(item['id'])
        return items
    
class DiscoveryFeed(AbstractFeed):
    def __init__(self):
        super().__init__()
    def get_newest(self):
        pass
class PostFeed(AbstractFeed):
    def __init__(self):
        super().__init__()
    def get_newest(self):
        pass
class EventFeed(AbstractFeed):
    def __init__(self):
        super().__init__()
    def get_newest(self):
        pass
    
# ---------- RECOMMENDATION CORE LOGIC ----------


def sort_recommended(db:Session, current_user: models.Users, **kwargs):
    '''
    sort_recommended provides an abstract means of calling various recommendation algorithms
    
    Args:
        db(Session): The active db 
        current_user(models.Users): The current active user
        
    kwargs: dictionary for named optional arguments, allows for flexibly adding more arguments later if needed
        {kwargs['mode']}(int): Selects the recommendation algo to use, defaults to 1 (simple_recommend())
    
    '''
    algos = 1       # The number of recommendation algorithms available, increase if another is added
    mode = 1
    if "mode" in kwargs:
        if int(kwargs['mode']) in range(1, algos+1):
            mode = int(kwargs['mode'])

    def simple_recommend():
        clubs = get_recommended_clubs(db, current_user.userid)
        user_tags = set(tag.tagid for tag in get_user_tags(db, current_user.userid))
        # Sort clubs in place by the number of shared tags (descending)
        clubs.sort(
            key=lambda club: len(
                user_tags & set(tag.tagid for tag in get_club_tags(db, club.clubid))
            ),
            reverse=True,
        )
        return clubs
    if mode == 1:                   # There are better ways to do this but this works for now
        return simple_recommend()
    else:
        return

