from sqlalchemy import text
from database import engine

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("\n Database connection successful!")
            print(f"Test Query Result: {result.scalar()}\n")
    except Exception as e:
        print("\n Database connection failed.")
        print(f"Error: {e}\n")

if __name__ == "__main__":
    test_connection()