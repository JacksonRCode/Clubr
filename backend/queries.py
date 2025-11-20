from models import *
from database import SessionLocal
from cpp_bridge import encrypt_password

# Helper functions for database operations

# Database function for creating a user (signing up)
def create_user(email: str, password: str, name: str, profiledescription: str):

    db = SessionLocal()

    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email==email).first()
    if existing_user:
        print(f"This user already exists.")
        db.close()
        return None
    
    # Hash password before storing
    hashed_password = encrypt_password(password)
    new_user = Users(email=email, password=hashed_password, name=name, profiledescription = profiledescription)

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
        input_hash = encrypt_password(password)
        if existing_user.password == input_hash:
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


