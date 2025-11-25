from sqlalchemy.orm import Session
from models import *

from cpp_bridge import encrypt_password

# ------------ DB Functions for Users------------

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

# ------------ DB Functions for Clubs ------------

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

# Database function for getting all clubs
def get_all_clubs(db: Session):
    try:
        all_clubs = db.query(Clubs).all()
        return all_clubs
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to get all clubs: {e}")

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

# ------------ DB Functions for Tags ------------

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

# Database function to get all tags from a specific user
def get_user_tags(db: Session, user_id: int):
    try:
        # Get all tags from a specific user
        user_tags = db.query(Tags).join(UserTags, Tags.tagid == UserTags.tagid).filter(UserTags.userid == user_id).all()
        return user_tags
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to get user tags: {e}")

# Database function for adding club tags
def create_club_tags(db: Session, club_id: int, tags: list[str]):
    tag_ids = []
    for tag in tags:
        tag = db.query(Tags).filter(Tags.tagname.ilike(tag)).first()
        if tag:
            tag_ids.append(tag.tagid)
    
    for tag_id in tag_ids:
        # Check if already exists to prevent errors
        existing_tag = db.query(ClubTags).filter(
            ClubTags.clubid == club_id, 
            ClubTags.tagid == tag_id
        ).first()
        
        if not existing_tag:
            club_tag = ClubTags(clubid=club_id, tagid=tag_id)
            db.add(club_tag)
            db.commit()
        else:
            print(f"Club {club_tag} already has tag {tag_id}")

# Database function to get all tags from a specific club
def get_club_tags(db: Session, club_id: int):
    try:
        # Get all tags from a specific club
        club_tags = db.query(Tags).join(ClubTags, Tags.tagid == ClubTags.tagid).filter(ClubTags.clubid == club_id).all()
        return club_tags
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to get club tags: {e}")

# Database function to get list of recommended clubs based on tags for a specific user 
def get_recommended_clubs(db: Session, user_id: int):
    try:

        # Get all tags from specific user
        user_tags = get_user_tags(db, user_id)
        if not user_tags:
            return []
        
        # Convert into set of user tag ids
        user_tag_ids = set()
        for tag in user_tags:
            user_tag_ids.add(tag.tagid)

        # Get all clubs
        all_clubs = get_all_clubs(db)

        recommended_clubs = []

        # Check club tags for all clubs
        for club in all_clubs:
            club_tags = get_club_tags(db, club.clubid)

            # Convert into set of club tag ids
            club_tag_ids = set()
            for tag in club_tags:
                club_tag_ids.add(tag.tagid)
        
            # Compare user's tags and club's tags 
            common_interests = user_tag_ids.intersection(club_tag_ids)

            # If shared tags exist, then add to list of recommended clubs
            if common_interests:
                recommended_clubs.append(club)
        
        # Return list of recommended clubs
        return recommended_clubs

    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to get recommended clubs for user {user_id}: {e}")
        return []

# ------------ DB Functions for Membership ------------

# Database function for checking membership
def check_membership(db: Session, user_id: int, club_id: int):
    try:
        # Check if in ClubMembership table
        membership = db.query(ClubMembership).filter_by(userid=user_id, clubid=club_id).first()
        return membership
    
    except Exception as e:
        db.rollback()
        print(f"Error when checking membership for user {user_id} and club {club_id}: {e}")
        return None

# Database function for following a club
def follow_club(db: Session, user_id: int, club_id: int):

    # Check if already following
    existing_follower = check_membership(db, user_id, club_id)

    if existing_follower:
        return None
    
    # Create ClubMembership Object
    new_follower = ClubMembership(userid=user_id, clubid=club_id, role="Follower")

    # Save to DB
    try:
        db.add(new_follower)
        db.commit()
        db.refresh(new_follower)
        return new_follower

    except Exception as e:
        db.rollback()
        print(f"Error when adding new follower: {e}")
        return None

