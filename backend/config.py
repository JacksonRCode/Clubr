import os
from dotenv import load_dotenv

# Load the .env file from the same directory
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Clubr"
    VERSION: str = "1.0.0"
    
    # CORRECT: Ask for the variable named "DATABASE_URL"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # CORRECT: Ask for the variable named "JWT_SECRET_KEY"
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")

# Validate that the DB URL exists
# If you used your previous code, this would have raised the error because 
# os.getenv() would return None.
if not Settings.DATABASE_URL:
    raise ValueError("DATABASE_URL not working!!")

settings = Settings()