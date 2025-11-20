from models import *
from database import SessionLocal

# Helper functions for database operations

# Database function for creating a user (signing up)
def create_user(email: str, password: str, name: str, profiledescription: str):

    db = SessionLocal()

    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email==email).first()
    if existing_user:
        print(f"This user already exists.")
        return None
    
    new_user = Users(email=email, password=password, name=name, profiledescription = profiledescription)

    try:
        # Add a new user
        db.add(new_user)
        db.commit()

        # Refresh object to get its ID
        db.refresh(new_user)

        print(f"New user has been successfully added.")
        return new_user
    
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        print(f"Error has occured when trying to add new user: {e}")
    
    finally:
        db.close()

# Database function to check if user already exists (logging in)
def check_existing_user(email: str, password: str):

    db = SessionLocal()

    try:
        # Check if user already exists (via email)
        existing_user = db.query(Users).filter(Users.email==email).first()

        if existing_user is None:
            print(f"User does not exist")
            return None
        
        # Check if correct password for user
        if existing_user.password == password:
            print(f"Correct password.")
            return existing_user
        else:
            print(f"Incorrect password.")
            return None
    
    except Exception as e:
        # Rollback in case of error
        print(f"Error has occured when trying to add log in: {e}")
    
    finally:
        db.close()

# Database function for creating a tag
def create_tags(tagname: str):

    db = SessionLocal()
    
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
def create_clubs(clubname: str, description: str):

    db = SessionLocal()
    
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


