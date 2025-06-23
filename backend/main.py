from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import os

# Import routes
from api.routes import router as api_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="InstantBrand AI Backend",
    description="AI-powered brand package generation using Google ADK and FAL AI",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api", tags=["brand-generation"])

@app.get("/")
async def root():
    return {"message": "InstantBrand AI Backend is running!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "google_adk": "configured" if os.getenv("GOOGLE_API_KEY") else "not configured",
        "fal_ai": "configured" if os.getenv("FAL_KEY") else "not configured"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)