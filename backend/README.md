# InstantBrand AI Backend

Python FastAPI backend for the InstantBrand AI application, integrating Google ADK agents with FAL AI services.

## Setup Instructions

### Prerequisites
- Python 3.10+ 
- pip (Python package manager)

### Installation

1. **Create virtual environment** (recommended):
```bash
cd backend/
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Environment Configuration**:
```bash
cp .env.example .env
```

Edit `.env` file with your API keys:
```env
# Google ADK Configuration
GOOGLE_API_KEY=your_gemini_api_key_here
GOOGLE_GENAI_USE_VERTEXAI=false

# FAL AI Configuration  
FAL_KEY=your_fal_api_key_here

# Application Configuration
DEBUG=true
CORS_ORIGINS=http://localhost:3000
```

### Getting API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

#### FAL AI API Key
1. Sign up at [fal.ai](https://fal.ai/)
2. Go to your dashboard
3. Generate an API key
4. Copy the key to your `.env` file

### Running the Server

```bash
# Development mode (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python main.py
```

The server will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Core Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /api/generate-brand` - Generate brand package (Server-Sent Events)
- `GET /api/test-agents` - Test agent configuration

### Using the Brand Generation API

The main endpoint streams progress updates using Server-Sent Events (SSE):

```javascript
// Frontend usage example
const eventSource = new EventSource('http://localhost:8000/api/generate-brand', {
  method: 'POST',
  body: JSON.stringify({
    startup_idea: "AI-powered fitness app that creates personalized workout plans"
  })
});

eventSource.onmessage = function(event) {
  const update = JSON.parse(event.data);
  console.log('Progress:', update.overall_progress + '%');
  console.log('Current agent:', update.current_agent);
  
  if (update.completed) {
    console.log('Brand package ready:', update.result);
    eventSource.close();
  }
};
```

## Architecture

### Agent System
- **BrandDirector**: Analyzes startup ideas using Google ADK + Gemini
- **VisualCreator**: Generates logos and mockups using FAL AI
- **SocialMediaAgent**: Creates social media posts for multiple platforms  
- **VideoCreator**: Produces promotional videos

### Services
- **FALService**: Handles all FAL AI API interactions
- **Orchestrator**: Coordinates agents and manages workflow

### Models
- Pydantic models for request/response validation
- Type-safe data structures for all components

## Development

### Project Structure
```
backend/
├── agents/              # AI agent implementations
│   ├── brand_director.py
│   ├── visual_creator.py
│   ├── social_media_agent.py
│   └── video_creator.py
├── api/                 # API routes
│   └── routes.py
├── services/            # External service integrations
│   └── fal_service.py
├── models.py           # Pydantic data models
├── orchestrator.py     # Agent orchestration
├── main.py            # FastAPI application
└── requirements.txt   # Dependencies
```

### Testing

Test the agents individually:
```bash
curl http://localhost:8000/api/test-agents
```

Test the full workflow:
```bash
curl -X POST http://localhost:8000/api/generate-brand \
  -H "Content-Type: application/json" \
  -d '{"startup_idea": "AI-powered meal planning app"}'
```

### Debugging

1. Check logs for any errors
2. Verify API keys are configured correctly
3. Test individual agent endpoints
4. Monitor FAL AI usage and quotas

## Cost Optimization

### FAL AI Usage
- Logos: ~$0.05-0.10 per generation (FLUX model)
- Mockups: ~$0.02-0.05 per generation (FLUX Schnell)
- Social posts: ~$0.02-0.05 each (3 posts = ~$0.06-0.15)
- Videos: ~$2.50 per 5-second video

**Total estimated cost per brand package: $3-5**

### Optimization Tips
- Use FLUX Schnell for faster, cheaper mockups
- Batch similar requests when possible
- Implement caching for repeated requests
- Monitor usage and set appropriate limits

## Deployment

### Local Development
```bash
uvicorn main:app --reload
```

### Production Deployment

#### Option 1: Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

#### Option 2: Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy Python service

#### Environment Variables for Production
```env
GOOGLE_API_KEY=production_gemini_key
FAL_KEY=production_fal_key
CORS_ORIGINS=https://your-frontend-domain.com
DEBUG=false
```

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure all dependencies are installed
2. **API key errors**: Verify keys are correctly set in .env
3. **CORS issues**: Check CORS_ORIGINS configuration
4. **Rate limiting**: Monitor API usage and implement backoff

### Error Handling

The application includes comprehensive error handling:
- Graceful fallbacks for AI generation failures
- Retry logic for transient errors
- Detailed error logging for debugging
- User-friendly error messages

## Next Steps

1. Add database integration (PostgreSQL/Supabase)
2. Implement user authentication
3. Add asset storage (S3/Cloudinary)
4. Implement rate limiting
5. Add monitoring and analytics