# Database function for unfollowing a club
def unfollow_club(db: Session, user_id: int, club_id: int):

    # Check if already following
    existing_follower = check_membership(db, user_id, club_id)

    # If follower doesn't exist, return None
    if existing_follower is None:
        return None

    try:
        # Remove follower
        db.query(ClubMembership).filter_by(userid=user_id, clubid=club_id).delete()
        db.commit()

    # Rollback and print error mssg in case of error
    except Exception as e:
        db.rollback()
        print(f"Error has occured when unfollowing: {e}")
        return None

# Database function for getting all followers for a specific user
def get_all_followed_clubs(db: Session, user_id: int):
    try:
        # Get all clubs that the user follows
        all_followed_clubs = db.query(Clubs).join(ClubMembership, Clubs.clubid == ClubMembership.clubid).filter(ClubMembership.userid == user_id).all()
        return all_followed_clubs

    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when getting all followed clubs for user {user_id}: {e}")
        return None

# Database function for getting all followers for a specific club
def get_all_club_followers(db: Session, club_id: int):
    try:
        # Get all followers for that club
        all_followers = db.query(Users).join(ClubMembership, Users.userid == ClubMembership.userid).filter(ClubMembership.clubid == club_id).all()
        return all_followers
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when getting all followers for club {club_id}: {e}")
        return None

# Database function to check admin status for a specific user and club
def check_admin_status(db: Session, user_id: int, club_id: int):
    try:
        # Check club membership table
        membership = check_membership(db, user_id, club_id)

        # Check if membership found and if role is Admin
        if membership is not None and membership.role=="Admin":
            print(f"User {user_id} is a club admin for club {club_id}")
            return True
        else:
            print(f"User {user_id} is not a club admin for club {club_id}")
            return False
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when checking admin status for user {user_id} in {club_id}: {e}")
        return False

# Database function to get all club admins for a specific club
def get_club_admins(db: Session, club_id: int):
    try: 
        # Get all club admins for a specific club
        club_admins = db.query(Users).join(ClubMembership).filter(ClubMembership.clubid == club_id, ClubMembership.role=="Admin").all()
        return club_admins
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when getting all club admins for club {club_id}: {e}")
        return None

# Database function to get all clubs for which the user is an admin
def get_all_admin_clubs_for_user(db: Session, user_id: int):
    try:
        # Get all clubs that the user is an admin for
        all_admin_clubs = db.query(ClubMembership).filter_by(userid=user_id, role="Admin").all()
        return all_admin_clubs

    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when getting all clubs for which the user {user_id} is an admin: {e}")
        return None

# Database function to add new club admin
def add_club_admin(db: Session, user_id: int, club_id: int):
    try:
        # Check club membership table
        membership = check_membership(db, user_id, club_id)

        # If membership does not exist
        if membership is None:

            # Create new ClubMembership object with Admin role
            new_admin = ClubMembership(userid=user_id, clubid=club_id, role="Admin")

            # Save to DB
            db.add(new_admin)
            db.commit()
            return new_admin
        
        # If membership exists
        else:
            # If role is not Admin, change to Admin
            if membership.role!="Admin":
                membership.role="Admin"
                db.commit()
            return membership

    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when adding new club admin {user_id} for club {club_id}: {e}")
        return None

# Database function to remove a club admin
def remove_club_admin(db: Session, user_id: int, club_id: int):
    try:
        # Check club membership table
        membership = check_membership(db, user_id, club_id)

        # If membership does not exist
        if membership is None:
            return None
        
        # If membership role is Admin
        if membership.role=="Admin":

            # Update role from Admin to Follower
            db.query(ClubMembership).filter_by(userid=user_id, clubid=club_id).update({"role": "Follower"})
            db.commit()
    
    # Rollback and print error mssg in case of error
    except Exception as e:
        db.rollback()
        print(f"Error has occured when removing club admin {user_id} from club {club_id}: {e}")
        return None
    
