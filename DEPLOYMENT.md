# Deployment Guide

This document explains how to deploy InstantBrand AI to Vercel (frontend) and Render (backend).

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.12+ for backend development
- Google Gemini API key
- FAL AI API key
- Vercel account
- Render account

## Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the root directory (not the backend folder)

### 2. Configure Build Settings
Vercel will automatically detect Next.js. The project uses standard SSR deployment:
- Build Command: `npm run build`
- Framework: Next.js
- Note: Uses SSR instead of static export to support dynamic dashboard routes

### 3. Environment Variables
Add these environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

### 4. Deploy
Click "Deploy" and Vercel will build and deploy your frontend.

## Backend Deployment (Render)

### 1. Create Web Service
1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set the root directory to `backend`

### 2. Configure Service
- **Name**: `instantbrand-ai-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Environment Variables
Add these environment variables in Render dashboard:
```
GOOGLE_API_KEY=your_google_gemini_api_key_here
FAL_KEY=your_fal_ai_api_key_here
CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
PYTHON_VERSION=3.12.0
```

### 4. Deploy
Click "Create Web Service" and Render will build and deploy your backend.

## Post-Deployment Configuration

### 1. Update Frontend API URL
Once your Render backend is deployed, update the Vercel environment variable:
```
NEXT_PUBLIC_API_URL=https://your-actual-render-url.onrender.com
```

### 2. Update Backend CORS
Update the Render environment variable:
```
CORS_ORIGINS=https://your-actual-vercel-url.vercel.app,http://localhost:3000
```

### 3. Update vercel.json
Edit `vercel.json` and replace the placeholder URL:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-actual-render-url.onrender.com/api/:path*"
    }
  ]
}
```

## Health Checks

### Frontend
- Visit your Vercel URL
- Check that the landing page loads correctly
- Test the brand generation demo

### Backend
- Visit `https://your-render-url.onrender.com/health`
- Should return JSON with service status
- Check that Google ADK and FAL AI are configured

## Development Workflow

### Local Development
1. **Frontend**: `npm run dev` (port 3000)
2. **Backend**: `cd backend && uvicorn main:app --reload` (port 8000)

### Production Testing
1. Test frontend → backend API calls
2. Verify CORS configuration
3. Check Server-Sent Events for brand generation
4. Test all AI agent workflows

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS_ORIGINS includes your Vercel domain
2. **API Timeouts**: Render free tier has cold starts - first request may be slow
3. **Build Failures**: Check Python version and dependencies in requirements.txt
4. **Static Export Issues**: Ensure no server-side only features in frontend

### Monitoring

- **Vercel**: Check deployment logs and analytics
- **Render**: Monitor service logs and performance metrics
- **API Keys**: Verify Google Gemini and FAL AI quotas

## Security Notes

- Never commit API keys to git
- Use environment variables for all secrets
- CORS is configured for specific origins only
- Static files are served securely with proper headers