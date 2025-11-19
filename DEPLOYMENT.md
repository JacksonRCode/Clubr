# Deployment Guide - Frontend & Backend

## Quick Deploy (Recommended: Single Project)

Deploy both frontend and backend together from the root directory.

### Steps:

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy from root**:

   ```bash
   vercel login
   vercel
   ```

   - Follow prompts (create new project, etc.)

3. **Configure in Vercel Dashboard**:

   - Go to your project → Settings
   - **Root Directory**: `.` (root)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install && cd ../backend && pip install -r requirements.txt`

4. **Add Environment Variables** (Settings → Environment Variables):

   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `JWT_SECRET_KEY`: Generate with `openssl rand -hex 32`
   - `CORS_ORIGINS`: Your frontend URL (auto-set after first deploy)

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### How URLs Work:

- **Frontend**: `https://your-project.vercel.app/`
- **Backend API**: `https://your-project.vercel.app/api/`

---

## Alternative: Two Separate Projects

If you prefer separate deployments:

### Backend:

```bash
cd backend
vercel
# Project name: clubr-backend
# Get URL: https://clubr-backend.vercel.app
```

### Frontend:

```bash
cd frontend
vercel
# Project name: clubr-frontend
# Add env var: VITE_API_URL=https://clubr-backend.vercel.app
```

---

## Environment Variables

### Required:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret for JWT tokens (generate: `openssl rand -hex 32`)

### Optional:

- `JWT_ALGORITHM` - Default: `HS256`
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` - Default: `30`
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS` - Default: `7`
- `CORS_ORIGINS` - Comma-separated allowed origins

---

## Testing After Deployment

```bash
# Test backend
curl https://your-project.vercel.app/api/

# Test frontend
# Visit https://your-project.vercel.app in browser
```

---

## Local Development

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn api.index:app --reload
# Runs on http://localhost:8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Troubleshooting

- **Build fails**: Check all dependencies in `requirements.txt` and `package.json`
- **API 404**: Verify `vercel.json` routes are correct
- **CORS errors**: Add frontend URL to `CORS_ORIGINS` env var
- **Database errors**: Check `DATABASE_URL` format and database accessibility
