# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building and Running
- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Package Management
- `npm install` - Install dependencies
- `npm run build` followed by serving the `out/` directory for static hosting

## Architecture Overview

This is a Next.js 13 application for **InstantBrand AI** - an AI-powered creative studio that transforms startup ideas into complete brand packages in 60 seconds.

### Tech Stack
- **Frontend**: Next.js 13 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion for advanced animations and micro-interactions
- **Icons**: Lucide React
- **Deployment**: Static export (`output: 'export'`)

### Key Features
- **AI Agent Simulation**: Realistic progress tracking for 4 AI agents (Brand Director, Visual Creator, Social Media Agent, Video Creator)
- **Interactive Demo**: Live brand package generation simulation with real-time progress
- **Responsive Design**: Mobile-first approach with extensive use of Tailwind utilities
- **Rich Animations**: Sophisticated scroll-triggered animations, hover effects, and loading states

### Project Structure
```
app/
├── globals.css          # Global styles and CSS variables
├── layout.tsx          # Root layout with metadata
└── page.tsx            # Main landing page (single-page app)

components/
└── ui/                 # shadcn/ui components (accordion, button, etc.)

lib/
└── utils.ts           # Utility functions (cn helper)

hooks/
└── use-toast.ts       # Toast notification hook
```

### Component Architecture
- **Single Page Application**: All content is in `app/page.tsx`
- **Component-based**: Reusable UI components from shadcn/ui
- **Animation Components**: Custom floating shapes, particle systems, and loading spinners
- **State Management**: React hooks for demo simulation state

### Styling Approach
- **Tailwind CSS**: Utility-first styling with custom theme extensions
- **CSS Variables**: Dark mode support and consistent theming
- **Responsive Design**: Mobile-first breakpoints (sm, md, lg)
- **Gradient Designs**: Extensive use of gradients for modern aesthetics

### Development Patterns
- **TypeScript**: Strict type checking enabled
- **Component Composition**: Reusable UI components with proper props
- **Animation Patterns**: Framer Motion for entrance animations, hover states, and scroll effects
- **Performance**: Optimized images and static export for fast loading

### Demo Simulation Logic
The application simulates AI agent workflows:
1. **Brand Director**: Analyzes startup ideas
2. **Visual Creator**: Generates logos and mockups
3. **Social Media Agent**: Creates platform-specific content
4. **Video Creator**: Produces promotional videos

Each agent shows realistic progress with staggered animations and completion states.

### Import Aliases
- `@/components` - Components directory
- `@/lib` - Library utilities
- `@/hooks` - Custom React hooks
- `@/ui` - UI components (shadcn/ui)

### Configuration Files
- `components.json` - shadcn/ui configuration
- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `next.config.js` - Next.js configuration for static export
- `tsconfig.json` - TypeScript configuration with path aliases

### Backend Integration
The application now includes a Python FastAPI backend in the `backend/` directory:

#### Backend Architecture
- **FastAPI**: Modern Python web framework for APIs
- **Google ADK**: Agent Development Kit for AI orchestration
- **FAL AI**: Image and video generation services
- **Server-Sent Events**: Real-time progress updates

#### Backend Structure
```
backend/
├── agents/              # AI agent implementations
│   ├── brand_director.py    # Google ADK + Gemini for brand strategy
│   ├── visual_creator.py    # Logo and mockup generation
│   ├── social_media_agent.py # Social media content
│   └── video_creator.py     # Promotional videos
├── services/            # External service integrations
│   └── fal_service.py      # FAL AI API wrapper
├── api/                 # API routes and endpoints
├── models.py           # Pydantic data models
├── orchestrator.py     # Agent coordination
└── main.py            # FastAPI application
```

#### Development Workflow
1. **Frontend**: Run `npm run dev` (Next.js on port 3000)
2. **Backend**: Run `uvicorn main:app --reload` (FastAPI on port 8000)
3. **Integration**: Frontend connects to backend via REST API + SSE

#### Environment Setup
- Copy `backend/.env.example` to `backend/.env`
- Add Google Gemini API key and FAL AI API key
- Install Python dependencies: `pip install -r backend/requirements.txt`

### Deployment
- **Frontend**: Static export to Vercel/Netlify (`npm run build`)
- **Backend**: Python service to Railway/Render
- **Integration**: CORS configured for cross-origin requests