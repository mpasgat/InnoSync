
# InnoSync API Documentation

## SwaggerUI
Access http://localhost:8080/swagger-ui/index.html for more information about API

---
## Authentication API
### `POST api/auth/signup`
**Description:**  
Registers a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "your_password"
}
```
**Responses:**
- `200 OK`: User successfully registered with access and refresh tokens.
- `409 Conflict`: Email already taken.
---
### `POST api/auth/login`
**Description:**  
Authenticates a user and returns access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```
**Responses:**
- `200 OK`: Returns JWT access and refresh tokens.
- `401 Unauthorized`: Invalid credentials.
---
### `POST api/auth/refresh`
**Description:**  
Refreshes the access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```
**Responses:**
- `200 OK`: Returns new access token.
- `401 Unauthorized`: Invalid or expired refresh token.
---
### `POST api/auth/logout`
**Description:**  
Logs the user out by invalidating the refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```
**Responses:**
- `200 OK`: Successfully logged out.
- `401 Unauthorized`: If token is missing or already invalidated.
---
## Project API
### `POST api/projects`
**Description:**  
Creates a new project.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "projectType": "FREELANCE",
  "teamSize": "OneThree"
}
```
**Responses:**
- `200 OK`: Project successfully created.
```json
{
  "id": 0,
  "title": "string",
  "description": "string",
  "projectType": "FREELANCE",
  "teamSize": "OneThree",
  "createdAt": "2025-06-25T19:06:51.250Z",
  "updatedAt": "2025-06-25T19:06:51.250Z"
}
```
- `400 Bad Request`: Invalid data.
---
### `GET api/projects/me`
**Description:**  
Show all user's projects.

**Responses:**
- `200 OK`
```json
[
  {
    "id": 0,
    "title": "InnoSync",
    "description": "A great tool for collaboration",
    "projectType": "FREELANCE",
    "teamSize": "OneThree",
    "createdAt": "2025-06-25T19:09:06.994Z",
    "updatedAt": "2025-06-25T19:09:06.994Z"
  }
]
```
---
### `GET api/projects/{projectId}`
**Description:**  
Get information about a specific project.

**Responses:**
- `200 OK`: Returns project details.
- `404 Not Found`: Project not found.
---
### `POST api/projects/{projectId}/roles`
**Description:**  
Create role in a project.

**Request Body:**
```json
{
  "roleName": "Backend dev",
  "expertiseLevel": "MID",
  "technologies": [
    "Java", "Spring", "Postgres"
  ]
}
```
**Responses:**
- `200 OK`: Role successfully created.
- `401 Unauthorized`: If the user is not logged in.
- `404 Not Found`: Project not found.
---
### `GET api/projects/{projectId}/roles`
**Description:**  
Show all roles for a project.

**Responses:**
- `200 OK`
```json
[
  {
    "id": 0,
    "roleName": "Backend dev",
    "expertiseLevel": "ENTRY",
    "technologies": [
      "Java", "Spring"
    ]
  }
]
```
- `401 Unauthorized`: If the user is not logged in.
- `404 Not Found`: Project not found.
---
### `GET api/projects/roles`
**Description:**  
Get all available project roles with project info.

**Responses:**
- `200 OK`
```json
[
  {
    "id": 0,
    "roleName": "Backend dev",
    "projectId": 1,
    "projectTitle": "InnoSync",
    "projectDescription": "A great tool for collaboration"
  }
]
```
---
## Profile API
### `POST api/profile`
**Description:**  
Creates or updates a user profile.

**Request Body:**
```json
{
  "telegram": "@telegram",
  "github": "https://github.com/mygithub",
  "bio": "Experienced software developer with 5+ years in Java and Spring",
  "position": "Senior Software Engineer",
  "education": "MASTER",
  "expertise": "Backend Development",
  "expertiseLevel": "SENIOR",
  "experienceYears": "FIVE_PLUS",
  "resume": "https://myresume.com/resume.pdf",
  "workExperience": [
    {
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "position": "Software Engineer",
      "company": "Tech Corp",
      "description": "Developed microservices using Spring Boot"
    }
  ],
  "technologies": ["Java", "Spring Boot", "PostgreSQL", "Docker"]
}
```
**Responses:**
- `200 OK`: Profile successfully created/updated.
- `400 Bad Request`: Invalid data.
---
### `PUT api/profile`
**Description:**  
Updates a user profile.

**Request Body:** Same as POST api/profile
**Responses:**
- `200 OK`: Profile successfully updated.
- `400 Bad Request`: Invalid data.
---
### `GET api/profile/me`
**Description:**  
Fetches the personal profile of the authenticated user.

**Responses:**
- `200 OK`: Returns the user's profile.
- `401 Unauthorized`: If the user is not logged in.
- `404 Not Found`: Profile not found.
---
### `GET api/profile/all`
**Description:**  
Get all user profiles.

**Responses:**
- `200 OK`: Returns list of all profiles.
---
### `POST api/profile/upload-resume`
**Description:**  
Upload user resume (CV).

**Request:** Multipart form data with file parameter
**Responses:**
- `200 OK`: Resume uploaded successfully.
- `500 Internal Server Error`: Upload failed.
---
### `GET api/profile/{profileId}/resume`
**Description:**  
Get a user's resume file.

**Responses:**
- `200 OK`: Returns the resume file.
- `404 Not Found`: Resume not found.
---
### `POST api/profile/upload-profile-picture`
**Description:**  
Upload user profile picture.

**Request:** Multipart form data with file parameter
**Responses:**
- `200 OK`: Profile picture uploaded successfully.
- `500 Internal Server Error`: Upload failed.
---
### `GET api/profile/{profileId}/picture`
**Description:**  
Get a user's profile picture.

**Responses:**
- `200 OK`: Returns the profile picture.
- `404 Not Found`: Picture not found.
---
## Role Application API
### `POST api/applications/project-roles/{projectRoleId}`
**Description:**  
Create role application.

**Responses:**
- `200 OK`
```json
{
  "id": 0,
  "userId": 0,
  "userFullName": "David Goggins",
  "projectRoleId": 2,
  "roleName": "Frontend dev",
  "projectId": 3,
  "projectTitle": "InnoSync",
  "projectType": "FREELANCE",
  "status": "PENDING",
  "appliedAt": "2025-06-25T19:35:29.075Z",
  "updatedAt": "2025-06-25T19:35:29.075Z"
}
```
---
### `GET api/applications/project-roles/{projectRoleId}`
**Description:**  
Show all applications to role.

**Responses:**
- `200 OK`: Returns list of all applications.
```json
[
  {
    "id": 0,
    "userId": 0,
    "userFullName": "David Goggins",
    "projectRoleId": 2,
    "roleName": "Frontend dev",
    "projectId": 3,
    "projectTitle": "InnoSync",
    "projectType": "FREELANCE",
    "status": "PENDING",
    "appliedAt": "2025-06-25T19:35:29.075Z",
    "updatedAt": "2025-06-25T19:35:29.075Z"
  }
]
```
---
### `GET api/applications`
**Description:**  
Show all applications sent by current user.

**Responses:**
- `200 OK`: Returns list of all applications sent by user.
```json
[
  {
    "id": 0,
    "userId": 0,
    "userFullName": "David Goggins",
    "projectRoleId": 2,
    "roleName": "Frontend dev",
    "projectId": 3,
    "projectTitle": "InnoSync",
    "projectType": "FREELANCE",
    "status": "PENDING",
    "appliedAt": "2025-06-25T19:35:29.075Z",
    "updatedAt": "2025-06-25T19:35:29.075Z"
  }
]
```
---
### `PATCH api/applications/{applicationId}/status`
**Description:**  
Change status of role application.

**Request Parameters:**
- `status`: PENDING, ACCEPTED, REJECTED

**Responses:**
- `200 OK`: Returns updated application.
```json
{
  "id": 0,
  "userId": 0,
  "userFullName": "David Goggins",
  "projectRoleId": 2,
  "roleName": "Frontend dev",
  "projectId": 3,
  "projectTitle": "InnoSync",
  "projectType": "FREELANCE",
  "status": "ACCEPTED",
  "appliedAt": "2025-06-25T19:35:29.075Z",
  "updatedAt": "2025-06-25T19:35:29.075Z"
}
```
---
## Invitation API
### `POST api/invitations`
**Description:**  
Create an invitation.

**Request Body:**
```json
{
  "projectRoleId": 0,
  "recipientId": 0
}
```

**Responses:**
- `200 OK`
```json
{
  "id": 1,
  "projectRoleId": 2,
  "roleName": "Backend dev",
  "projectId": 2,
  "projectTitle": "InnoSync",
  "recipientId": 4,
  "recipientName": "yusuf@gmail.com",
  "senderId": 1,
  "senderName": "John Doe",
  "senderEmail": "john@example.com",
  "status": "INVITED",
  "sentAt": "2025-06-25T19:40:41.981Z",
  "respondedAt": null
}
```
---
### `PATCH api/invitations/{invitationId}/respond`
**Description:**  
Respond to an invitation.

**Request Parameters:**
- `response`: ACCEPTED, REJECTED

**Responses:**
- `200 OK`: Returns updated invitation.
```json
{
  "id": 1,
  "projectRoleId": 2,
  "roleName": "Backend dev",
  "projectId": 2,
  "projectTitle": "InnoSync",
  "recipientId": 4,
  "recipientName": "yusuf@gmail.com",
  "senderId": 1,
  "senderName": "John Doe",
  "senderEmail": "john@example.com",
  "status": "ACCEPTED",
  "sentAt": "2025-06-25T19:40:41.981Z",
  "respondedAt": "2025-06-25T19:45:30.123Z"
}
```
---
### `GET api/invitations/sent`
**Description:**  
Show all invitations sent by user.

**Responses:**
- `200 OK`: Returns list of all invitations sent by user.
```json
[
  {
    "id": 1,
    "projectRoleId": 2,
    "roleName": "Backend dev",
    "projectId": 2,
    "projectTitle": "InnoSync",
    "recipientId": 4,
    "recipientName": "yusuf@gmail.com",
    "senderId": 1,
    "senderName": "John Doe",
    "senderEmail": "john@example.com",
    "status": "INVITED",
    "sentAt": "2025-06-25T19:40:41.981Z",
    "respondedAt": null
  }
]
```
---
### `GET api/invitations/received`
**Description:**  
Show all received invitations.

**Responses:**
- `200 OK`: Returns list of all received invitations.
```json
[
  {
    "id": 1,
    "projectRoleId": 2,
    "roleName": "Backend dev",
    "projectId": 2,
    "projectTitle": "InnoSync",
    "recipientId": 4,
    "recipientName": "yusuf@gmail.com",
    "senderId": 1,
    "senderName": "John Doe",
    "senderEmail": "john@example.com",
    "status": "INVITED",
    "sentAt": "2025-06-25T19:40:41.981Z",
    "respondedAt": null
  }
]
```
---
