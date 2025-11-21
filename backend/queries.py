from sqlalchemy.orm import Session
from models import Users, Tags, UserTags

from cpp_bridge import encrypt_password

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
        print(f"Error during login: {e}")
        return None