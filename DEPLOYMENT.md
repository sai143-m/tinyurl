# TinyLink - Deployment Guide

## Railway Deployment (Easiest)

### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your tinylink repository
5. Click "Add PostgreSQL" plugin
6. Railway will automatically set DATABASE_URL
7. Backend deploys automatically!

### Step 3: Deploy Frontend on Railway

1. In same Railway project, click "New Service"
2. Select your tinylink repository again
3. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL (e.g., https://backend-production.up.railway.app)
4. Frontend deploys automatically!

### Step 4: Test

Visit your frontend Railway URL and test creating links!

---

## Vercel + Railway Deployment

### Backend on Railway (as above)

### Frontend on Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Framework: Vite
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL
8. Deploy!

---

## Environment Variables

### Backend (Railway)
```
DATABASE_URL - Auto-provided by Railway PostgreSQL
NODE_ENV=production
PORT - Auto-provided by Railway
```

### Frontend (Vercel/Railway)
```
VITE_API_URL=https://your-backend-url.railway.app
```

---

## Custom Domain

### Railway
1. Go to project settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as shown

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown

---

## Monitoring

- Check Railway logs for errors
- Monitor database connections
- Set up uptime monitoring (UptimeRobot, etc.)

---

## Troubleshooting

### Backend errors?
- Check Railway logs
- Verify DATABASE_URL is set
- Ensure PostgreSQL is running

### Frontend can't connect?
- Verify VITE_API_URL is correct
- Check CORS is enabled in backend
- Test backend health endpoint

### Database connection issues?
- Check Railway PostgreSQL is running
- Verify connection string
- Check connection limits

---

For detailed setup, see SETUP.md
