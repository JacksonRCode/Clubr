# Quick Start - Local Debugging

## 🚀 Fastest Way to Start

### Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```
→ http://localhost:8000/docs

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
→ http://localhost:5173

---

## 📝 Setup (First Time Only)

### Backend Environment
Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET_KEY=dev-secret-key
CORS_ORIGINS=http://localhost:5173
```

### Frontend Environment (Optional)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

## 🛠️ Helper Scripts

```bash
# Start backend
bash scripts/dev-backend.sh

# Start frontend
bash scripts/dev-frontend.sh

# Start both (macOS only)
bash scripts/dev-all.sh
```

---

## 🐛 Debugging

- **Backend**: Visit http://localhost:8000/docs for interactive API testing
- **Frontend**: Open browser DevTools (F12) for console/network debugging
- **Logs**: Check terminal output for both services

---

## 📚 Full Guide

See [LOCAL_DEBUG.md](./LOCAL_DEBUG.md) for detailed debugging instructions.

