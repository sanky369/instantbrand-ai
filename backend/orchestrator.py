import asyncio
import uuid
from datetime import datetime
from typing import AsyncGenerator, List
from models import (
    BrandRequest, DetailedBrandRequest, BrandPackage, BrandStrategy, GeneratedAsset,
    ProgressUpdate, AgentProgress, AgentStatus
)
from typing import Union
from agents.brand_director import BrandDirector
from agents.visual_creator import VisualCreator
from agents.social_media_agent import SocialMediaAgent
from agents.video_creator import VideoCreator

class BrandOrchestrator:
    def __init__(self):
        self.brand_director = BrandDirector()
        self.visual_creator = VisualCreator()
        self.social_agent = SocialMediaAgent()
        self.video_creator = VideoCreator()
    
    async def create_brand_package(self, request: Union[BrandRequest, DetailedBrandRequest]) -> AsyncGenerator[ProgressUpdate, None]:
        """Orchestrate the complete brand package generation with real-time updates"""
        package_id = str(uuid.uuid4())
        start_time = datetime.now()
        
        # Initialize progress tracking
        agents = [
            AgentProgress(agent_name="Brand Director", status=AgentStatus.PENDING, progress=0, message="Analyzing startup idea..."),
            AgentProgress(agent_name="Visual Creator", status=AgentStatus.PENDING, progress=0, message="Waiting for brand strategy..."),
            AgentProgress(agent_name="Social Media Agent", status=AgentStatus.PENDING, progress=0, message="Waiting for brand strategy..."),
            AgentProgress(agent_name="Video Creator", status=AgentStatus.PENDING, progress=0, message="Waiting for assets...")
        ]
        
        try:
            # Step 1: Brand Strategy Analysis (20% of total progress)
            yield ProgressUpdate(
                package_id=package_id,
                overall_progress=5,
                current_agent="Brand Director",
                agents=agents,
                message="Analyzing your startup idea and creating brand strategy..."
            )
            
            agents[0].status = AgentStatus.IN_PROGRESS
            agents[0].message = "Creating comprehensive brand strategy..."
            
            # Simulate progressive updates during brand analysis
            for progress in [25, 50, 75, 100]:
                agents[0].progress = progress
                yield ProgressUpdate(
                    package_id=package_id,
                    overall_progress=int(5 + (progress * 0.15)),  # 0-15% overall
                    current_agent="Brand Director",
                    agents=agents.copy(),
                    message=f"Analyzing brand strategy... {progress}%"
                )
                await asyncio.sleep(1)  # Simulate processing time
            
            # Generate brand strategy - pass the entire request for detailed analysis
            try:
                if isinstance(request, DetailedBrandRequest):
                    strategy = await self.brand_director.analyze_startup_idea(request)
                else:
                    strategy = await self.brand_director.analyze_startup_idea(request.startup_idea)
                agents[0].status = AgentStatus.COMPLETED
                agents[0].result = strategy.model_dump()
                agents[0].message = "Brand strategy completed"
            except Exception as e:
                import traceback
                error_details = traceback.format_exc()
                print(f"Brand Director error: {e}")
                print(f"Full traceback: {error_details}")
                agents[0].status = AgentStatus.FAILED
                agents[0].message = f"Failed: {str(e)}"
                
                # Yield error state and stop
                yield ProgressUpdate(
                    package_id=package_id,
                    overall_progress=0,
                    current_agent="Error",
                    agents=agents.copy(),
                    message=f"Brand Director failed: {str(e)}",
                    completed=True
                )
                return
            
            yield ProgressUpdate(
                package_id=package_id,
                overall_progress=20,
                current_agent="Visual Creator",
                agents=agents.copy(),
                message=" Brand strategy created! Now generating visual assets..."
            )
            
            # Step 2: Visual Assets Generation (30% of total progress)
            agents[1].status = AgentStatus.IN_PROGRESS
            agents[1].message = "Generating logo and website mockup..."
            
            # Generate visual assets with progress updates
            visual_assets = []
            
            # Logo generation
            for progress in [20, 60, 100]:
                agents[1].progress = progress
                yield ProgressUpdate(
                    package_id=package_id,
                    overall_progress=int(20 + (progress * 0.15)),  # 20-35% overall
                    current_agent="Visual Creator",
                    agents=agents.copy(),
                    message=f" Generating logo... {progress}%"
                )
                await asyncio.sleep(1.5)
            
            logo = await self.visual_creator.generate_logo(strategy)
            visual_assets.append(logo)
            
            # Mockup generation
            agents[1].message = "Generating website mockup..."
            for progress in [20, 60, 100]:
                agents[1].progress = progress
                yield ProgressUpdate(
                    package_id=package_id,
                    overall_progress=int(35 + (progress * 0.15)),  # 35-50% overall
                    current_agent="Visual Creator",
                    agents=agents.copy(),
                    message=f"Creating website mockup... {progress}%"
                )
                await asyncio.sleep(1.5)
            
            mockup = await self.visual_creator.generate_mockup(strategy)
            visual_assets.append(mockup)
            
            agents[1].status = AgentStatus.COMPLETED
            agents[1].result = {"assets_count": len(visual_assets)}
            agents[1].message = "Visual assets completed"
            
            yield ProgressUpdate(
                package_id=package_id,
                overall_progress=50,
                current_agent="Social Media Agent",
                agents=agents.copy(),
                message=" Visual assets ready! Creating social media content..."
            )
            
            # Step 3: Social Media Posts (20% of total progress)
            agents[2].status = AgentStatus.IN_PROGRESS
            agents[2].message = "Creating social media posts..."
            
            for progress in [30, 70, 100]:
                agents[2].progress = progress
                yield ProgressUpdate(
                    package_id=package_id,
                    overall_progress=int(50 + (progress * 0.20)),  # 50-70% overall
                    current_agent="Social Media Agent",
                    agents=agents.copy(),
                    message=f" Creating social media posts... {progress}%"
                )
                await asyncio.sleep(2)
            
            social_assets = await self.social_agent.create_social_posts(strategy)
            
            agents[2].status = AgentStatus.COMPLETED
            agents[2].result = {"assets_count": len(social_assets)}
            agents[2].message = "Social media posts completed"
            
            yield ProgressUpdate(
                package_id=package_id,
                overall_progress=70,
                current_agent="Video Creator",
                agents=agents.copy(),
                message=" Social content ready! Generating promotional video..."
            )
            
            # Step 4: Video Generation (30% of total progress)
            agents[3].status = AgentStatus.IN_PROGRESS
            agents[3].message = "Generating promotional video..."
            
            for progress in [25, 50, 80, 100]:
                agents[3].progress = progress
                yield ProgressUpdate(
                    package_id=package_id,
                    overall_progress=int(70 + (progress * 0.30)),  # 70-100% overall
                    current_agent="Video Creator",
                    agents=agents.copy(),
                    message=f" Creating promotional video... {progress}%"
                )
                await asyncio.sleep(2.5)
            
            video_asset = await self.video_creator.create_promotional_video(strategy, logo.url)
            
            agents[3].status = AgentStatus.COMPLETED
            agents[3].result = {"video_url": video_asset.url}
            agents[3].message = "Promotional video completed"
            
            # Compile final results
            all_assets = visual_assets + social_assets + [video_asset]
            generation_time = int((datetime.now() - start_time).total_seconds())
            
            brand_package = BrandPackage(
                id=package_id,
                strategy=strategy,
                assets=all_assets,
                created_at=start_time.isoformat(),
                status="completed",
                generation_time_seconds=generation_time
            )
            
            # Final success update
            yield ProgressUpdate(
                package_id=package_id,
                overall_progress=100,
                current_agent="Completed",
                agents=agents.copy(),
                message=" Your complete brand package is ready!",
                completed=True,
                result=brand_package
            )
            
        except Exception as e:
            # Handle errors gracefully
            error_message = f" Generation failed: {str(e)}"
            
            # Mark current agent as failed
            for agent in agents:
                if agent.status == AgentStatus.IN_PROGRESS:
                    agent.status = AgentStatus.FAILED
                    agent.message = "Failed due to error"
                    break
            
            yield ProgressUpdate(
                package_id=package_id,
                overall_progress=0,
                current_agent="Error",
                agents=agents,
                message=error_message,
                completed=True
            )