# 🔗 TinyLink - URL Shortener

A modern, full-stack URL shortening service with click tracking and analytics.

## 🚀 Features

- ✅ Create shortened URLs with custom codes
- ✅ Track click counts for each link
- ✅ View detailed link statistics
- ✅ Delete links
- ✅ Responsive design for mobile & desktop

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL (via Neon)
- CORS enabled

**Frontend:**
- React 18 + Vite
- React Router v6
- Responsive CSS

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon PostgreSQL account)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your DATABASE_URL to `.env`:**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/tinylink
   NODE_ENV=development
   PORT=5000
   ```

   **Get PostgreSQL database:**
   - **Option A - Neon (Cloud):** Go to https://console.neon.tech
   - **Option B - Local:** Install PostgreSQL locally

5. **Start backend server:**
   ```bash
   npm run dev
   ```

   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory (new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend:**
   ```bash
   npm run dev
   ```

   Frontend will run on http://localhost:3000

## 🎯 Usage

1. Open http://localhost:3000
2. Enter a URL to shorten
3. (Optional) Add a custom 6-8 character code
4. Click "Shorten URL"
5. Use the copy button to share your shortened link!

## 📡 API Endpoints

```
GET  /healthz              - Health check
POST /api/links            - Create shortened link
GET  /api/links            - List all links
GET  /api/links/:code      - Get link statistics
DELETE /api/links/:code    - Delete link
GET  /:code                - Redirect to original URL (302)
```

## 🚀 Deployment

### Railway (Recommended)

1. Push to GitHub
2. Go to https://railway.app
3. Create new project from GitHub repo
4. Add PostgreSQL database service
5. Deploy!

### Vercel (Frontend) + Railway (Backend)

**Frontend:**
1. Import project in Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy

**Backend:**
1. Deploy on Railway as above

## 📝 Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=5000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome!

## 📧 Support

For issues, please open a GitHub issue.
