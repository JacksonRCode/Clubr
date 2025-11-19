# Local Debugging Guide

## Quick Start

### Option 1: Run Both Separately (Recommended for Debugging)

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```
Backend runs at: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Option 2: Use Helper Scripts

See scripts below for automated setup.

---

## Backend Debugging

### Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create `.env` file** in `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/dbname
   JWT_SECRET_KEY=your-local-secret-key-here
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ENVIRONMENT=development
   ```

3. **Run with auto-reload:**
   ```bash
   uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

### Debugging Tips

- **View API docs**: Visit `http://localhost:8000/docs` (FastAPI auto-generated Swagger UI)
- **View alternative docs**: Visit `http://localhost:8000/redoc`
- **Check logs**: All print statements and errors appear in terminal
- **Hot reload**: Code changes automatically restart the server (thanks to `--reload`)

### Test Backend

```bash
# Test root endpoint
curl http://localhost:8000/

# Test items endpoint
curl http://localhost:8000/items/123
```

---

## Frontend Debugging

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env` file** in `frontend/` directory (if needed):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

### Debugging Tips

- **Hot reload**: Changes automatically refresh in browser
- **React DevTools**: Install browser extension for component inspection
- **Console logs**: Use `console.log()`, `console.error()`, etc.
- **Network tab**: Check API calls in browser DevTools
- **Source maps**: Enabled by default for debugging

### Update Frontend to Use Local Backend

If your frontend needs to call the backend, update API calls to use:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## VS Code Debugging

### Backend Debugging (Python)

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "api.index:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "jinja": true,
      "justMyCode": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

### Frontend Debugging (React)

VS Code can debug React via Chrome:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

---

## Common Issues

### Backend Issues

**Port already in use:**
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Module not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Database connection errors:**
- Check `.env` file has correct `DATABASE_URL`
- Ensure database is running and accessible

### Frontend Issues

**Port already in use:**
```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
- Ensure backend has frontend URL in `CORS_ORIGINS`
- Check backend is running

---

## Testing API Endpoints

### Using curl

```bash
# GET request
curl http://localhost:8000/

# GET with path parameter
curl http://localhost:8000/items/123

# POST request (example)
curl -X POST http://localhost:8000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Using FastAPI Docs

Visit `http://localhost:8000/docs` for interactive API testing.

### Using Postman/Insomnia

Import your API and test endpoints with a GUI tool.

---

## Environment Variables

### Backend (.env in `backend/`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/clubr
JWT_SECRET_KEY=dev-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

### Frontend (.env in `frontend/`)

```env
VITE_API_URL=http://localhost:8000
```

**Note**: Vite requires `VITE_` prefix for environment variables to be exposed to the frontend.

---

## Debugging Checklist

- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend `.env` file created with correct values
- [ ] Frontend `.env` file created (if needed)
- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] CORS configured correctly
- [ ] Database connection working (if using database)
- [ ] Browser DevTools open for frontend debugging
- [ ] FastAPI docs accessible at `/docs`

