#!/usr/bin/env python3
"""
Simple test script for the cleaned up ML model.
"""

import asyncio
import httpx
import json

async def test_clean_model():
    """Test the cleaned up ML model."""
    
    print("🧪 Testing cleaned up ML model...")
    
    # Test data
    test_candidates = [
        {
            "id": 1,
            "bio": "Experienced frontend developer",
            "position": "Frontend Developer",
            "education": "Computer Science",
            "expertise": "React, TypeScript",
            "resume": "Frontend developer with 3 years experience",
            "technologies": ["React", "TypeScript", "CSS", "JavaScript"],
            "expertise_level": "Mid",
            "experience_years": "3 years",
            "work_experience": [
                {
                    "startDate": "2021-01-01",
                    "endDate": "2023-12-31",
                    "position": "Frontend Developer",
                    "company": "Tech Corp",
                    "description": "Developed React applications"
                }
            ]
        },
        {
            "id": 2,
            "bio": "Senior backend developer",
            "position": "Backend Developer",
            "education": "Software Engineering",
            "expertise": "Java, Spring Boot",
            "resume": "Backend developer with 5 years experience",
            "technologies": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
            "expertise_level": "Senior",
            "experience_years": "5 years",
            "work_experience": [
                {
                    "startDate": "2019-01-01",
                    "endDate": "2023-12-31",
                    "position": "Backend Developer",
                    "company": "Enterprise Inc",
                    "description": "Built scalable backend services"
                }
            ]
        },
        {
            "id": 3,
            "bio": "DevOps engineer",
            "position": "DevOps Engineer",
            "education": "Information Technology",
            "expertise": "Cloud infrastructure",
            "resume": "DevOps engineer with 4 years experience",
            "technologies": ["Docker", "Kubernetes", "AWS", "Terraform"],
            "expertise_level": "Mid",
            "experience_years": "4 years",
            "work_experience": [
                {
                    "startDate": "2020-01-01",
                    "endDate": "2023-12-31",
                    "position": "DevOps Engineer",
                    "company": "Cloud Solutions",
                    "description": "Managed cloud infrastructure"
                }
            ]
        }
    ]
    
    try:
        async with httpx.AsyncClient() as client:
            # Test 1: Load candidates
            print("📥 Loading candidates...")
            response = await client.post(
                "http://localhost:8000/load-candidates",
                json=test_candidates
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Candidates loaded: {result['candidates_loaded']}")
            else:
                print(f"❌ Failed to load candidates: {response.status_code}")
                return
            
            # Test 2: Get team recommendation
            print("🎯 Getting team recommendation...")
            response = await client.post(
                "http://localhost:8000/recommend-team",
                json={"project_id": 1}
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Team recommendation successful!")
                print(f"   Project ID: {result['project_id']}")
                print(f"   Team Score: {result['team_score']}")
                print(f"   Synergy Score: {result['synergy_score']}")
                print(f"   Combined Score: {result['combined_score']}")
                print(f"   Members: {len(result['members'])}")
                
                print("\n📋 Team Members:")
                for i, member in enumerate(result['members'], 1):
                    print(f"   {i}. {member['position']} (ID: {member['id']})")
                    print(f"      Technologies: {', '.join(member['technologies'][:3])}...")
                    print(f"      Role Match: {member.get('role_match_score', 0):.2f}")
                
                print(f"\n📊 Synergy Metrics:")
                metrics = result['synergy_metrics']
                print(f"   Average Synergy: {metrics['avg_synergy']}")
                print(f"   Shared Skills: {metrics['shared_skills']}")
                print(f"   Experience Variance: {metrics.get('experience_variance', 0)}")
                
                if result.get('recommendation_notes'):
                    print(f"\n💡 Notes:")
                    for note in result['recommendation_notes']:
                        print(f"   • {note}")
                        
            else:
                print(f"❌ Failed to get recommendation: {response.status_code}")
                print(f"Response: {response.text}")
                
    except httpx.ConnectError:
        print("❌ Could not connect to ML API. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

async def test_health():
    """Test health check endpoint."""
    
    print("\n🏥 Testing health check...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:8000/health")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Health check passed: {result}")
            else:
                print(f"❌ Health check failed: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")

async def main():
    """Main test function."""
    
    print("🚀 Testing cleaned up ML model...")
    print("=" * 50)
    
    await test_health()
    await test_clean_model()
    
    print("\n" + "=" * 50)
    print("✨ Clean model test completed!")

if __name__ == "__main__":
    asyncio.run(main()) 