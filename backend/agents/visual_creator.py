import asyncio
from typing import List
from models import BrandStrategy, GeneratedAsset
from services.fal_service import FALService

class VisualCreator:
    def __init__(self):
        self.fal_service = FALService()
    
    async def generate_logo(self, strategy: BrandStrategy) -> GeneratedAsset:
        """Generate company logo"""
        return await self.fal_service.generate_logo(strategy)
    
    async def generate_mockup(self, strategy: BrandStrategy) -> GeneratedAsset:
        """Generate website mockup"""
        return await self.fal_service.generate_website_mockup(strategy)
    
    async def generate_all_visuals(self, strategy: BrandStrategy) -> List[GeneratedAsset]:
        """Generate all visual assets in parallel"""
        logo_task = self.generate_logo(strategy)
        mockup_task = self.generate_mockup(strategy)
        
        # Run in parallel for faster generation
        logo, mockup = await asyncio.gather(logo_task, mockup_task)
        
        return [logo, mockup]