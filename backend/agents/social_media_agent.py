import asyncio
import os
from typing import List, Dict
import google.generativeai as genai
from models import BrandStrategy, GeneratedAsset
from services.fal_service import FALService

class SocialMediaAgent:
    def __init__(self):
        self.fal_service = FALService()
        
        # Configure Google Gemini for copy generation
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-pro')
        else:
            self.model = None
    
    async def create_social_posts(self, strategy: BrandStrategy) -> List[GeneratedAsset]:
        """Generate social media posts with actual copy for different platforms"""
        # Define platform strategies
        platforms = [
            {
                "name": "instagram",
                "post_type": "carousel",
                "content_strategy": "problem-agitation-solution",
                "tone": "conversational, visual, aspirational",
                "format": "3-slide carousel with hook, problem, solution"
            },
            {
                "name": "linkedin",
                "post_type": "thought_leadership",
                "content_strategy": "industry_insight",
                "tone": "professional, insightful, data-driven",
                "format": "professional insight with statistics and CTA"
            },
            {
                "name": "twitter",
                "post_type": "thread_starter",
                "content_strategy": "controversial_take",
                "tone": "bold, concise, engaging",
                "format": "provocative statement that sparks discussion"
            }
        ]
        
        # Generate copy for each platform
        posts_with_copy = []
        for platform in platforms:
            copy = await self._generate_social_copy(strategy, platform)
            posts_with_copy.append({
                "platform": platform,
                "copy": copy
            })
        
        # Now generate visuals with the actual copy
        return await self.fal_service.generate_social_posts_with_copy(strategy, posts_with_copy)
    
    async def _generate_social_copy(self, strategy: BrandStrategy, platform: Dict) -> str:
        """Generate platform-specific social media copy"""
        if not self.model:
            # Fallback copy if Gemini is not available
            return self._get_fallback_copy(strategy, platform["name"])
        
        prompt = f"""You are a social media copywriter for {strategy.company_name}.
        
        Create a {platform['post_type']} for {platform['name']}.
        
        Brand context:
        - Company: {strategy.company_name}
        - Tagline: {strategy.tagline}
        - Value proposition: {strategy.unique_value_proposition}
        - Target audience: {strategy.target_audience}
        - Pain points addressed: {', '.join(strategy.customer_pain_points[:3])}
        - Brand personality: {', '.join(strategy.brand_personality)}
        - Brand story: {strategy.brand_story}
        
        Platform requirements:
        - Platform: {platform['name']}
        - Content strategy: {platform['content_strategy']}
        - Tone: {platform['tone']}
        - Format: {platform['format']}
        
        Write engaging copy that:
        1. Hooks attention in the first line
        2. Addresses a specific pain point
        3. Presents the solution naturally
        4. Includes a clear call-to-action
        5. Uses appropriate hashtags (3-5 for Instagram/LinkedIn, 2-3 for Twitter)
        
        The copy should feel native to {platform['name']} and drive engagement.
        Keep it concise and impactful. Return only the post copy, no explanations."""
        
        try:
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt
            )
            return response.text.strip()
        except Exception as e:
            print(f"Copy generation error: {e}")
            return self._get_fallback_copy(strategy, platform["name"])
    
    def _get_fallback_copy(self, strategy: BrandStrategy, platform: str) -> str:
        """Fallback copy for each platform"""
        copies = {
            "instagram": f"""🚀 Tired of {strategy.customer_pain_points[0] if strategy.customer_pain_points else 'the status quo'}?
            
            We get it. That's why we built {strategy.company_name}.
            
            {strategy.tagline}
            
            Swipe to see how we're changing the game for {strategy.target_audience} →
            
            #startup #{strategy.industry.lower()} #innovation #techstartup #futureofwork""",
            
            "linkedin": f"""The {strategy.industry} industry is broken.
            
            {strategy.customer_pain_points[0] if strategy.customer_pain_points else 'Current solutions fall short'}.
            
            At {strategy.company_name}, we're taking a different approach: {strategy.unique_value_proposition}
            
            {strategy.positioning_statement}
            
            Ready to join the revolution? Learn more at [link]
            
            #{strategy.industry} #Innovation #StartupLife #TechLeadership""",
            
            "twitter": f"""{strategy.customer_pain_points[0] if strategy.customer_pain_points else 'The old way'} is killing productivity.
            
            There's a better way: {strategy.tagline}
            
            Introducing {strategy.company_name} - {strategy.unique_value_proposition}
            
            Who's ready for change? 👇
            
            #{strategy.company_name.replace(' ', '')} #TechTwitter"""
        }
        
        return copies.get(platform, f"{strategy.tagline} - {strategy.company_name}")