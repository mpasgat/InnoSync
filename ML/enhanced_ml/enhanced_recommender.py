from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split
import numpy as np
import itertools
from typing import List, Dict, Tuple, Optional
from pydantic import BaseModel
import joblib
import os
from data_types import *

class EnhancedTeamRecommender:
    def __init__(self, candidates: List[Member], use_ml_model: bool = True):
        self.candidates = candidates
        self.use_ml_model = use_ml_model
        
        # Enhanced feature engineering
        self._prepare_features()
        
        # ML model for team scoring
        if use_ml_model:
            self._initialize_ml_model()
        
        # Skill vectorization with enhanced preprocessing
        self._prepare_skill_vectors()
        
        # Index candidates by role with fuzzy matching
        self._index_candidates()

    def _prepare_features(self):
        """Enhanced feature engineering for candidates"""
        self.candidate_features = []
        
        for candidate in self.candidates:
            features = {
                'experience_years': self._extract_experience_years(candidate.experience_years),
                'expertise_level_score': self._encode_expertise_level(candidate.expertise_level),
                'education_score': self._encode_education(candidate.education),
                'company_diversity': len(set(exp.company for exp in candidate.work_experience)),
                'skill_count': len(candidate.technologies),
                'avg_company_tenure': self._calculate_avg_tenure(candidate.work_experience),
                'skill_specialization': self._calculate_skill_specialization(candidate.technologies),
                'leadership_score': self._calculate_leadership_score(candidate.work_experience),
                'project_complexity_score': self._calculate_project_complexity(candidate.work_experience)
            }
            self.candidate_features.append(features)

    def _extract_experience_years(self, experience_str: str) -> float:
        """Extract years of experience from string"""
        try:
            return float(experience_str.split()[0])
        except (ValueError, IndexError):
            return 0.0

    def _encode_expertise_level(self, level: str) -> int:
        """Encode expertise level numerically"""
        level_mapping = {
            'Junior': 1,
            'Mid': 2,
            'Senior': 3,
            'Lead': 4,
            'Principal': 5
        }
        return level_mapping.get(level, 2)

    def _encode_education(self, education: str) -> int:
        """Encode education level numerically"""
        education_mapping = {
            'High School': 1,
            'Bachelor': 2,
            'Master': 3,
            'PhD': 4
        }
        for key, value in education_mapping.items():
            if key.lower() in education.lower():
                return value
        return 2  # Default to Bachelor

    def _calculate_avg_tenure(self, work_experience: List[Work]) -> float:
        """Calculate average tenure at companies"""
        if not work_experience:
            return 0.0
        
        total_years = 0
        for work in work_experience:
            try:
                start_year = int(work.startDate.split('-')[0])
                end_year = int(work.endDate.split('-')[0])
                total_years += (end_year - start_year)
            except (ValueError, IndexError):
                continue
        
        return total_years / len(work_experience) if work_experience else 0.0

    def _calculate_skill_specialization(self, technologies: List[str]) -> float:
        """Calculate skill specialization (how focused vs broad)"""
        # Define skill categories
        categories = {
            'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html'],
            'backend': ['java', 'python', 'node.js', 'spring', 'django', 'express'],
            'devops': ['docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'terraform'],
            'database': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'],
            'mobile': ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin']
        }
        
        category_counts = defaultdict(int)
        for tech in technologies:
            tech_lower = tech.lower()
            for category, skills in categories.items():
                if any(skill in tech_lower for skill in skills):
                    category_counts[category] += 1
        
        # Specialization score: fewer categories = more specialized
        return 1.0 / (len(category_counts) + 1) if category_counts else 0.0

    def _calculate_leadership_score(self, work_experience: List[Work]) -> float:
        """Calculate leadership potential based on work experience"""
        leadership_keywords = ['lead', 'senior', 'principal', 'architect', 'manager', 'director']
        score = 0.0
        
        for work in work_experience:
            position_lower = work.position.lower()
            description_lower = work.description.lower()
            
            for keyword in leadership_keywords:
                if keyword in position_lower or keyword in description_lower:
                    score += 0.2
                    break
        
        return min(score, 1.0)

    def _calculate_project_complexity(self, work_experience: List[Work]) -> float:
        """Calculate project complexity based on work descriptions"""
        complexity_keywords = ['architecture', 'design', 'system', 'platform', 'enterprise', 'scalable']
        score = 0.0
        
        for work in work_experience:
            description_lower = work.description.lower()
            for keyword in complexity_keywords:
                if keyword in description_lower:
                    score += 0.1
        
        return min(score, 1.0)

    def _prepare_skill_vectors(self):
        """Enhanced skill vectorization with semantic similarity"""
        # Prepare skills with enhanced preprocessing
        candidate_skills = []
        for member in self.candidates:
            # Normalize and clean skills
            cleaned_skills = [skill.strip().lower() for skill in member.technologies]
            candidate_skills.append(','.join(cleaned_skills))
        
        # Enhanced TF-IDF with better parameters
        self.tfidf = TfidfVectorizer(
            tokenizer=lambda x: x.split(','),
            min_df=1,
            max_df=0.9,
            ngram_range=(1, 2),  # Consider bigrams for better matching
            stop_words=None
        )
        self.skill_matrix = self.tfidf.fit_transform(candidate_skills)

    def _index_candidates(self):
        """Enhanced candidate indexing with fuzzy role matching"""
        self.role_index = defaultdict(list)
        self.skill_index = defaultdict(list)
        
        for idx, member in enumerate(self.candidates):
            # Index by exact role
            self.role_index[member.position].append(idx)
            
            # Index by skills for cross-role matching
            for skill in member.technologies:
                self.skill_index[skill.lower()].append(idx)

    def _initialize_ml_model(self):
        """Initialize ML model for team scoring"""
        self.scaler = StandardScaler()
        self.team_scorer = MLPRegressor(
            hidden_layer_sizes=(100, 50, 25),
            activation='relu',
            solver='adam',
            max_iter=1000,
            random_state=42
        )
        
        # Try to load pre-trained model
        model_path = 'team_scorer_model.pkl'
        if os.path.exists(model_path):
            try:
                self.team_scorer = joblib.load(model_path)
                print("Loaded pre-trained team scoring model")
            except:
                print("Could not load pre-trained model, will train new one")

    def _train_team_scorer(self, training_data: List[Dict]):
        """Train the ML model for team scoring"""
        if not training_data:
            return
        
        X = []
        y = []
        
        for team_data in training_data:
            features = self._extract_team_features(team_data['team'])
            X.append(features)
            y.append(team_data['performance_score'])
        
        if len(X) > 10:  # Need sufficient data
            X = np.array(X)
            y = np.array(y)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train model
            self.team_scorer.fit(X_scaled, y)
            
            # Save model
            joblib.dump(self.team_scorer, 'team_scorer_model.pkl')
            print("Trained and saved team scoring model")

    def _extract_team_features(self, team: List[Dict]) -> List[float]:
        """Extract features for team scoring"""
        if not team:
            return [0.0] * 10
        
        features = []
        
        # Average experience
        exp_years = [self._extract_experience_years(m['member'].experience_years) for m in team]
        features.append(np.mean(exp_years))
        
        # Experience variance
        features.append(np.std(exp_years))
        
        # Average expertise level
        expertise_levels = [self._encode_expertise_level(m['member'].expertise_level) for m in team]
        features.append(np.mean(expertise_levels))
        
        # Skill diversity
        all_skills = set()
        for m in team:
            all_skills.update(m['member'].technologies)
        features.append(len(all_skills))
        
        # Company diversity
        companies = set()
        for m in team:
            if m['member'].work_experience:
                companies.add(m['member'].work_experience[0].company)
        features.append(len(companies))
        
        # Average skill specialization
        specializations = []
        for m in team:
            specializations.append(self._calculate_skill_specialization(m['member'].technologies))
        features.append(np.mean(specializations))
        
        # Leadership potential
        leadership_scores = []
        for m in team:
            leadership_scores.append(self._calculate_leadership_score(m['member'].work_experience))
        features.append(np.mean(leadership_scores))
        
        # Project complexity experience
        complexity_scores = []
        for m in team:
            complexity_scores.append(self._calculate_project_complexity(m['member'].work_experience))
        features.append(np.mean(complexity_scores))
        
        # Team size
        features.append(len(team))
        
        # Role match scores
        role_scores = [m['role_match_score'] for m in team]
        features.append(np.mean(role_scores))
        
        return features

    def recommend_team(self, project: Project, roles: List[Role], max_candidates_per_role: int = 5) -> Dict:
        """Enhanced team recommendation with ML scoring"""
        required_roles = self._parse_required_roles(roles)
        team = []
        
        for role_name, count in required_roles.items():
            candidates_for_role = self._find_candidates_for_role(role_name, roles, max_candidates_per_role)
            
            selected = 0
            for candidate_data in candidates_for_role:
                if selected >= count:
                    break
                team.append(candidate_data)
                selected += 1

        if team:
            # Calculate scores
            avg_score = sum(m['role_match_score'] for m in team) / len(team)
            all_required_skills = set(itertools.chain.from_iterable(r.technologies for r in roles))
            coverage = self._calculate_skill_coverage(all_required_skills, team)
            diversity = self._calculate_team_diversity(team)
            
            # Use ML model if available
            if self.use_ml_model and hasattr(self, 'team_scorer'):
                ml_score = self._predict_team_performance(team)
                team_score = 0.4 * avg_score + 0.2 * coverage + 0.2 * diversity + 0.2 * ml_score
            else:
                team_score = 0.5 * avg_score + 0.3 * coverage + 0.2 * diversity
        else:
            team_score = 0

        return {
            'team': team,
            'team_score': team_score,
            'project_details': project
        }

    def _find_candidates_for_role(self, role_name: str, roles: List[Role], max_candidates: int) -> List[Dict]:
        """Enhanced candidate finding with cross-role matching"""
        role_obj = next((r for r in roles if r.roleName == role_name), None)
        if not role_obj:
            return []
        
        # Get candidates by exact role match
        exact_matches = self.role_index.get(role_name, [])
        
        # Get candidates by skill match (cross-role)
        skill_matches = set()
        for skill in role_obj.technologies:
            skill_matches.update(self.skill_index.get(skill.lower(), []))
        
        # Combine and rank candidates
        all_candidates = list(set(exact_matches + list(skill_matches)))
        
        if not all_candidates:
            return []
        
        # Calculate similarities
        role_skills_text = ','.join(role_obj.technologies)
        role_vector = self.tfidf.transform([role_skills_text])
        candidate_skill_matrix = self.skill_matrix[all_candidates]
        similarities = cosine_similarity(role_vector, candidate_skill_matrix).flatten()
        
        # Rank by similarity
        ranked_candidates = sorted(zip(all_candidates, similarities), 
                                 key=lambda x: x[1], reverse=True)
        
        # Return top candidates
        result = []
        for candidate_idx, similarity in ranked_candidates[:max_candidates]:
            candidate = self.candidates[candidate_idx]
            result.append({
                'member': candidate,
                'role': role_name,
                'role_match_score': float(similarity)
            })
        
        return result

    def _predict_team_performance(self, team: List[Dict]) -> float:
        """Predict team performance using ML model"""
        try:
            features = self._extract_team_features(team)
            features_scaled = self.scaler.transform([features])
            prediction = self.team_scorer.predict(features_scaled)[0]
            return max(0.0, min(1.0, prediction))  # Clamp between 0 and 1
        except:
            return 0.5  # Default score if prediction fails

    def _parse_required_roles(self, roles: List[Role]) -> Dict[str, int]:
        """Count required roles"""
        role_counts = defaultdict(int)
        for role in roles:
            role_counts[role.roleName] += 1
        return dict(role_counts)

    def _calculate_skill_coverage(self, required_skills: set, team: List[Dict]) -> float:
        """Calculate skill coverage"""
        covered = set()
        for member_data in team:
            member = member_data['member']
            covered.update(member.technologies)
        return len(required_skills & covered) / len(required_skills) if required_skills else 0.0

    def _calculate_team_diversity(self, team: List[Dict]) -> float:
        """Enhanced team diversity calculation"""
        if not team:
            return 0.0
        
        # Company diversity
        companies = set()
        for m in team:
            if m['member'].work_experience:
                companies.add(m['member'].work_experience[0].company)
        company_diversity = len(companies) / len(team)
        
        # Experience level diversity
        exp_levels = set()
        for m in team:
            exp_years = self._extract_experience_years(m['member'].experience_years)
            if exp_years < 3:
                exp_levels.add('Junior')
            elif exp_years < 7:
                exp_levels.add('Mid')
            else:
                exp_levels.add('Senior')
        exp_diversity = len(exp_levels) / 3
        
        # Education diversity
        education_levels = set()
        for m in team:
            education_levels.add(self._encode_education(m['member'].education))
        edu_diversity = len(education_levels) / 4
        
        # Skill diversity
        all_skills = set()
        for m in team:
            all_skills.update(m['member'].technologies)
        skill_diversity = min(len(all_skills) / 20, 1.0)  # Normalize to 0-1
        
        return 0.3 * company_diversity + 0.3 * exp_diversity + 0.2 * edu_diversity + 0.2 * skill_diversity

    def calculate_team_synergy(self, team_members: List[Member]) -> Dict:
        """Enhanced synergy calculation with multiple factors"""
        if len(team_members) < 2:
            return {'avg_synergy': 0.0, 'shared_skills': 0.0, 'synergy_penalty': 1.0}
        
        synergy_scores = []
        skill_overlaps = []
        communication_scores = []
        
        for pair in itertools.combinations(team_members, 2):
            member1, member2 = pair
            
            # Skill overlap (Jaccard similarity)
            skills1 = set(member1.technologies)
            skills2 = set(member2.technologies)
            jaccard = len(skills1 & skills2) / len(skills1 | skills2) if (skills1 | skills2) else 0
            
            # Experience compatibility
            exp1 = self._extract_experience_years(member1.experience_years)
            exp2 = self._extract_experience_years(member2.experience_years)
            exp_diff = abs(exp1 - exp2)
            exp_compatibility = np.exp(-0.1 * exp_diff)
            
            # Communication potential (based on education and experience)
            edu1 = self._encode_education(member1.education)
            edu2 = self._encode_education(member2.education)
            edu_compatibility = 1.0 - abs(edu1 - edu2) / 4.0
            
            # Company compatibility (different companies = better)
            company1 = member1.work_experience[0].company if member1.work_experience else "Unknown"
            company2 = member2.work_experience[0].company if member2.work_experience else "Unknown"
            company_compatibility = 0.5 if company1 != company2 else 0.0
            
            # Combined synergy score
            synergy = 0.4 * jaccard + 0.2 * exp_compatibility + 0.2 * edu_compatibility + 0.2 * company_compatibility
            
            synergy_scores.append(synergy)
            skill_overlaps.append(len(skills1 & skills2))
            communication_scores.append(edu_compatibility + company_compatibility)
        
        avg_synergy = np.mean(synergy_scores) if synergy_scores else 0
        shared_skills = np.mean(skill_overlaps) if skill_overlaps else 0
        avg_communication = np.mean(communication_scores) if communication_scores else 0
        
        return {
            'avg_synergy': round(avg_synergy, 2),
            'shared_skills': round(shared_skills, 1),
            'communication_score': round(avg_communication, 2),
            'synergy_penalty': 1 - avg_synergy
        }

    def recommend_team_with_synergy(self, project: Project, roles: List[Role], n_candidates: int = 5) -> Dict:
        """Enhanced team recommendation with synergy"""
        raw_recommendation = self.recommend_team(project, roles, max_candidates_per_role=n_candidates)
        team_members = [m['member'] for m in raw_recommendation['team']]
        
        synergy = self.calculate_team_synergy(team_members)
        
        # Calculate experience variance
        try:
            exp_values = [self._extract_experience_years(m.experience_years) for m in team_members]
            exp_variance = np.std(exp_values)
        except:
            exp_variance = 0.0
        
        # Enhanced scoring with multiple factors
        team_score = raw_recommendation['team_score']
        synergy_score = synergy['avg_synergy']
        communication_score = synergy.get('communication_score', 0.0)
        
        # Weighted combination
        updated_score = 0.5 * team_score + 0.3 * synergy_score + 0.2 * communication_score
        
        return {
            **raw_recommendation,
            'synergy_metrics': synergy,
            'updated_team_score': round(updated_score, 2),
            'recommendation_notes': [
                f"Team has {synergy['shared_skills']} shared skills on average",
                f"Experience variance: {exp_variance:.1f} years",
                f"Communication compatibility: {synergy.get('communication_score', 0):.2f}",
                f"ML performance prediction: {self._predict_team_performance(raw_recommendation['team']):.2f}" if self.use_ml_model else "ML model not available"
            ]
        }

    def add_training_data(self, team_data: List[Dict]):
        """Add training data for the ML model"""
        if self.use_ml_model:
            self._train_team_scorer(team_data) 