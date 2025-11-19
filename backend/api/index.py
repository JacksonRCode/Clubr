from mangum import Mangum
from app import app  # Import the app we created in Step 2

# We don't need to define routes here anymore!

# This wrapper makes FastAPI work on Vercel
handler = Mangum(app, lifespan="off")