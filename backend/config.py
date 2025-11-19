import os
from dotenv import load_dotenv

# Load the .env file from the same directory
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Clubr"
    VERSION: str = "1.0.0"
    
    # We use the POOLED connection for the actual app
    # This prevents "Too many connections" errors on Vercel
    DATABASE_URL: str = os.getenv("postgresql://neondb_owner:******@ep-raspy-cloud-a8oe00xu-pooler.eastus2.azure.neon.tech/clubr?sslmode=require")
    
    # We keep the SECRET_KEY here too
    JWT_SECRET_KEY: str = os.getenv("5d49140a5fdc4509452b0ac0e0d5214408262b657dae7af6f1f887d89570249b")

# Validate that the DB URL exists
if not Settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is missing from .env file")

settings = Settings()