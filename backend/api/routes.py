import json
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models import BrandRequest, DetailedBrandRequest, ProgressUpdate, BrandPackage, RegenerateRequest, RegenerateResponse
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
        import traceback
        error_details = {
            "error": str(e),
            "type": type(e).__name__,
            "traceback": traceback.format_exc()
        }
        print(f"Generation error: {error_details}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/generate-brand-detailed")
async def generate_brand_package_detailed(request: DetailedBrandRequest):
    """Generate a brand package with detailed questionnaire input"""
    return await generate_brand_package(request)

@router.post("/regenerate-asset")
async def regenerate_asset(request: RegenerateRequest):
    """Regenerate a specific asset with a new prompt"""
    try:
        from services.fal_service import FALService
        fal_service = FALService()
        
        # Regenerate based on asset type
        if request.asset_type == "logo":
            # Override the prompt creation with the user's new prompt
            asset = await fal_service.regenerate_logo(request.brand_strategy, request.new_prompt)
        elif request.asset_type == "mockup":
            asset = await fal_service.regenerate_mockup(request.brand_strategy, request.new_prompt)
        elif request.asset_type == "social_post":
            platform = request.metadata.get("platform", "instagram") if request.metadata else "instagram"
            asset = await fal_service.regenerate_social_post(request.brand_strategy, request.new_prompt, platform)
        elif request.asset_type == "video":
            asset = await fal_service.regenerate_video(request.brand_strategy, request.new_prompt)
        else:
            raise HTTPException(status_code=400, detail=f"Invalid asset type: {request.asset_type}")
        
        return RegenerateResponse(success=True, asset=asset)
    
    except Exception as e:
        import traceback
        print(f"Regeneration error: {traceback.format_exc()}")
        return RegenerateResponse(success=False, error=str(e))

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