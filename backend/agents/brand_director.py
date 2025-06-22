import json
import asyncio
import os
import google.generativeai as genai
from models import BrandStrategy, DetailedBrandRequest
from typing import Union

class BrandDirector:
    def __init__(self):
        # Configure Google Gemini API directly
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-pro')
        
        self.system_prompt = """You are a Silicon Valley brand strategist who has worked with Y Combinator startups and Fortune 500 companies.
        
        Your task is to analyze startup ideas through multiple strategic lenses and create comprehensive, actionable brand strategies.
        
        For each startup idea, provide a detailed brand strategy in JSON format with the following structure:
        {
            "company_name": "Unique, trademark-friendly name with strong recall value",
            "alternative_names": ["List of 3-4 alternative name options"],
            "tagline": "Specific benefit-driven tagline that promises transformation (3-8 words)",
            "positioning_statement": "For [target] who [need], [brand] is the [category] that [unique benefit]",
            
            "industry": "Primary industry or sector",
            "target_audience": "Detailed description including demographics, psychographics, and behavioral patterns",
            "customer_pain_points": ["3-5 specific, urgent problems this solves"],
            "unique_value_proposition": "What makes this 10x better than alternatives",
            "competitive_advantage": "Sustainable moat or unfair advantage (network effects, proprietary tech, etc.)",
            
            "brand_personality": ["List of 3-5 personality traits"],
            "brand_archetype": "One of: Explorer, Sage, Hero, Outlaw, Magician, Regular Person, Lover, Jester, Caregiver, Creator, Ruler, Innocent",
            "brand_values": [
                {"value": "Core value name", "explanation": "How this value manifests in the brand"},
                {"value": "Second value", "explanation": "Practical application"}
            ],
            "brand_story": "50-100 word narrative about why this company exists and the change it seeks to create",
            
            "color_scheme": {
                "primary": "#hexcode with WCAG AA contrast",
                "secondary": "#hexcode",
                "accent": "#hexcode",
                "rationale": "Why these colors support the brand personality"
            },
            "logo_style": "Specific style direction avoiding clichés",
            "visual_elements": ["5-7 specific visual elements that reinforce brand identity"],
            "typography_recommendations": {
                "primary": "Font suggestion for headlines",
                "secondary": "Font for body text",
                "rationale": "Why these fonts match brand personality"
            },
            
            "domain_suggestions": ["List of 3-5 available .com domains"],
            "social_handles_availability": {
                "instagram": true/false,
                "twitter": true/false,
                "linkedin": true/false,
                "tiktok": true/false
            }
        }
        
        CRITICAL Guidelines:
        1. MARKET POSITION: Analyze competitive landscape and identify a defensible niche
        2. UNIQUE VALUE: Articulate what makes this 10x better, not just incrementally better
        3. TARGET PERSONA: Create a vivid day-in-the-life scenario of the ideal customer
        4. AVOID CLICHÉS: No generic names like "TechGenius" or taglines like "Your journey starts here"
        5. TRADEMARK FRIENDLY: Names should be distinctive and unlikely to conflict
        6. STORYTELLING: Brand story should evoke emotion and communicate transformation
        7. ACTIONABLE: Every recommendation should be immediately implementable
        
        Industry-specific considerations:
        - B2B SaaS: Focus on ROI, efficiency, integration
        - D2C: Emphasize lifestyle, values, community
        - Marketplace: Highlight network effects, trust, discovery
        - FinTech: Stress security, simplicity, empowerment
        - HealthTech: Prioritize outcomes, accessibility, trust
        
        Always respond with valid JSON only, no additional text."""
    
    async def analyze_startup_idea(self, request: Union[str, DetailedBrandRequest]) -> BrandStrategy:
        """Analyze startup idea and generate brand strategy"""
        try:
            # Build context based on request type
            if isinstance(request, str):
                context = f"Startup idea to analyze: {request}"
            else:
                context = f"""Startup idea to analyze: {request.startup_idea}
                
                Additional context:
                - Business Model: {request.business_model}
                - Industry Vertical: {request.industry_vertical}
                - Target Demographics: {request.target_demographics}
                - Key Differentiators: {request.key_differentiators}
                - Known Competitors: {', '.join(request.competitors) if request.competitors else 'None specified'}
                - Brand Personality Preferences: {', '.join(request.brand_personality_preferences) if request.brand_personality_preferences else 'None specified'}
                - Visual Style Preferences: {request.visual_style_preferences if request.visual_style_preferences else 'None specified'}
                - Budget: {request.budget_constraints if request.budget_constraints else 'Not specified'}
                - Timeline: {request.timeline if request.timeline else 'Not specified'}
                
                Use this additional context to create a highly tailored brand strategy that addresses the specific needs and constraints."""
            
            # Create the full prompt
            full_prompt = f"{self.system_prompt}\n\n{context}"
            
            # Generate response using Gemini
            response = await asyncio.to_thread(
                self.model.generate_content, 
                full_prompt
            )
            
            # Extract text and parse JSON
            response_text = response.text.strip()
            
            # Remove any markdown formatting if present
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            # Parse the JSON response
            brand_data = json.loads(response_text)
            
            # Handle color_scheme if it has rationale field
            if 'color_scheme' in brand_data and 'rationale' in brand_data['color_scheme']:
                # Remove rationale from color_scheme as it's not in the model
                del brand_data['color_scheme']['rationale']
            
            # Ensure required fields have default values if missing
            brand_data.setdefault('alternative_names', [])
            brand_data.setdefault('customer_pain_points', [])
            brand_data.setdefault('brand_values', [])
            brand_data.setdefault('domain_suggestions', [])
            brand_data.setdefault('social_handles_availability', {})
            brand_data.setdefault('typography_recommendations', None)
            
            # Validate and create BrandStrategy object
            strategy = BrandStrategy(**brand_data)
            
            return strategy
            
        except json.JSONDecodeError as e:
            # Fallback if JSON parsing fails
            print(f"JSON parsing error: {e}")
            print(f"Response text: {response_text if 'response_text' in locals() else 'No response'}")
            startup_idea = request if isinstance(request, str) else request.startup_idea
            return self._create_fallback_strategy(startup_idea)
        except Exception as e:
            print(f"Brand analysis error: {e}")
            startup_idea = request if isinstance(request, str) else request.startup_idea
            return self._create_fallback_strategy(startup_idea)
    
    def _create_fallback_strategy(self, startup_idea: str) -> BrandStrategy:
        """Create a basic fallback strategy if AI fails"""
        return BrandStrategy(
            company_name="StartupCo",
            alternative_names=["InnovateCo", "TechVenture", "NextGen"],
            tagline="Innovation Made Simple",
            positioning_statement="For forward-thinking professionals who need cutting-edge solutions, StartupCo is the technology platform that delivers innovation made simple",
            
            industry="Technology",
            target_audience="Tech-savvy professionals aged 25-45 looking for innovative solutions",
            customer_pain_points=[
                "Complex existing solutions",
                "High costs of current alternatives",
                "Lack of integration capabilities"
            ],
            unique_value_proposition="10x faster implementation with AI-powered automation",
            competitive_advantage="Proprietary AI technology with network effects",
            
            brand_personality=["innovative", "reliable", "modern", "approachable"],
            brand_archetype="Creator",
            brand_values=[
                {"value": "Innovation", "explanation": "Constantly pushing boundaries to create better solutions"},
                {"value": "Simplicity", "explanation": "Making complex technology accessible to everyone"},
                {"value": "Reliability", "explanation": "Building trust through consistent performance"}
            ],
            brand_story="Born from frustration with overcomplicated enterprise software, StartupCo exists to democratize access to powerful technology. We believe innovation should empower, not overwhelm.",
            
            color_scheme={
                "primary": "#6366f1",
                "secondary": "#8b5cf6",
                "accent": "#06b6d4"
            },
            logo_style="modern geometric design with subtle gradients",
            visual_elements=["clean lines", "geometric shapes", "gradient accents", "open space", "forward motion"],
            typography_recommendations={
                "primary": "Inter or SF Pro Display",
                "secondary": "Inter or SF Pro Text",
                "rationale": "Clean, modern sans-serif fonts that convey professionalism and approachability"
            },
            
            domain_suggestions=["startupco.com", "getstartupco.com", "startupco.io"],
            social_handles_availability={
                "instagram": True,
                "twitter": True,
                "linkedin": True,
                "tiktok": True
            }
        )