import numpy as np
import random
from typing import List, Dict, Tuple, Optional
from collections import defaultdict
from data_types import Project, Role, Member
from enhanced_recommender import EnhancedTeamRecommender

class TeamOptimizer:
    def __init__(self, candidates: List[Member], project: Project, roles: List[Role]):
        self.candidates = candidates
        self.project = project
        self.roles = roles
        self.recommender = EnhancedTeamRecommender(candidates, use_ml_model=True)
        
        # Genetic algorithm parameters
        self.population_size = 50
        self.generations = 100
        self.mutation_rate = 0.1
        self.crossover_rate = 0.8
        self.elite_size = 5
        
        # Team constraints
        self.required_roles = self._parse_required_roles()
        self.team_size = sum(self.required_roles.values())
        
    def _parse_required_roles(self) -> Dict[str, int]:
        """Parse required roles and their counts"""
        role_counts = defaultdict(int)
        for role in self.roles:
            role_counts[role.roleName] += 1
        return dict(role_counts)
    
    def _create_individual(self) -> List[int]:
        """Create a random team composition"""
        team = []
        role_candidates = self._get_role_candidates()
        
        for role_name, count in self.required_roles.items():
            candidates_for_role = role_candidates.get(role_name, [])
            if len(candidates_for_role) >= count:
                selected = random.sample(candidates_for_role, count)
                team.extend(selected)
            else:
                # If not enough candidates for role, fill with random candidates
                remaining_candidates = [i for i in range(len(self.candidates)) 
                                     if i not in team]
                if remaining_candidates:
                    selected = random.sample(remaining_candidates, 
                                          min(count, len(remaining_candidates)))
                    team.extend(selected)
        
        return team
    
    def _get_role_candidates(self) -> Dict[str, List[int]]:
        """Get candidates for each role"""
        role_candidates = defaultdict(list)
        
        for idx, candidate in enumerate(self.candidates):
            # Exact role match
            if candidate.position in self.required_roles:
                role_candidates[candidate.position].append(idx)
            
            # Skill-based matching
            for role in self.roles:
                if role.roleName not in role_candidates:
                    role_candidates[role.roleName] = []
                
                # Check if candidate has skills for this role
                candidate_skills = set(skill.lower() for skill in candidate.technologies)
                role_skills = set(skill.lower() for skill in role.technologies)
                
                if candidate_skills & role_skills:  # If there's skill overlap
                    role_candidates[role.roleName].append(idx)
        
        return role_candidates
    
    def _fitness_function(self, individual: List[int]) -> float:
        """Calculate fitness score for a team composition"""
        if len(individual) != self.team_size:
            return 0.0
        
        # Create team data structure
        team_members = [self.candidates[i] for i in individual]
        
        # Calculate various scores
        skill_score = self._calculate_skill_score(team_members)
        diversity_score = self._calculate_diversity_score(team_members)
        experience_score = self._calculate_experience_score(team_members)
        synergy_score = self._calculate_synergy_score(team_members)
        
        # Weighted combination
        fitness = (0.3 * skill_score + 
                  0.2 * diversity_score + 
                  0.2 * experience_score + 
                  0.3 * synergy_score)
        
        return fitness
    
    def _calculate_skill_score(self, team_members: List[Member]) -> float:
        """Calculate skill coverage score"""
        all_required_skills = set()
        for role in self.roles:
            all_required_skills.update(role.technologies)
        
        covered_skills = set()
        for member in team_members:
            covered_skills.update(member.technologies)
        
        return len(all_required_skills & covered_skills) / len(all_required_skills) if all_required_skills else 0.0
    
    def _calculate_diversity_score(self, team_members: List[Member]) -> float:
        """Calculate team diversity score"""
        if not team_members:
            return 0.0
        
        # Company diversity
        companies = set()
        for member in team_members:
            if member.work_experience:
                companies.add(member.work_experience[0].company)
        company_diversity = len(companies) / len(team_members)
        
        # Experience level diversity
        exp_levels = set()
        for member in team_members:
            try:
                exp_years = float(member.experience_years.split()[0])
                if exp_years < 3:
                    exp_levels.add('Junior')
                elif exp_years < 7:
                    exp_levels.add('Mid')
                else:
                    exp_levels.add('Senior')
            except:
                exp_levels.add('Unknown')
        
        exp_diversity = len(exp_levels) / 3
        
        # Education diversity
        education_levels = set()
        for member in team_members:
            if 'master' in member.education.lower():
                education_levels.add('Master')
            elif 'phd' in member.education.lower():
                education_levels.add('PhD')
            else:
                education_levels.add('Bachelor')
        
        edu_diversity = len(education_levels) / 3
        
        return 0.4 * company_diversity + 0.3 * exp_diversity + 0.3 * edu_diversity
    
    def _calculate_experience_score(self, team_members: List[Member]) -> float:
        """Calculate experience balance score"""
        if not team_members:
            return 0.0
        
        exp_years = []
        for member in team_members:
            try:
                years = float(member.experience_years.split()[0])
                exp_years.append(years)
            except:
                exp_years.append(0)
        
        avg_experience = np.mean(exp_years)
        exp_variance = np.std(exp_years)
        
        # Prefer teams with good average experience and moderate variance
        experience_score = min(avg_experience / 10, 1.0)  # Normalize to 0-1
        variance_penalty = max(0, 1 - exp_variance / 5)  # Penalize high variance
        
        return 0.7 * experience_score + 0.3 * variance_penalty
    
    def _calculate_synergy_score(self, team_members: List[Member]) -> float:
        """Calculate team synergy score"""
        if len(team_members) < 2:
            return 0.0
        
        synergy_scores = []
        
        for i in range(len(team_members)):
            for j in range(i + 1, len(team_members)):
                member1, member2 = team_members[i], team_members[j]
                
                # Skill overlap
                skills1 = set(member1.technologies)
                skills2 = set(member2.technologies)
                skill_overlap = len(skills1 & skills2) / len(skills1 | skills2) if (skills1 | skills2) else 0
                
                # Experience compatibility
                try:
                    exp1 = float(member1.experience_years.split()[0])
                    exp2 = float(member2.experience_years.split()[0])
                    exp_compatibility = np.exp(-0.1 * abs(exp1 - exp2))
                except:
                    exp_compatibility = 0.5
                
                # Combined synergy
                synergy = 0.6 * skill_overlap + 0.4 * exp_compatibility
                synergy_scores.append(synergy)
        
        return np.mean(synergy_scores) if synergy_scores else 0.0
    
    def _crossover(self, parent1: List[int], parent2: List[int]) -> Tuple[List[int], List[int]]:
        """Perform crossover between two parents"""
        if random.random() > self.crossover_rate:
            return parent1, parent2
        
        # Single-point crossover
        point = random.randint(1, len(parent1) - 1)
        
        child1 = parent1[:point] + parent2[point:]
        child2 = parent2[:point] + parent1[point:]
        
        # Ensure unique team members
        child1 = list(dict.fromkeys(child1))  # Remove duplicates while preserving order
        child2 = list(dict.fromkeys(child2))
        
        # Fill up to team size if needed
        while len(child1) < self.team_size:
            remaining = [i for i in range(len(self.candidates)) if i not in child1]
            if remaining:
                child1.append(random.choice(remaining))
            else:
                break
        
        while len(child2) < self.team_size:
            remaining = [i for i in range(len(self.candidates)) if i not in child2]
            if remaining:
                child2.append(random.choice(remaining))
            else:
                break
        
        return child1[:self.team_size], child2[:self.team_size]
    
    def _mutate(self, individual: List[int]) -> List[int]:
        """Mutate an individual"""
        if random.random() > self.mutation_rate:
            return individual
        
        mutated = individual.copy()
        
        # Random mutation: replace a random team member
        if len(mutated) > 0:
            mutation_point = random.randint(0, len(mutated) - 1)
            new_member = random.randint(0, len(self.candidates) - 1)
            mutated[mutation_point] = new_member
        
        return mutated
    
    def optimize_team(self) -> Dict:
        """Run genetic algorithm to find optimal team"""
        print(f"🧬 Starting genetic algorithm optimization...")
        print(f"   Population size: {self.population_size}")
        print(f"   Generations: {self.generations}")
        print(f"   Team size: {self.team_size}")
        print()
        
        # Initialize population
        population = [self._create_individual() for _ in range(self.population_size)]
        
        best_fitness_history = []
        avg_fitness_history = []
        
        for generation in range(self.generations):
            # Calculate fitness for all individuals
            fitness_scores = [(individual, self._fitness_function(individual)) 
                             for individual in population]
            fitness_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Track best and average fitness
            best_fitness = fitness_scores[0][1]
            avg_fitness = np.mean([score for _, score in fitness_scores])
            best_fitness_history.append(best_fitness)
            avg_fitness_history.append(avg_fitness)
            
            if generation % 20 == 0:
                print(f"Generation {generation:3d}: Best={best_fitness:.3f}, Avg={avg_fitness:.3f}")
            
            # Create new population
            new_population = []
            
            # Elitism: keep best individuals
            for i in range(self.elite_size):
                new_population.append(fitness_scores[i][0])
            
            # Generate rest of population through crossover and mutation
            while len(new_population) < self.population_size:
                # Select parents (tournament selection)
                parent1 = self._tournament_selection(fitness_scores)
                parent2 = self._tournament_selection(fitness_scores)
                
                # Crossover
                child1, child2 = self._crossover(parent1, parent2)
                
                # Mutate
                child1 = self._mutate(child1)
                child2 = self._mutate(child2)
                
                new_population.extend([child1, child2])
            
            population = new_population[:self.population_size]
        
        # Get best team
        best_individual = fitness_scores[0][0]
        best_team_members = [self.candidates[i] for i in best_individual]
        
        print(f"\n🎯 Optimization completed!")
        print(f"   Best fitness: {best_fitness:.3f}")
        print(f"   Final average fitness: {avg_fitness:.3f}")
        
        return {
            'team_members': best_team_members,
            'fitness_score': best_fitness,
            'individual': best_individual,
            'fitness_history': {
                'best': best_fitness_history,
                'average': avg_fitness_history
            }
        }
    
    def _tournament_selection(self, fitness_scores: List[Tuple[List[int], float]], 
                            tournament_size: int = 3) -> List[int]:
        """Tournament selection for parent selection"""
        tournament = random.sample(fitness_scores, tournament_size)
        return max(tournament, key=lambda x: x[1])[0]
    
    def get_team_analysis(self, team_members: List[Member]) -> Dict:
        """Analyze the optimized team"""
        analysis = {
            'team_size': len(team_members),
            'skill_coverage': self._calculate_skill_score(team_members),
            'diversity_score': self._calculate_diversity_score(team_members),
            'experience_score': self._calculate_experience_score(team_members),
            'synergy_score': self._calculate_synergy_score(team_members),
            'member_details': []
        }
        
        for i, member in enumerate(team_members):
            member_analysis = {
                'id': member.id,
                'position': member.position,
                'technologies': member.technologies,
                'experience_years': member.experience_years,
                'expertise_level': member.expertise_level,
                'education': member.education
            }
            analysis['member_details'].append(member_analysis)
        
        return analysis

def test_team_optimizer():
    """Test the team optimizer"""
    from test_enhanced import create_test_candidates, create_test_project, create_test_roles
    
    print("🧬 Testing Team Optimizer")
    print("=" * 40)
    
    # Create test data
    candidates = create_test_candidates()
    project = create_test_project()
    roles = create_test_roles()
    
    # Create optimizer
    optimizer = TeamOptimizer(candidates, project, roles)
    
    # Run optimization
    result = optimizer.optimize_team()
    
    # Analyze results
    analysis = optimizer.get_team_analysis(result['team_members'])
    
    print(f"\n📊 Team Analysis:")
    print(f"   Team size: {analysis['team_size']}")
    print(f"   Skill coverage: {analysis['skill_coverage']:.3f}")
    print(f"   Diversity score: {analysis['diversity_score']:.3f}")
    print(f"   Experience score: {analysis['experience_score']:.3f}")
    print(f"   Synergy score: {analysis['synergy_score']:.3f}")
    
    print(f"\n👥 Team Members:")
    for i, member in enumerate(result['team_members'], 1):
        print(f"   {i}. {member.position}: {member.technologies[:3]}... ({member.experience_years})")
    
    return result, analysis

if __name__ == "__main__":
    test_team_optimizer() 