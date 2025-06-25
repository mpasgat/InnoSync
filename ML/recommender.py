from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import itertools

class TeamRecommender:
    def __init__(self, candidates_df, jobs_df):
        self.candidates = candidates_df
        self.jobs = jobs_df
        
        self.tfidf = TfidfVectorizer(tokenizer=lambda x: x.split(','))
        self.skill_matrix = self.tfidf.fit_transform(self.candidates['skills'])
        
        self.role_index = defaultdict(list)
        for idx, role in enumerate(self.candidates['role']):
            self.role_index[role].append(idx)
    
    def recommend_team(self, job_id, max_candidates_per_role=5):
        job = self.jobs[self.jobs['job_id'] == job_id].iloc[0]
        required_roles = {}
        for role_part in job['team_composition'].split(','):
            role, count = role_part.split(':')
            required_roles[role] = int(count)
        
        job_vector = self.tfidf.transform([job['required_skills']])
        
        team = []
        for role, count in required_roles.items():
            candidate_indices = self.role_index.get(role, [])
            if not candidate_indices:
                continue
                
            role_skill_matrix = self.skill_matrix[candidate_indices]
            similarities = cosine_similarity(job_vector, role_skill_matrix).flatten()
            
            top_indices = np.argsort(similarities)[-max_candidates_per_role:][::-1]
            
            selected = 0
            for idx in top_indices:
                if selected >= count:
                    break
                candidate_idx = candidate_indices[idx]
                candidate = self.candidates.iloc[candidate_idx].to_dict()
                candidate['role_match_score'] = similarities[idx]
                team.append(candidate)
                selected += 1
        
        if team:
            avg_score = sum(m['role_match_score'] for m in team) / len(team)
            coverage = self._calculate_skill_coverage(job['required_skills'], team)
            diversity = self._calculate_team_diversity(team)
            team_score = 0.5*avg_score + 0.3*coverage + 0.2*diversity
        else:
            team_score = 0
            
        return {
            'team': team,
            'team_score': team_score,
            'job_details': job.to_dict()
        }
    
    def _calculate_skill_coverage(self, required_skills, team):
        required = set(required_skills.split(','))
        covered = set()
        for member in team:
            covered.update(member['skills'].split(','))
        return len(required & covered) / len(required)
    
    def _calculate_team_diversity(self, team):
        companies = len(set(m['current_company'] for m in team))
        exp_levels = set()
        for m in team:
            if m['experience'] < 3:
                exp_levels.add('Junior')
            elif m['experience'] < 7:
                exp_levels.add('Mid')
            else:
                exp_levels.add('Senior')
        return 0.6*(companies/len(team)) + 0.4*(len(exp_levels)/3)
    
    def calculate_team_synergy(self, team_members):
        synergy_scores = []
        skill_overlaps = []
        
        for pair in itertools.combinations(team_members, 2):
            member1, member2 = pair
            
            skills1 = set(member1['skills'].split(','))
            skills2 = set(member2['skills'].split(','))
            jaccard = len(skills1 & skills2) / len(skills1 | skills2)
            
            exp_diff = abs(member1['experience'] - member2['experience'])
            exp_penalty = np.exp(-0.1 * exp_diff)
            
            synergy = 0.7*jaccard + 0.3*exp_penalty
            synergy_scores.append(synergy)
            skill_overlaps.append(len(skills1 & skills2))
        
        avg_synergy = np.mean(synergy_scores) if synergy_scores else 0
        shared_skills = np.mean(skill_overlaps) if skill_overlaps else 0
        
        return {
            'avg_synergy': round(avg_synergy, 2),
            'shared_skills': round(shared_skills, 1),
            'synergy_penalty': 1 - avg_synergy
        }

    def recommend_team_with_synergy(self, job_id, n_candidates=5):
        raw_recommendation = self.recommend_team(job_id)  
        team_members = raw_recommendation['team']
        
        synergy = self.calculate_team_synergy(team_members)
        
        updated_score = 0.7*raw_recommendation['team_score'] + 0.3*synergy['avg_synergy']
        
        return {
            **raw_recommendation,
            'synergy_metrics': synergy,
            'updated_team_score': round(updated_score, 2),
            'recommendation_notes': [
                f"Team has {synergy['shared_skills']} shared skills on average",
                f"Experience variance: {np.std([m['experience'] for m in team_members]):.1f} years"
            ]
        }