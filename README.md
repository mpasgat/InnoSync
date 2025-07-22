# InnoSync 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)](https://docker.com/)

> **Smart talent-matching and project collaboration platform for university communities and innovation hubs**

InnoSync connects recruiters (project creators) with talent through AI-powered team formation, detailed profile matching, and integrated collaboration tools.

## 🎬 Demo

![InnoSync Demo](assets/Week4_Capstone.gif)

*Experience the seamless team formation and AI-powered matching in action*

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Detailed Setup](#-detailed-setup)
- [🎯 User Roles](#-user-roles)
- [🤖 FastSyncing AI](#-fastsyncing-ai)
- [🔧 Development](#-development)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Team Formation** - FastSyncing algorithm matches optimal team members
- **Comprehensive Profile System** - Detailed skill mapping and experience tracking
- **Real-time Collaboration** - Integrated chat and communication tools
- **Advanced Filtering** - Role-based, skill-based, and expertise-level filtering
- **Invitation Management** - Streamlined application and invitation workflow

### 🚀 Advanced Capabilities
- **Smart Matching Algorithm** - ML-powered candidate recommendation
- **Team Synergy Analysis** - Compatibility scoring for optimal team formation
- **Real-time Notifications** - Instant updates on applications and invitations
- **File Management** - Resume and profile picture uploads
- **Role-based Access Control** - Secure authentication and authorization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   ML Service    │
│   (Next.js)     │◄──►│  (Spring Boot)  │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Port: 5440    │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: React Hooks
- **UI/UX**: Custom design system

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: PostgreSQL 15
- **Authentication**: JWT with Spring Security
- **API Documentation**: Swagger/OpenAPI

### Machine Learning
- **Framework**: FastAPI
- **Language**: Python 3.11
- **ML Libraries**: Pandas, NumPy, Scikit-learn
- **Algorithms**: Team synergy analysis, skill matching

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Web Server**: Nginx
- **Monitoring**: ELK Stack (Elasticsearch, Logstash, Kibana)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)
- Java 21+ (for local development)

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/IU-Capstone-Project-2025/InnoSync.git
cd InnoSync

# Start all services
docker-compose up --build
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **ML Service**: http://localhost:8000
- **Database**: localhost:5440
- **API Documentation**: http://localhost:8080/swagger-ui/index.html

## 📖 Detailed Setup

### 1. Environment Configuration

#### Backend Configuration
Create `.env` file in the `backend` directory:
```bash
# Database Configuration
DB_URL=jdbc:postgresql://postgres:5432/registration
DB_USERNAME=myuser
DB_PASSWORD=mypass
```

### 2. Database Setup
The PostgreSQL database will be automatically initialized with the required schema when the containers start.

### 3. Service Verification
```bash
# Check if all services are running
docker-compose ps

# View logs
docker-compose logs -f

# Test API endpoints
curl http://localhost:8080/api/health
curl http://localhost:8000/health
```

## 🎯 User Roles

### 👤 Recruitee (Talent/Applicant)
- **Profile Creation**: Comprehensive skill and experience mapping
- **Project Discovery**: Advanced filtering and search capabilities
- **Application Management**: Direct project applications
- **Invitation Handling**: Accept/decline team invitations

### 👥 Recruiter (Project Creator)
- **Project Management**: Create and manage project requirements
- **Talent Discovery**: Manual search with advanced filters
- **FastSyncing**: AI-powered automatic team matching
- **Team Formation**: Invitation and team finalization

## 🤖 FastSyncing AI

### How It Works
1. **Recruiter Opt-in**: Enable FastSyncing for project
2. **AI Analysis**: ML algorithms analyze requirements and candidate profiles
3. **Team Recommendation**: Optimal team composition suggestions
4. **Review & Revoll**: Recruiters can review and request better matches
5. **Batch Invitations**: Send invitations to recommended team members

### ML Features
- **Skill Compatibility Scoring**: Advanced matching algorithms
- **Team Synergy Analysis**: Experience variance and skill overlap
- **Role-Specific Matching**: Expertise level and technology alignment
- **Performance Optimization**: Continuous learning from user feedback

## 🔧 Development

### Local Development Setup

#### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend Development
```bash
cd frontend/innosync
npm install
npm run dev
```

#### ML Service Development
```bash
cd ML
pip install -r requirements.txt
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend/innosync
npm test

# ML service tests
cd ML
python -m pytest
```

### Code Quality
- **Backend**: Maven with Spring Boot conventions
- **Frontend**: ESLint, Prettier, TypeScript strict mode
- **ML**: Black, isort, mypy for Python code quality

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs

### Key Endpoints
- **Authentication**: `/api/auth/*`
- **Profiles**: `/api/profile/*`
- **Projects**: `/api/projects/*`
- **Applications**: `/api/applications/*`
- **Invitations**: `/api/invitations/*`
- **ML Recommendations**: `/api/recommendations/*`

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

### Team Structure
- **Team Lead**: Baha
- **Frontend**: Asgat & Anvar
- **Backend**: Yusuf & Egor
- **ML/AI**: Gurban
- **DevOps**: Aibek

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions:
- **Telegram**: @abdugafforzoda
- **Issues**: [GitHub Issues](https://github.com/IU-Capstone-Project-2025/InnoSync/issues)

---

<div align="center">
  <p>Built with ❤️ by the InnoSync Team</p>
  <p>Innopolis University Capstone Project 2025</p>
</div>
