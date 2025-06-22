import os
import asyncio
from typing import List, Dict, Any, Optional
import fal_client as fal
from models import GeneratedAsset, BrandStrategy

class FALService:
    def __init__(self):
        self.fal_key = os.getenv("FAL_KEY")
        if not self.fal_key:
            raise ValueError("FAL_KEY environment variable is required")
        
        # Configure FAL client
        fal.api_key = self.fal_key
    
    async def generate_logo(self, strategy: BrandStrategy) -> GeneratedAsset:
        """Generate logo using FLUX model"""
        try:
            # Create detailed prompt for logo generation
            prompt = self._create_logo_prompt(strategy)
            
            # Use FLUX model for high-quality logo generation
            result = await fal.subscribe_async(
                "fal-ai/flux/dev",
                arguments={
                    "prompt": prompt,
                    "image_size": "square_hd",
                    "num_inference_steps": 50,
                    "guidance_scale": 7.5,
                    "enable_safety_checker": True
                }
            )
            
            # Extract image URL
            image_url = result["images"][0]["url"]
            
            return GeneratedAsset(
                type="logo",
                url=image_url,
                filename=f"logo_{strategy.company_name.lower().replace(' ', '_')}.png",
                metadata={
                    "prompt": prompt,
                    "model": "flux-dev",
                    "style": strategy.logo_style
                }
            )
            
        except Exception as e:
            print(f"Logo generation error: {e}")
            # Return placeholder for demo
            return GeneratedAsset(
                type="logo",
                url="https://via.placeholder.com/512x512/6366f1/ffffff?text=LOGO",
                filename=f"logo_{strategy.company_name.lower().replace(' ', '_')}.png",
                metadata={"error": str(e)}
            )
    
    async def generate_website_mockup(self, strategy: BrandStrategy) -> GeneratedAsset:
        """Generate website mockup"""
        try:
            prompt = self._create_mockup_prompt(strategy)
            
            result = await fal.subscribe_async(
                "fal-ai/flux/schnell",  # Faster model for mockups
                arguments={
                    "prompt": prompt,
                    "image_size": "landscape_16_9",
                    "num_inference_steps": 4,
                    "enable_safety_checker": True
                }
            )
            
            image_url = result["images"][0]["url"]
            
            return GeneratedAsset(
                type="mockup",
                url=image_url,
                filename=f"mockup_{strategy.company_name.lower().replace(' ', '_')}.png",
                metadata={
                    "prompt": prompt,
                    "model": "flux-schnell",
                    "type": "website_mockup"
                }
            )
            
        except Exception as e:
            print(f"Mockup generation error: {e}")
            return GeneratedAsset(
                type="mockup",
                url="https://via.placeholder.com/800x450/8b5cf6/ffffff?text=WEBSITE+MOCKUP",
                filename=f"mockup_{strategy.company_name.lower().replace(' ', '_')}.png",
                metadata={"error": str(e)}
            )
    
    async def generate_social_posts(self, strategy: BrandStrategy) -> List[GeneratedAsset]:
        """Generate social media posts for different platforms"""
        platforms = [
            {"name": "instagram", "size": "square_hd", "style": "Instagram post"},
            {"name": "linkedin", "size": "landscape_4_3", "style": "LinkedIn professional post"},
            {"name": "twitter", "size": "landscape_16_9", "style": "Twitter/X social post"}
        ]
        
        assets = []
        
        for platform in platforms:
            try:
                prompt = self._create_social_post_prompt(strategy, platform["style"])
                
                result = await fal.subscribe_async(
                    "fal-ai/flux/schnell",
                    arguments={
                        "prompt": prompt,
                        "image_size": platform["size"],
                        "num_inference_steps": 4,
                        "enable_safety_checker": True
                    }
                )
                
                image_url = result["images"][0]["url"]
                
                assets.append(GeneratedAsset(
                    type="social_post",
                    url=image_url,
                    filename=f"social_{platform['name']}_{strategy.company_name.lower().replace(' ', '_')}.png",
                    metadata={
                        "prompt": prompt,
                        "platform": platform["name"],
                        "model": "flux-schnell"
                    }
                ))
                
                # Add small delay between requests
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"Social post generation error for {platform['name']}: {e}")
                # Add placeholder
                assets.append(GeneratedAsset(
                    type="social_post",
                    url=f"https://via.placeholder.com/400x400/06b6d4/ffffff?text={platform['name'].upper()}+POST",
                    filename=f"social_{platform['name']}_{strategy.company_name.lower().replace(' ', '_')}.png",
                    metadata={"platform": platform["name"], "error": str(e)}
                ))
        
        return assets
    
    async def generate_promotional_video(self, strategy: BrandStrategy, logo_url: Optional[str] = None) -> GeneratedAsset:
        """Generate promotional video using video models"""
        try:
            prompt = self._create_video_prompt(strategy)
            
            # Use Kling or MiniMax for video generation
            result = await fal.subscribe_async(
                "fal-ai/bytedance/seedance/v1/pro/text-to-video",
                arguments={
                    "prompt": prompt,
                    "duration": "5",
                    "aspect_ratio": "16:9"
                }
            )
            
            video_url = result["video"]["url"]
            
            return GeneratedAsset(
                type="video",
                url=video_url,
                filename=f"promo_{strategy.company_name.lower().replace(' ', '_')}.mp4",
                metadata={
                    "prompt": prompt,
                    "model": "bytedance-seedance-v1",
                    "duration": "5"
                }
            )
            
        except Exception as e:
            print(f"Video generation error: {e}")
            # Return placeholder video URL
            return GeneratedAsset(
                type="video",
                url="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                filename=f"promo_{strategy.company_name.lower().replace(' ', '_')}.mp4",
                metadata={"error": str(e)}
            )
    
    def _create_logo_prompt(self, strategy: BrandStrategy) -> str:
        """Create detailed prompt for logo generation"""
        color_desc = f"primary color {strategy.color_scheme.get('primary', '#6366f1')}"
        if 'secondary' in strategy.color_scheme:
            color_desc += f" and secondary color {strategy.color_scheme['secondary']}"
        
        # Get industry-specific clichés to avoid
        industry_cliches = self._get_industry_cliches(strategy.industry)
        
        return f"""Create a professional logo for {strategy.company_name}, a {strategy.industry} company.
        
        Logo requirements:
        - Symbol/icon that represents: {strategy.unique_value_proposition}
        - Style: {strategy.logo_style} matching {strategy.brand_archetype} archetype
        - Must work at 16x16px favicon size
        - Include both logomark and logotype versions
        - Colors: {color_desc} (ensure WCAG AA contrast)
        - Brand personality: {', '.join(strategy.brand_personality)}
        - Visual elements to include: {', '.join(strategy.visual_elements)}
        
        Context: {strategy.positioning_statement}
        Target audience: {strategy.target_audience}
        
        CRITICAL: Avoid these industry clichés: {industry_cliches}
        
        Create a unique, memorable logo that stands out in the {strategy.industry} space.
        White background, vector-style, clean lines, scalable design."""
    
    def _create_mockup_prompt(self, strategy: BrandStrategy) -> str:
        """Create prompt for website mockup"""
        # Generate CTA text based on value proposition
        cta_text = self._generate_cta_text(strategy)
        
        return f"""Create a landing page mockup for {strategy.company_name}.
        
        Above the fold must include:
        - Headline: {strategy.tagline}
        - Subheadline explaining: {strategy.positioning_statement}
        - Hero section showing the product in use by {strategy.target_audience}
        - CTA button: "{cta_text}"
        - 3 key benefits addressing: {', '.join(strategy.customer_pain_points[:3])}
        
        Visual style: {', '.join(strategy.brand_personality)} feeling, {strategy.logo_style} design
        Color scheme: Primary {strategy.color_scheme.get('primary', '#6366f1')}, Secondary {strategy.color_scheme.get('secondary', '#8b5cf6')}
        Layout: Modern {strategy.industry} standards, mobile-first responsive design
        
        Include sections for:
        - Features with icons
        - Social proof/testimonials
        - Clear value proposition
        - Trust badges
        
        High-quality, realistic mockup, professional UI/UX design."""
    
    def _create_social_post_prompt(self, strategy: BrandStrategy, platform_style: str, copy: str = None) -> str:
        """Create prompt for social media posts"""
        if copy:
            return f"""Create a {platform_style} for {strategy.company_name}.
            
            Post copy to include: "{copy}"
            
            Visual requirements:
            - Include the exact text overlaid appropriately
            - Show {strategy.target_audience} benefiting from the solution
            - Brand personality: {', '.join(strategy.brand_personality)}
            - Color scheme: {strategy.color_scheme.get('primary', '#6366f1')} as primary
            - Platform best practices for text placement and readability
            - Include subtle brand elements: {', '.join(strategy.visual_elements[:3])}
            
            Professional, engaging design that complements the copy message."""
        else:
            return f"""{platform_style} for {strategy.company_name}. 
            Tagline: {strategy.tagline}. Industry: {strategy.industry}.
            Brand personality: {', '.join(strategy.brand_personality)}.
            Color scheme: {strategy.color_scheme.get('primary', '#6366f1')}.
            Professional, engaging, modern design."""
    
    async def generate_social_posts_with_copy(self, strategy: BrandStrategy, posts_with_copy: List[Dict]) -> List[GeneratedAsset]:
        """Generate social media posts with provided copy"""
        assets = []
        
        for post_data in posts_with_copy:
            platform = post_data["platform"]
            copy = post_data["copy"]
            
            try:
                prompt = self._create_social_post_prompt(
                    strategy, 
                    f"{platform['name'].capitalize()} {platform['post_type']}", 
                    copy
                )
                
                # Determine image size based on platform
                size_map = {
                    "instagram": "square_hd",
                    "linkedin": "landscape_4_3", 
                    "twitter": "landscape_16_9"
                }
                
                result = await fal.subscribe_async(
                    "fal-ai/flux/schnell",
                    arguments={
                        "prompt": prompt,
                        "image_size": size_map.get(platform["name"], "square_hd"),
                        "num_inference_steps": 4,
                        "enable_safety_checker": True
                    }
                )
                
                image_url = result["images"][0]["url"]
                
                assets.append(GeneratedAsset(
                    type="social_post",
                    url=image_url,
                    filename=f"social_{platform['name']}_{strategy.company_name.lower().replace(' ', '_')}.png",
                    metadata={
                        "prompt": prompt,
                        "platform": platform["name"],
                        "copy": copy,
                        "model": "flux-schnell"
                    }
                ))
                
                # Small delay between requests
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"Social post generation error for {platform['name']}: {e}")
                # Add placeholder with copy
                assets.append(GeneratedAsset(
                    type="social_post",
                    url=f"https://via.placeholder.com/400x400/06b6d4/ffffff?text={platform['name'].upper()}+POST",
                    filename=f"social_{platform['name']}_{strategy.company_name.lower().replace(' ', '_')}.png",
                    metadata={
                        "platform": platform["name"],
                        "copy": copy,
                        "error": str(e)
                    }
                ))
        
        return assets
    
    def _create_video_prompt(self, strategy: BrandStrategy) -> str:
        """Create prompt for promotional video"""
        # Generate a simple video script
        script = self._generate_video_script(strategy)
        
        return f"""Create a 5-second promotional video for {strategy.company_name}.
        
        Video narrative structure:
        Scene 1 (0-1s): Show the problem - {script['problem_visualization']}
        Scene 2 (1-3s): Introduce solution - {script['solution_reveal']}
        Scene 3 (3-4s): Show transformation - {script['benefit_demonstration']}
        Scene 4 (4-5s): End card with logo and tagline: "{strategy.tagline}"
        
        Style: {', '.join(strategy.brand_personality)} feeling, {strategy.logo_style} aesthetic
        Colors: {strategy.color_scheme.get('primary', '#6366f1')} primary palette
        Target audience: {strategy.target_audience}
        
        Include text overlays with key messages: {', '.join(script['key_messages'])}
        
        High-quality animation, professional production value, engaging and memorable."""
    
    def _get_industry_cliches(self, industry: str) -> str:
        """Get industry-specific clichés to avoid"""
        cliches = {
            "Technology": "lightbulbs, gears, circuit boards, generic globe icons",
            "Healthcare": "cross symbols, stethoscopes, heartbeat lines, pills",
            "Finance": "dollar signs, piggy banks, ascending graphs, handshakes",
            "Education": "graduation caps, books, apples, pencils",
            "E-commerce": "shopping carts, bags, generic storefronts",
            "Fitness": "dumbbells, running figures, flexing arms",
            "Food": "chef hats, forks and knives, generic plates"
        }
        return cliches.get(industry, "generic symbols, overused icons")
    
    def _generate_cta_text(self, strategy: BrandStrategy) -> str:
        """Generate appropriate CTA text based on brand strategy"""
        if "free" in strategy.unique_value_proposition.lower():
            return "Start Free Trial"
        elif "demo" in strategy.unique_value_proposition.lower():
            return "Book a Demo"
        elif "marketplace" in strategy.industry.lower():
            return "Join Now"
        elif "service" in strategy.industry.lower():
            return "Get Started"
        else:
            return "Try It Now"
    
    def _generate_video_script(self, strategy: BrandStrategy) -> dict:
        """Generate a simple video script structure"""
        return {
            "problem_visualization": f"Frustrated person dealing with {strategy.customer_pain_points[0] if strategy.customer_pain_points else 'current solutions'}",
            "solution_reveal": f"{strategy.company_name} interface/product appearing with smooth transition",
            "benefit_demonstration": f"Happy user experiencing {strategy.unique_value_proposition}",
            "key_messages": [
                strategy.tagline,
                f"For {strategy.target_audience.split(',')[0]}",
                "Available now"
            ]
        }
    
    async def generate_promotional_video_with_script(self, strategy: BrandStrategy, script: Dict, logo_url: Optional[str] = None) -> GeneratedAsset:
        """Generate promotional video using a detailed script"""
        try:
            prompt = f"""Create a 5-second promotional video for {strategy.company_name}.
            
            Video script:
            - Hook (0-1s): {script['hook']}
            - Problem (1-2s): {script['problem_visualization']}
            - Solution (2-3s): {script['solution_reveal']}
            - Benefit (3-4s): {script['benefit_demonstration']}
            - CTA (4-5s): {script['cta']}
            
            Text overlays: {', '.join(script['key_messages'])}
            Visual style: {script['visual_directions']}
            Music: {script['music_mood']}
            
            Brand elements:
            - Colors: {strategy.color_scheme.get('primary', '#6366f1')} primary palette
            - Style: {strategy.logo_style}
            - Personality: {', '.join(strategy.brand_personality)}
            
            Create a compelling, professional promotional video that tells this story clearly."""
            
            # Use video generation model
            result = await fal.subscribe_async(
                "fal-ai/bytedance/seedance/v1/pro/text-to-video",
                arguments={
                    "prompt": prompt,
                    "duration": "5",
                    "aspect_ratio": "16:9"
                }
            )
            
            video_url = result["video"]["url"]
            
            return GeneratedAsset(
                type="video",
                url=video_url,
                filename=f"promo_{strategy.company_name.lower().replace(' ', '_')}.mp4",
                metadata={
                    "prompt": prompt,
                    "script": script,
                    "model": "bytedance-seedance-v1",
                    "duration": "5"
                }
            )
            
        except Exception as e:
            print(f"Video generation error: {e}")
            # Return placeholder video URL
            return GeneratedAsset(
                type="video",
                url="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                filename=f"promo_{strategy.company_name.lower().replace(' ', '_')}.mp4",
                metadata={
                    "script": script,
                    "error": str(e)
                }
            )