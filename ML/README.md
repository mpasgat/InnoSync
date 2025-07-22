# ML API - Team Recommendation Service

A FastAPI ML service for team recommendations with synergy scoring for InnoSync.

## Features
- JWT authentication with backend
- AI-powered team formation
- Docker support

## Quick Start

### 1. Install
```bash
cd ML
pip install -r requirements.txt
cp config.env.example config.env  # Edit as needed
```

### 2. Run
- **Dev:**
  ```bash
  uvicorn app:app --reload --host 0.0.0.0 --port 8000
  # or
  ./run.sh
  ```
- **Docker:**
  ```bash
  docker build -t ml-api .
  docker run -p 8000:8000 ml-api
  ```
- **Docker Compose:**
  ```bash
  docker-compose up ml
  ```

## API Endpoints
- `GET /health` — Health check
- `GET /auth/status` — Auth status
- `POST /recommend-team` — Team recommendation

## Testing
```bash
python3 mock_backend.py                              # run mock backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000  # run ML API
```

## Environment
Set in `.env` or as env vars:
- `BACKEND_URL` (e.g. http://localhost:8080)
- `ML_USERNAME`, `ML_EMAIL`, `ML_PASSWORD`

## Troubleshooting
- Ensure backend is running and reachable
- Check `BACKEND_URL` and credentials
- For Docker Compose, use healthchecks or add a startup delay if needed

