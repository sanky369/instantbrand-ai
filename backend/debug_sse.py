#!/usr/bin/env python3
"""Debug script to test SSE endpoint directly"""

import requests
import json

def test_sse_endpoint():
    data = {'startup_idea': 'AI-powered fitness app that creates personalized workout plans'}
    
    try:
        print("Making request to backend...")
        response = requests.post('http://localhost:8000/api/generate-brand', 
                               json=data, 
                               stream=True,
                               timeout=30)
        
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            print(f"Error response: {response.text}")
            return
        
        print("\nStreaming response:")
        print("=" * 50)
        
        line_count = 0
        for line in response.iter_lines(decode_unicode=True):
            line_count += 1
            
            if line.startswith('data: '):
                try:
                    data_content = json.loads(line[6:])  # Remove 'data: ' prefix
                    agents = data_content.get('agents', [])
                    brand_director = next((a for a in agents if a['agent_name'] == 'Brand Director'), None)
                    
                    print(f"Line {line_count}: Progress {data_content.get('overall_progress', 0)}%")
                    print(f"  Current agent: {data_content.get('current_agent', 'Unknown')}")
                    if brand_director:
                        print(f"  Brand Director: {brand_director.get('status', 'unknown')} - {brand_director.get('message', 'no message')}")
                    print()
                    
                    # Stop after Brand Director fails or completes
                    if brand_director and brand_director.get('status') in ['failed', 'completed']:
                        print(f"Brand Director {brand_director.get('status')}. Stopping debug.")
                        if brand_director.get('status') == 'failed':
                            print(f"Failure message: {brand_director.get('message', 'No error message')}")
                        break
                        
                except json.JSONDecodeError as e:
                    print(f"Line {line_count}: JSON Error - {e}")
                    print(f"  Raw data length: {len(line[6:])}")
                    
            elif line.strip():  # Non-empty, non-data line
                print(f"Line {line_count}: Non-data line: {line[:50]}...")
                    
            if line_count > 25:  # Safety limit
                print("Reached line limit, stopping...")
                break
                
    except Exception as e:
        print(f"Request failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_sse_endpoint()