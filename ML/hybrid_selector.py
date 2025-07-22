import joblib
from synthetic_data import extract_team_features_rich


def hybrid_team_selection(candidates, project, roles, recommender, model_path="team_quality_model.joblib", n_teams=10):
    """
    Select the best team using a hybrid approach: generate candidate teams with the simple recommender, then use the ML model to pick the best.
    Args:
        candidates: List of Member objects
        project: Project object
        roles: List of Role objects
        recommender: TeamRecommender instance
        model_path: Path to the trained ML model
        n_teams: Number of candidate teams to generate
    Returns:
        best_team: List of Member objects (the best team)
        best_score: Predicted score of the best team
    """
    candidate_teams = []
    for i in range(n_teams):
        # Use different random seed for each iteration to get different teams
        team = recommender._recommend_team(project, roles, random_seed=i)
        team_members = [m['member'] for m in team["team"]]
        candidate_teams.append(team_members)

    model = joblib.load(model_path)
    features = [extract_team_features_rich(team, roles, project) for team in candidate_teams]
    scores = model.predict(features)
    best_idx = scores.argmax()
    return candidate_teams[best_idx], scores[best_idx] 