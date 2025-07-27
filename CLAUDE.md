# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend Development
- `npm run dev` - Start Next.js development server (port 3000)
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Development
- `cd backend && uvicorn main:app --reload` - Start FastAPI server (port 8000)
- `pip install -r backend/requirements.txt` - Install Python dependencies

### Environment Setup
1. Copy `backend/.env.example` to `backend/.env`
2. Add Google Gemini API key (`GOOGLE_API_KEY`)
3. Add FAL AI API key (`FAL_KEY`)
4. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in frontend `.env.local`

## Architecture Overview

InstantBrand AI is a **multi-agent AI system** that transforms startup ideas into complete brand packages using Google Gemini 2.5-Pro as the core intelligence engine, built for the Google Cloud Multi-Agent Hackathon.

### Tech Stack
- **Frontend**: Next.js 13 (App Router) with TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: FastAPI (Python) with Google Generative AI SDK, FAL AI integration
- **Real-time**: Server-Sent Events (SSE) for progress streaming
- **Type Safety**: TypeScript frontend + Pydantic backend models

### Multi-Agent System Architecture

The system orchestrates 4 specialized AI agents sequentially:

1. **Brand Director Agent** (`backend/agents/brand_director.py`)
   - Uses Google Gemini 2.5-Pro for comprehensive brand strategy
   - Generates 15+ brand components (name, tagline, vision, values, etc.)
   - Outputs structured JSON for downstream agents

2. **Visual Creator Agent** (`backend/agents/visual_creator.py`)
   - Hybrid: Gemini for concepts + FLUX models for generation
   - Creates logos and website mockups via FAL AI
   - Uses FLUX Dev for logos, FLUX Schnell for mockups

3. **Social Media Agent** (`backend/agents/social_media_agent.py`)
   - Gemini for platform-specific copywriting
   - FLUX for social media visuals
   - Generates content for Instagram, LinkedIn, Twitter

4. **Video Creator Agent** (`backend/agents/video_creator.py`)
   - Gemini for script generation
   - Veo3 model for 8-second promotional videos
   - Includes audio generation for complete videos

### Key Development Patterns

#### Frontend Patterns
- **Single Page App**: Main experience in `app/page.tsx` with demo simulation
- **Dashboard Route**: `app/dashboard/[id]/page.tsx` for viewing generated brands
- **Real-time Updates**: SSE integration in `app/page.tsx` (search for `EventSource`)
- **Animation States**: Complex loading animations with Framer Motion
- **Local Storage**: Brand packages saved locally for persistence

#### Backend Patterns
- **Orchestrator Pattern**: `backend/orchestrator.py` coordinates agent execution
- **Progress Streaming**: Real-time updates via SSE in `backend/api/generate.py`
- **Service Layer**: `backend/services/fal_service.py` wraps external APIs
- **Error Handling**: Graceful fallbacks and detailed error messages
- **Async Throughout**: Non-blocking operations for scalability

#### API Integration
- **Google Gemini**: Direct SDK usage with `generativeai.GenerativeModel`
- **FAL AI**: REST API for image/video generation
- **Structured Outputs**: JSON schema validation for AI responses
- **Context Sharing**: Brand strategy passed between agents

### Project Structure
```
app/
├── page.tsx            # Main landing page with demo
├── dashboard/
│   └── [id]/
│       └── page.tsx    # Brand package viewer
└── api/                # API route handlers

backend/
├── agents/             # AI agent implementations
├── services/           # External service integrations
├── api/                # FastAPI routes
├── models.py          # Pydantic data models
├── orchestrator.py    # Agent coordination
└── main.py           # FastAPI application

components/
└── ui/                # shadcn/ui components
```

### Critical Implementation Details

#### SSE Connection Management
- Frontend establishes EventSource connection to `/api/generate/stream`
- Backend yields progress updates with `event: progress` and `event: complete`
- Error handling includes reconnection logic

#### Type Safety
- Frontend: TypeScript interfaces for brand packages
- Backend: Pydantic models (`BrandPackage`, `AgentProgress`)
- API contracts defined in both frontend and backend

#### Cost Optimization
- Strategic model selection (Gemini Flash vs Pro)
- Caching considerations for repeated generations
- Average cost: $3-5 per complete brand package

### Testing & Debugging

#### Frontend Testing
- Check browser console for SSE connection status
- Verify API URL configuration in Network tab
- Use React Developer Tools for state inspection

#### Backend Testing
- FastAPI automatic docs at `http://localhost:8000/docs`
- Test individual agents via `/api/test/{agent_name}`
- Monitor logs for Google/FAL API responses

### Common Development Tasks

#### Adding New Agent Capabilities
1. Update agent prompt in `backend/agents/{agent_name}.py`
2. Modify Pydantic models if output structure changes
3. Update frontend types in `app/page.tsx`

#### Modifying UI Components
1. Check existing patterns in `app/page.tsx`
2. Use Tailwind utilities consistently
3. Add animations with Framer Motion

#### Debugging API Issues
1. Check backend logs for detailed error messages
2. Verify environment variables are set
3. Test with FastAPI interactive docs

### Performance Considerations
- Generation time: 2-5 minutes for complete package
- Concurrent requests supported
- Frontend optimized with static export
- Backend uses async for non-blocking operations

### Deployment Notes
- Frontend: Static export ready for Vercel/Netlify
- Backend: Docker-ready for Cloud Run/Railway
- CORS configured in `backend/main.py`
- Environment-based configuration for production