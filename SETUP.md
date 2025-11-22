# TinyLink - Quick Setup Guide

## Step 1: Extract Files
Extract the ZIP file to your desired location.

## Step 2: Install Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@localhost:5432/tinylink
```

**Get a free PostgreSQL database:**
- Neon: https://console.neon.tech (recommended)
- ElephantSQL: https://www.elephantsql.com
- Or install PostgreSQL locally

Start backend:
```bash
npm run dev
```

## Step 3: Install Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

## Step 4: Test

Visit http://localhost:3000 and create your first shortened link!

## Troubleshooting

### Backend won't start?
- Check that PostgreSQL is running
- Verify DATABASE_URL is correct in .env
- Ensure port 5000 is not in use

### Frontend won't start?
- Ensure backend is running first
- Check that port 3000 is not in use
- Run `npm install` again if needed

### Database connection error?
- Verify PostgreSQL credentials
- Check that database exists
- Test connection: `psql $DATABASE_URL`

## Next Steps

1. ✅ Test creating links locally
2. ✅ Deploy to Railway/Vercel
3. ✅ Add custom domain (optional)
4. ✅ Start shortening links!

For detailed documentation, see README.md
