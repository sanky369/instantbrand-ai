from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class BrandRequest(BaseModel):
    startup_idea: str = Field(..., min_length=10, max_length=500, description="Description of the startup idea")

class DetailedBrandRequest(BaseModel):
    startup_idea: str = Field(..., min_length=10, max_length=1000, description="Description of the startup idea")
    business_model: str = Field(..., description="B2B SaaS, D2C, Marketplace, Service, etc.")
    target_demographics: str = Field(..., description="Age, location, income level, etc.")
    key_differentiators: str = Field(..., description="What makes this unique")
    competitors: List[str] = Field(default_factory=list, description="Known competitors")
    brand_personality_preferences: List[str] = Field(default_factory=list, description="Desired brand traits")
    visual_style_preferences: str = Field(default="", description="Modern, classic, playful, minimal, etc.")
    budget_constraints: Optional[str] = Field(None, description="Budget level: bootstrap, funded, enterprise")
    timeline: Optional[str] = Field(None, description="Launch timeline")
    industry_vertical: str = Field(..., description="Specific industry or vertical")

class AgentStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class AgentProgress(BaseModel):
    agent_name: str
    status: AgentStatus
    progress: int = Field(ge=0, le=100)
    message: str
    result: Optional[Dict[str, Any]] = None

class BrandStrategy(BaseModel):
    # Core brand elements
    company_name: str
    alternative_names: List[str] = Field(default_factory=list, description="Alternative name options")
    tagline: str
    positioning_statement: str = Field(..., description="For [target] who [need], [brand] is the [category] that [unique benefit]")
    
    # Market analysis
    industry: str
    target_audience: str
    customer_pain_points: List[str] = Field(default_factory=list, description="3-5 specific problems this solves")
    unique_value_proposition: str = Field(..., description="What makes this 10x better")
    competitive_advantage: str = Field(..., description="Moat or unfair advantage")
    
    # Brand identity
    brand_personality: List[str]
    brand_archetype: str = Field(..., description="Explorer, Sage, Hero, Outlaw, etc.")
    brand_values: List[Dict[str, str]] = Field(default_factory=list, description="Core values with explanations")
    brand_story: str = Field(..., description="50-100 word narrative about why this exists")
    
    # Visual identity
    color_scheme: Dict[str, str]  # {"primary": "#hex", "secondary": "#hex", "accent": "#hex"}
    logo_style: str
    visual_elements: List[str]
    typography_recommendations: Optional[Dict[str, str]] = Field(None, description="Font suggestions")
    
    # Implementation guidance
    domain_suggestions: List[str] = Field(default_factory=list, description="Available domain options")
    social_handles_availability: Dict[str, bool] = Field(default_factory=dict, description="Platform handle availability")

class GeneratedAsset(BaseModel):
    type: str  # "logo", "mockup", "social_post", "video"
    url: str
    filename: str
    metadata: Optional[Dict[str, Any]] = None

class BrandPackage(BaseModel):
    id: str
    strategy: BrandStrategy
    assets: List[GeneratedAsset]
    created_at: str
    status: str
    generation_time_seconds: Optional[int] = None

class ProgressUpdate(BaseModel):
    package_id: str
    overall_progress: int = Field(ge=0, le=100)
    current_agent: str
    agents: List[AgentProgress]
    message: str
    completed: bool = False
    result: Optional[BrandPackage] = None

class RegenerateRequest(BaseModel):
    asset_type: str = Field(..., description="Type of asset to regenerate: logo, mockup, social_post, video")
    original_prompt: str = Field(..., description="Original prompt used for generation")
    new_prompt: str = Field(..., description="New/modified prompt for regeneration")
    brand_strategy: BrandStrategy = Field(..., description="Brand strategy for context")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata like platform for social posts")

class RegenerateResponse(BaseModel):
    success: bool
    asset: Optional[GeneratedAsset] = None
    error: Optional[str] = None