# InnoSync ML Team Recommendation API

A FastAPI-based machine learning service that recommends optimal teams for projects based on candidate skills, experience, and team synergy.

## Features

- **Project-based Team Recommendation**: Send a `project_id` and get optimal team recommendations
- **Automatic Data Fetching**: Automatically fetches project details, roles, and candidates from the backend
- **Synergy Scoring**: Advanced algorithms to calculate team synergy and compatibility
- **Skill Matching**: Intelligent matching of candidates to project roles based on skills and experience
- **Real-time Recommendations**: Fresh data fetched for each recommendation request
- **Mock Backend Support**: Includes a mock backend for testing without real backend

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example config file and update it with your backend details:

```bash
cp config.env.example .env
```

Edit `.env` with your backend configuration:
```env
BACKEND_URL=http://localhost:8080
API_TOKEN=your_backend_api_token_here
```

### 3. Run the ML API

```bash
./start_ml_api.sh
```

Or manually:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 4. Test the API

```bash
# Test with mock data (no backend required)
python test_clean.py

# Test with project_id (requires backend or mock backend)
python test_project_id.py
```

## API Endpoints

### POST /recommend-team

Get team recommendations for a project using project_id.

**Request:**
```json
{
  "project_id": 1
}
```

**Response:**
```json
{
  "project_id": "1",
  "team_score": 0.85,
  "synergy_score": 0.72,
  "combined_score": 0.81,
  "members": [
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
      ],
      "role_match_score": 0.92
    }
  ],
  "synergy_metrics": {
    "avg_synergy": 0.72,
    "shared_skills": 2.5,
    "experience_variance": 1.2
  },
  "recommendation_notes": [
    "Team has 2.5 shared skills on average",
    "Experience variance: 1.2 years",
    "Strong team synergy detected"
  ]
}
```

### POST /load-candidates (Legacy)

Load candidate data directly into the recommender (for testing).

**Request:**
```json
[
  {
    "id": 1,
    "bio": "Experienced developer",
    "position": "Frontend Developer",
    "education": "Computer Science",
    "expertise": "React, TypeScript",
    "resume": "Frontend developer with 3 years experience",
    "technologies": ["React", "TypeScript", "CSS"],
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
  }
]
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "candidates_loaded": 5
}
```

## How It Works

1. **Project ID Input**: Backend sends a `project_id` to the ML API
2. **Data Fetching**: ML API automatically fetches:
   - Project details from `/api/projects/{project_id}`
   - Project roles from `/api/projects/{project_id}/roles`
   - All candidates from `/api/users/profiles`
3. **Data Conversion**: Backend data is converted to ML model format
4. **Team Recommendation**: Advanced algorithms recommend optimal teams
5. **Response**: Returns detailed team recommendation with synergy metrics

## Testing

### Mock Backend

For testing without a real backend, use the included mock backend:

```bash
# Start mock backend
uvicorn mock_backend:app --reload --port 8080

# Update your .env to point to mock backend
BACKEND_URL=http://localhost:8080

# Test the ML API
python test_project_id.py
```

### Test Scripts

- **`test_clean.py`**: Tests with local mock data (no backend required)
- **`test_project_id.py`**: Tests with project_id (requires backend or mock backend)

## Backend Integration

The ML API expects these backend endpoints:

- `GET /api/projects/{project_id}` - Get project details
- `GET /api/projects/{project_id}/roles` - Get project roles
- `GET /api/users/profiles` - Get all user profiles

### Expected Backend Data Format

**Project Response:**
```json
{
  "id": 1,
  "title": "Web Application",
  "description": "A modern web application",
  "projectType": "Web Development",
  "teamSize": 3,
  "createdAt": "2024-01-01",
  "updatedAt": "2024-01-01"
}
```

**Project Roles Response:**
```json
[
  {
    "id": 1,
    "roleName": "Frontend Developer",
    "expertiseLevel": "Mid",
    "technologies": ["React", "TypeScript", "CSS"]
  }
]
```

**User Profiles Response:**
```json
[
  {
    "id": 1,
    "profile": {
      "bio": "Experienced developer",
      "position": "Frontend Developer",
      "education": "Computer Science",
      "expertise": "Web Development",
      "expertiseLevel": "Mid",
      "experienceYears": "3 years",
      "technologies": [
        {"name": "React"},
        {"name": "TypeScript"}
      ],
      "workExperiences": [
        {
          "startDate": "2021-01-01",
          "endDate": "2023-01-01",
          "position": "Frontend Developer",
          "company": "Tech Corp",
          "description": "Developed web applications"
        }
      ]
    }
  }
]
```

## Configuration

### Environment Variables

- `BACKEND_URL`: URL of your backend API (default: http://localhost:8080)
- `API_TOKEN`: Authentication token for backend API (optional)
- `ML_API_PORT`: Port for ML API (default: 8000)

### Backend Requirements

Your backend should have these endpoints available:
- `GET /api/projects/{id}` - Project details
- `GET /api/projects/{id}/roles` - Project roles
- `GET /api/users/profiles` - All user profiles

## Development

### Project Structure

```
ML/
├── app.py                 # Main FastAPI application
├── recommender.py         # Team recommendation logic
├── data_types.py          # Pydantic models
├── mock_backend.py        # Mock backend for testing
├── test_project_id.py     # Test script for project_id
├── test_clean.py          # Test script for local data
├── start_ml_api.sh        # Easy startup script
├── config.env.example     # Configuration template
└── requirements.txt       # Dependencies
```

### Adding New Features

1. Update `data_types.py` for new data structures
2. Modify `recommender.py` for new algorithms
3. Update `app.py` for new endpoints
4. Add tests to test scripts

## ML Algorithm

### Team Recommendation
- **Skill Matching**: Uses TF-IDF vectorization and cosine similarity
- **Role-based Selection**: Matches candidates to specific project roles
- **Experience Level**: Considers expertise levels and years of experience

### Synergy Scoring
- **Jaccard Similarity**: Measures skill overlap between team members
- **Experience Variance**: Balances team with diverse experience levels
- **Company Diversity**: Encourages teams from different companies

### Scoring Components
- **Team Score**: 50% skill match + 30% coverage + 20% diversity
- **Synergy Score**: 70% skill overlap + 30% experience balance
- **Combined Score**: 70% team score + 30% synergy score

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure backend is running and accessible
2. **Authentication Error**: Check API_TOKEN in environment
3. **Data Format Error**: Verify backend response format matches expected structure
4. **No Candidates Found**: Ensure backend has user profiles with required fields

### Debug Mode

Run with debug logging:

```bash
uvicorn app:app --reload --log-level debug
```

### Testing Without Backend

Use the mock backend for testing:

```bash
# Terminal 1: Start mock backend
uvicorn mock_backend:app --reload --port 8080

# Terminal 2: Start ML API
uvicorn app:app --reload --port 8000

# Terminal 3: Run tests
python test_project_id.py
```

## License

This project is part of the InnoSync platform.
