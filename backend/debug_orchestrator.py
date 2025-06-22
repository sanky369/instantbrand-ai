#!/usr/bin/env python3
"""Debug script to test orchestrator directly"""

import asyncio
import sys
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()

# Import components
from models import BrandRequest
from orchestrator import BrandOrchestrator

async def test_orchestrator():
    print("Testing orchestrator directly...")
    
    try:
        orch = BrandOrchestrator()
        request = BrandRequest(startup_idea="AI-powered fitness app that creates personalized workout plans")
        
        print("Starting brand package generation...")
        async for update in orch.create_brand_package(request):
            print(f"Progress: {update.overall_progress}% - {update.message}")
            
            # Check agents
            for agent in update.agents:
                if agent.agent_name == "Brand Director":
                    print(f"  Brand Director: {agent.status} - {agent.message}")
                    if agent.status == "failed":
                        print("Brand Director failed! Stopping.")
                        return
            
            if update.completed:
                print("Generation completed!")
                break
                
    except Exception as e:
        print(f"Orchestrator test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_orchestrator())