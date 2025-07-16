#!/usr/bin/env python3
"""
Test script to compare original and enhanced recommenders
"""

import sys
import os
import time
from typing import List

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_types import Project, Role, Member, Work
from recommender import TeamRecommender
from enhanced_recommender import EnhancedTeamRecommender

def create_test_candidates() -> List[Member]:
    """Create comprehensive test candidates"""
    candidates = []
    
    # Frontend Developer 1
    work_exp1 = [
        Work(
            startDate="2022-01-01",
            endDate="2023-12-31",
            position="Frontend Developer",
            company="Tech Corp",
            description="Developed React applications with TypeScript"
        )
    ]
    
    candidate1 = Member(
        id=1,
        bio="Experienced frontend developer with React expertise",
        position="Frontend Developer",
        education="Bachelor in Computer Science",
        expertise="React, TypeScript, CSS, Modern Web Development",
        resume="Frontend developer with 3 years experience in React ecosystem",
        technologies=["React", "TypeScript", "CSS", "HTML", "JavaScript", "Redux"],
        expertise_level="Mid",
        experience_years="3 years",
        work_experience=work_exp1
    )
    candidates.append(candidate1)
    
    # Backend Developer 1
    work_exp2 = [
        Work(
            startDate="2020-01-01",
            endDate="2023-12-31",
            position="Backend Developer",
            company="Software Inc",
            description="Developed scalable Java applications with Spring Boot"
        )
    ]
    
    candidate2 = Member(
        id=2,
        bio="Senior backend developer with Java expertise",
        position="Backend Developer",
        education="Master in Software Engineering",
        expertise="Java, Spring Boot, Microservices Architecture",
        resume="Backend developer with 5 years experience in enterprise applications",
        technologies=["Java", "Spring Boot", "PostgreSQL", "Maven", "Docker", "Kubernetes"],
        expertise_level="Senior",
        experience_years="5 years",
        work_experience=work_exp2
    )
    candidates.append(candidate2)
    
    # DevOps Engineer 1
    work_exp3 = [
        Work(
            startDate="2021-01-01",
            endDate="2023-12-31",
            position="DevOps Engineer",
            company="Cloud Solutions",
            description="Managed cloud infrastructure and CI/CD pipelines"
        )
    ]
    
    candidate3 = Member(
        id=3,
        bio="DevOps engineer with cloud expertise",
        position="DevOps Engineer",
        education="Bachelor in IT",
        expertise="Cloud Infrastructure, CI/CD, Automation",
        resume="DevOps engineer with 2 years experience in cloud platforms",
        technologies=["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins", "GitLab"],
        expertise_level="Mid",
        experience_years="2 years",
        work_experience=work_exp3
    )
    candidates.append(candidate3)
    
    # Full Stack Developer
    work_exp4 = [
        Work(
            startDate="2019-01-01",
            endDate="2023-12-31",
            position="Full Stack Developer",
            company="Startup XYZ",
            description="Led development of full-stack applications"
        )
    ]
    
    candidate4 = Member(
        id=4,
        bio="Full stack developer with broad technology expertise",
        position="Full Stack Developer",
        education="Bachelor in Computer Science",
        expertise="Full Stack Development, System Architecture",
        resume="Full stack developer with 4 years experience across multiple technologies",
        technologies=["React", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
        expertise_level="Senior",
        experience_years="4 years",
        work_experience=work_exp4
    )
    candidates.append(candidate4)
    
    # Data Scientist
    work_exp5 = [
        Work(
            startDate="2021-06-01",
            endDate="2023-12-31",
            position="Data Scientist",
            company="AI Solutions",
            description="Developed machine learning models and data pipelines"
        )
    ]
    
    candidate5 = Member(
        id=5,
        bio="Data scientist with ML and AI expertise",
        position="Data Scientist",
        education="Master in Data Science",
        expertise="Machine Learning, Data Analysis, AI",
        resume="Data scientist with 2.5 years experience in ML projects",
        technologies=["Python", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn", "SQL"],
        expertise_level="Mid",
        experience_years="2.5 years",
        work_experience=work_exp5
    )
    candidates.append(candidate5)
    
    return candidates

def create_test_project() -> Project:
    """Create test project"""
    return Project(
        id=1,
        title="AI-Powered Web Application",
        description="A full-stack web application with AI features",
        createdAt="2024-01-01",
        updatedAt="2024-01-01",
        projectType="Web Development",
        teamSize=4
    )

def create_test_roles() -> List[Role]:
    """Create test roles"""
    return [
        Role(
            id=1,
            roleName="Frontend Developer",
            expertiseLevel="Mid",
            technologies=["React", "TypeScript", "CSS", "Redux"]
        ),
        Role(
            id=2,
            roleName="Backend Developer",
            expertiseLevel="Senior",
            technologies=["Java", "Spring Boot", "PostgreSQL", "Docker"]
        ),
        Role(
            id=3,
            roleName="DevOps Engineer",
            expertiseLevel="Mid",
            technologies=["Docker", "Kubernetes", "AWS", "Terraform"]
        ),
        Role(
            id=4,
            roleName="Data Scientist",
            expertiseLevel="Mid",
            technologies=["Python", "TensorFlow", "Pandas", "SQL"]
        )
    ]

def compare_recommenders():
    """Compare original and enhanced recommenders"""
    print("🧪 Testing Recommender Comparison")
    print("=" * 50)
    
    # Create test data
    candidates = create_test_candidates()
    project = create_test_project()
    roles = create_test_roles()
    
    print(f"Created {len(candidates)} test candidates")
    print(f"Project: {project.title}")
    print(f"Roles: {[role.roleName for role in roles]}")
    print()
    
    # Test Original Recommender
    print("📊 Testing Original Recommender...")
    start_time = time.time()
    
    original_recommender = TeamRecommender(candidates)
    original_result = original_recommender.recommend_team_with_synergy(
        project=project,
        roles=roles,
        n_candidates=5
    )
    
    original_time = time.time() - start_time
    
    print(f"✅ Original recommender completed in {original_time:.3f}s")
    print(f"   Team score: {original_result['team_score']:.3f}")
    print(f"   Synergy score: {original_result['synergy_metrics']['avg_synergy']:.3f}")
    print(f"   Combined score: {original_result['updated_team_score']:.3f}")
    print()
    
    # Test Enhanced Recommender
    print("🚀 Testing Enhanced Recommender...")
    start_time = time.time()
    
    enhanced_recommender = EnhancedTeamRecommender(candidates, use_ml_model=True)
    enhanced_result = enhanced_recommender.recommend_team_with_synergy(
        project=project,
        roles=roles,
        n_candidates=5
    )
    
    enhanced_time = time.time() - start_time
    
    print(f"✅ Enhanced recommender completed in {enhanced_time:.3f}s")
    print(f"   Team score: {enhanced_result['team_score']:.3f}")
    print(f"   Synergy score: {enhanced_result['synergy_metrics']['avg_synergy']:.3f}")
    print(f"   Combined score: {enhanced_result['updated_team_score']:.3f}")
    print()
    
    # Performance Comparison
    print("📈 Performance Comparison")
    print("-" * 30)
    
    score_improvement = enhanced_result['updated_team_score'] - original_result['updated_team_score']
    time_difference = enhanced_time - original_time
    
    print(f"Score Improvement: {score_improvement:+.3f}")
    print(f"Time Difference: {time_difference:+.3f}s")
    print(f"Speed Ratio: {original_time/enhanced_time:.2f}x")
    
    # Detailed Analysis
    print("\n🔍 Detailed Analysis")
    print("-" * 30)
    
    print("Original Team Members:")
    for i, member_data in enumerate(original_result['team'], 1):
        member = member_data['member']
        print(f"  {i}. {member.position}: {member.technologies[:3]}... (match: {member_data['role_match_score']:.3f})")
    
    print("\nEnhanced Team Members:")
    for i, member_data in enumerate(enhanced_result['team'], 1):
        member = member_data['member']
        print(f"  {i}. {member.position}: {member.technologies[:3]}... (match: {member_data['role_match_score']:.3f})")
    
    # Feature Analysis
    print("\n🎯 Feature Analysis")
    print("-" * 30)
    
    if hasattr(enhanced_recommender, 'candidate_features'):
        print("Enhanced Features Extracted:")
        for i, features in enumerate(enhanced_recommender.candidate_features[:3]):
            print(f"  Candidate {i+1}:")
            for key, value in features.items():
                print(f"    {key}: {value}")
    
    return {
        'original': original_result,
        'enhanced': enhanced_result,
        'performance': {
            'score_improvement': score_improvement,
            'time_difference': time_difference,
            'speed_ratio': original_time/enhanced_time
        }
    }

def test_ml_model_training():
    """Test ML model training capabilities"""
    print("\n🤖 Testing ML Model Training")
    print("=" * 40)
    
    candidates = create_test_candidates()
    enhanced_recommender = EnhancedTeamRecommender(candidates, use_ml_model=True)
    
    # Create mock training data
    training_data = [
        {
            'team': [
                {'member': candidates[0], 'role_match_score': 0.8},
                {'member': candidates[1], 'role_match_score': 0.9},
                {'member': candidates[2], 'role_match_score': 0.7}
            ],
            'performance_score': 0.85
        },
        {
            'team': [
                {'member': candidates[3], 'role_match_score': 0.9},
                {'member': candidates[4], 'role_match_score': 0.8}
            ],
            'performance_score': 0.75
        }
    ]
    
    try:
        enhanced_recommender.add_training_data(training_data)
        print("✅ ML model training completed successfully")
    except Exception as e:
        print(f"❌ ML model training failed: {str(e)}")

if __name__ == "__main__":
    print("🚀 Enhanced ML Model Testing")
    print("=" * 50)
    
    try:
        # Compare recommenders
        results = compare_recommenders()
        
        # Test ML training
        test_ml_model_training()
        
        print("\n🎉 All tests completed successfully!")
        print(f"📊 Enhanced model shows {results['performance']['score_improvement']:+.3f} score improvement")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1) 