from sqlalchemy.orm import Session
from models import *

from cpp_bridge import encrypt_password

# Database function for creating a user (signing up)
# CHANGE: Added 'db: Session' as the first argument
def create_user(db: Session, email: str, password: str, name: str, profiledescription: str | None = None):
    # 1. Check if user already exists   
    existing_user = db.query(Users).filter(Users.email == email).first()
    if existing_user:
        print(f"User with email {email} already exists.")
        return None
    
    # 2. ENCRYPT THE PASSWORD (C++ Bridge)
    hashed_password = encrypt_password(password)

    # 3. Create the User Object
    new_user = Users(
        email=email, 
        password=hashed_password, 
        name=name, 
        profiledescription=profiledescription
    )

    # 4. Save to DB
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"New user {name} successfully added.")
        return new_user
    except Exception as e:
        db.rollback()
        print(f"Error adding user: {e}")
        return None

# Database function to check if user already exists (logging in)
# CHANGE: Added 'db: Session' as the first argument
def check_existing_user(db: Session, email: str, password: str):
    try:
        # 1. Find user by email
        existing_user = db.query(Users).filter(Users.email == email).first()

        if existing_user is None:
            print(f"Login failed: User not found")
            return None
        
        # 2. ENCRYPT INPUT PASSWORD AND COMPARE
        # We hash the input "password123" -> "1a2b..." 
        # and check if it matches the stored hash.
        input_hash = encrypt_password(password)
        
        if existing_user.password == input_hash:
            print(f"Login successful for {email}")
            return existing_user
        else:
            print(f"Login failed: Incorrect password")
            return None
    
    except Exception as e:
        # Rollback in case of error
        print(f"Error has occured when trying to add log in: {e}")
    
    finally:
        db.close()

# Database function for updating user profile info (name and profile description)
def update_user_profile(db: Session, email: str, name: str, profiledescription: str):
    user = db.query(Users).filter(Users.email == email).first()
    
    # If user does not exist, return None
    if not user:
        return None
    
    # Edit user details
    try:
        user.name = name
        user.profiledescription = profiledescription
        db.commit()
        db.refresh(user)
        return user

    # Rollback and print error mssg in case of error
    except Exception as e:
        db.rollback()
        print(f"Error has occured when trying to edit user details: {e}")
        return None

    finally:
        db.close()

# Database function for adding user tags that reflects user's selected interests during sign up
def create_user_tags(db: Session, user_id: int, tags: list[str]):
    tag_ids = []
    for tag in tags:
        tag = db.query(Tags).filter(Tags.tagname.ilike(tag)).first()
        if tag:
            tag_ids.append(tag.tagid)
    
    for tag_id in tag_ids:
        # Check if already exists to prevent errors
        existing_tag = db.query(UserTags).filter(
            UserTags.userid == user_id, 
            UserTags.tagid == tag_id
        ).first()
        
        if not existing_tag:
            user_tag = UserTags(userid=user_id, tagid=tag_id)
            db.add(user_tag)
            db.commit()
        else:
            print(f"User {user_id} already has tag {tag_id}")

# Database function for creating a tag
def create_tags(db: Session, tagname: str):
    
    new_tag = Tags(tagname=tagname)

    try:
        # Add a new user
        db.add(new_tag)
        db.commit()

        # Refresh object to get its ID
        db.refresh(new_tag)

        print(f"New tag has been successfully added.")
        return new_tag
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to add new tag: {e}")
    
    finally:
        db.close()

# Database function for creating a club
def create_clubs(db: Session, clubname: str, description: str):
    
    new_club = Clubs(clubname=clubname, description=description)

    try:
        # Add a new user
        db.add(new_club)
        db.commit()

        # Refresh object to get its ID
        db.refresh(new_club)

        print(f"New club has been successfully added.")
        return new_club
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to add new club: {e}")
    
    finally:
        db.close()

# Database function for getting all clubs
def get_all_clubs(db: Session):
    return db.query(Clubs).all()

# Database function for updating club profile info (name and profile description)
def update_club_profile(db: Session, club_id: int, name: str, profiledescription: str):
    club = db.query(Clubs).filter_by(clubid=club_id).first()
    
    # If club does not exist, return None
    if not club:
        return None
    
    # Edit club details
    try:
        club.clubname = name
        club.description = profiledescription
        db.commit()
        db.refresh(club)
        return club

    # Rollback and print error mssg in case of error
    except Exception as e:
        db.rollback()
        print(f"Error has occured when trying to edit club details: {e}")
        return None

    finally:
        db.close()


