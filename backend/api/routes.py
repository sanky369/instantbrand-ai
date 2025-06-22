import json
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models import BrandRequest, DetailedBrandRequest, ProgressUpdate, BrandPackage
from typing import Union

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

# Lazy load orchestrator to handle missing API keys gracefully
orchestrator = None

def get_orchestrator():
    global orchestrator
    if orchestrator is None:
        from orchestrator import BrandOrchestrator
        orchestrator = BrandOrchestrator()
    return orchestrator

@router.post("/generate-brand")
async def generate_brand_package(request: Union[BrandRequest, DetailedBrandRequest]):
    """Generate a complete brand package with real-time updates via Server-Sent Events"""
    try:
        orch = get_orchestrator()
        
        async def event_generator():
            async for update in orch.create_brand_package(request):
                # Format as Server-Sent Events
                data = update.model_dump_json()
                yield f"data: {data}\n\n"
        
        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"  # Disable nginx buffering
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/generate-brand-detailed")
async def generate_brand_package_detailed(request: DetailedBrandRequest):
    """Generate a brand package with detailed questionnaire input"""
    return await generate_brand_package(request)

@router.get("/test-agents")
async def test_agents():
    """Test endpoint to verify all agents are working"""
    try:
        # Check API keys first
        google_key = os.getenv("GOOGLE_API_KEY")
        fal_key = os.getenv("FAL_KEY")
        
        if not google_key or google_key == "your_gemini_api_key_here":
            return {
                "status": "warning",
                "message": "Google API key not configured",
                "fal_ai": "configured" if fal_key and fal_key != "your_fal_api_key_here" else "not configured"
            }
        
        # Test brand director
        from agents.brand_director import BrandDirector
        director = BrandDirector()
        
        test_idea = "AI-powered fitness app that creates personalized workout plans"
        strategy = await director.analyze_startup_idea(test_idea)
        
        return {
            "status": "success",
            "message": "All agents are configured correctly",
            "sample_strategy": strategy.model_dump() if hasattr(strategy, 'model_dump') else str(strategy)
        }
    
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Agent test failed: {str(e)}",
            "google_api": "configured" if os.getenv("GOOGLE_API_KEY") and os.getenv("GOOGLE_API_KEY") != "your_gemini_api_key_here" else "not configured",
            "fal_ai": "configured" if os.getenv("FAL_KEY") and os.getenv("FAL_KEY") != "your_fal_api_key_here" else "not configured"
        }