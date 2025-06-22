import asyncio
import os
from typing import Optional, Dict
import google.generativeai as genai
from models import BrandStrategy, GeneratedAsset
from services.fal_service import FALService

class VideoCreator:
    def __init__(self):
        self.fal_service = FALService()
        
        # Configure Google Gemini for script generation
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-pro')
        else:
            self.model = None
    
    async def create_promotional_video(self, strategy: BrandStrategy, logo_url: Optional[str] = None) -> GeneratedAsset:
        """Generate promotional video with story-driven script"""
        # First generate a compelling video script
        script = await self._generate_video_script(strategy)
        
        # Then create the video with the script
        return await self.fal_service.generate_promotional_video_with_script(strategy, script, logo_url)
    
    async def _generate_video_script(self, strategy: BrandStrategy) -> Dict:
        """Generate a story-driven video script"""
        if not self.model:
            return self._get_fallback_script(strategy)
        
        prompt = f"""You are a video script writer for startup promotional videos.
        
        Create a compelling 5-second video script for {strategy.company_name}.
        
        Brand context:
        - Company: {strategy.company_name}
        - Tagline: {strategy.tagline}
        - Value proposition: {strategy.unique_value_proposition}
        - Target audience: {strategy.target_audience}
        - Pain points: {', '.join(strategy.customer_pain_points[:3])}
        - Brand story: {strategy.brand_story}
        
        Create a script with this exact structure:
        {{
            "hook": "Opening text/scene that grabs attention (0-1s)",
            "problem_visualization": "Show the problem visually (1-2s)",
            "solution_reveal": "Reveal the solution dramatically (2-3s)",
            "benefit_demonstration": "Show the transformation/benefit (3-4s)",
            "cta": "Call to action text (4-5s)",
            "key_messages": ["3-4 short text overlays throughout the video"],
            "visual_directions": "Specific visual style and mood directions",
            "music_mood": "Type of background music (upbeat, dramatic, etc.)"
        }}
        
        Make it emotional, memorable, and focused on transformation.
        The script should tell a micro-story that resonates with {strategy.target_audience}.
        
        Return only the JSON structure, no explanations."""
        
        try:
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt
            )
            
            # Parse the JSON response
            import json
            script_text = response.text.strip()
            if script_text.startswith('```json'):
                script_text = script_text.replace('```json', '').replace('```', '').strip()
            elif script_text.startswith('```'):
                script_text = script_text.replace('```', '').strip()
            
            return json.loads(script_text)
            
        except Exception as e:
            print(f"Script generation error: {e}")
            return self._get_fallback_script(strategy)
    
    def _get_fallback_script(self, strategy: BrandStrategy) -> Dict:
        """Fallback video script if AI generation fails"""
        return {
            "hook": f"What if {strategy.industry.lower()} was actually simple?",
            "problem_visualization": f"Frustrated professionals struggling with {strategy.customer_pain_points[0] if strategy.customer_pain_points else 'complex solutions'}",
            "solution_reveal": f"{strategy.company_name} interface appearing with smooth, modern design",
            "benefit_demonstration": f"Happy users achieving {strategy.unique_value_proposition}",
            "cta": f"Join thousands already using {strategy.company_name}",
            "key_messages": [
                strategy.tagline,
                f"For {strategy.target_audience.split(',')[0]}",
                "Start free today",
                strategy.company_name
            ],
            "visual_directions": f"{', '.join(strategy.brand_personality)} aesthetic with {strategy.color_scheme.get('primary', '#6366f1')} accents",
            "music_mood": "upbeat and inspirational"
        }