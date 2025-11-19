from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

# Create the database engine
# 'pool_pre_ping=True' helps reconnect if the database drops the connection
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Create a SessionLocal class
# Each request will create its own instance of this class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for your database models to inherit from
Base = declarative_base()

# Dependency function to be used in your FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()