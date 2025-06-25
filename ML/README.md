# Team Recommendation System

A machine learning system that recommends complete teams for project-based hiring, evaluating both individual skills and team synergy.

## Features

- **Intelligent Team Building**: Recommends balanced teams based on:
  - Skill matching (TF-IDF + Cosine Similarity)
  - Role requirements
  - Team synergy scores
  - Experience diversity

- **Metrics**:
  - Team Score (skill matching)
  - Synergy Score (Jaccard similarity)
  - Combined weighted score

- **API Endpoints**:
  - `POST /recommend-team` - Get team recommendations with synergy analysis
  - `GET /jobs` - List available job postings

## Running
### Install dependencies:
```
pip install -r requirements.txt
```

### Running the API
```
uvicorn app:app --reload
```

### Example API request
```
curl -X POST "http://localhost:8000/recommend-team" \
  -H "Content-Type: application/json" \
  -d '{"job_id":"T101"}'
```