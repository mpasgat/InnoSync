
# InnoSync API Documentation

## SwaggerUI
Access http://localhost:8080/swagger-ui/index.html for more information about API


---
##  Authentication API
### `POST api/auth/signup`
**Description:**  
Registers a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```
**Responses:**
- `200 Created`: User successfully registered.
- `400 Bad Request`: Invalid input or email already taken.
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
##  Project API
### `POST api/projects`
**Description:**  
Creates a new project.

**Request Body Example:**

```json
{
  "title": "string",
  "description": "string"
}
```
**Responses:**
- `200 Created`: Project successfully created.
```json
{
  "id": 0,
  "title": "string",
  "description": "string",
  "createdAt": "2025-06-25T19:06:51.250Z",
  "updatedAt": "2025-06-25T19:06:51.250Z"
}
```
- `400 Bad Request`: Invalid data or profile already exists.
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
    "description": "A great tool for collaboration	",
    "createdAt": "2025-06-25T19:09:06.994Z",
    "updatedAt": "2025-06-25T19:09:06.994Z"
  }
]
```
- `400 Bad Request`: Invalid input.
---
### `POST api/projects/{project_id}/roles`
**Description:**  
Create role in a project

**Request Body Example:**
Specify project_id.

**Responses:**
- `200 OK`
```json
{
  "roleName": "Backend dev",
  "expertiseLevel": "MID",
  "technologies": [
    "Java", "Spring", "Postgres"
  ]
}
```
- `401 Unauthorized`: If the user is not logged in.
- `404 Not Found`: Project not found.
---
### `GET api/projects/{project_id}/roles`
**Description:**  
Show all roles for a project

**Request Body Example:**
Specify project_id.

**Responses:**
- `200 OK`
```json
[
  {
    "id": 0,
    "roleName": "Backend dve",
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
##  Profile API
### `POST api/profile`
**Description:**  
Creates a new user profile.

**Request Body Example:**
```json
{
"telegram":  "@telegram",
"github":  "https://github.com/mygithub",
"bio":  "Experienced software developer with 5+ years in Java and Spring",
"position":  "Senior Software Engineer",
"education":  "MASTER",
"expertise":  "Backend Development C++",
"expertise_level":  "SENIOR",
"resume":  "https://myresume.com/resume.pdf",
"work_experience":  [
{
"startDate":  "2020-01-01",
"endDate":  "2023-12-31",
"position":  "Software Engineer",
"company":  "Tech Corp",
"description":  "Developed microservices using Spring Boot"
},
{
"startDate":  "2018-06-01",
"endDate":  "2019-12-31",
"position":  "Junior Developer",
"company":  "Startup Inc",
"description":  "Worked on frontend and backend tasks"
}
],
"technologies":  ["Java",  "Spring Boot",  "PostgreSQL",  "Docker"]
}
```
**Responses:**
- `200 Created`: Profile successfully created.
- `400 Bad Request`: Invalid data or profile already exists.
---
### `GET api/profile/me`
**Description:**  
Fetches the personal profile of the authenticated user.

**Responses:**
- `200 OK`: Returns the user’s profile.
- `401 Unauthorized`: If the user is not logged in.
- `404 Not Found`: Profile not found.
---
### `GET api/profile/me`
**Description:**  
Fetches the personal profile of the authenticated user.

**Responses:**
- `200 OK`: Returns the user’s profile.
- `401 Unauthorized`: If the user is not logged in.
- `404 Not Found`: Profile not found.
- --
## Role application API
### `POST api/applications/project-roles/{projectRoleId}`
**Description**
Create role application.

**Request Body Example**
Specify projectRoleId.

**Responses**
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
  "status": "PENDING",
  "appliedAt": "2025-06-25T19:35:29.075Z",
  "updatedAt": "2025-06-25T19:35:29.075Z"
}
```
---
### `GET api/applications/project-roles/{projectRoleId}`
**Description**
Show all applications to role.

**Request Body Example**
Specify projectRoleId.

**Responses**
- `200 OK`: Returns list of all applications.
```json
{
  "id": 0,
  "userId": 0,
  "userFullName": "David Goggins",
  "projectRoleId": 2,
  "roleName": "Frontend dev",
  "projectId": 3,
  "projectTitle": "InnoSync",
  "status": "PENDING",
  "appliedAt": "2025-06-25T19:35:29.075Z",
  "updatedAt": "2025-06-25T19:35:29.075Z"
}
```
---
### `GET api/applications`
**Description**
Show all applications sent by current user.

**Responses**
- `200 OK`: Returns list of all applications sent by user.
```json
{
  "id": 0,
  "userId": 0,
  "userFullName": "David Goggins",
  "projectRoleId": 2,
  "roleName": "Frontend dev",
  "projectId": 3,
  "projectTitle": "InnoSync",
  "status": "PENDING",
  "appliedAt": "2025-06-25T19:35:29.075Z",
  "updatedAt": "2025-06-25T19:35:29.075Z"
}
```
---
### `PATCH api/applications/{applicatoinId}/status`
**Description**
Change status of role application.

**Request**
Specify applicationId and status in path.

**Responses**
- `200 OK`: Returns list of all applications.
```json
{
  "id": 0,
  "userId": 0,
  "userFullName": "David Goggins",
  "projectRoleId": 2,
  "roleName": "Frontend dev",
  "projectId": 3,
  "projectTitle": "InnoSync",
  "status": "PENDING",
  "appliedAt": "2025-06-25T19:35:29.075Z",
  "updatedAt": "2025-06-25T19:35:29.075Z"
}
```
---
## Invitation API
### `POST api/invitations`
**Description**
Create an invitation.

**Request Body Example**
```json
{
  "projectRoleId": 0,
  "recipientId": 0
}
```

**Responses**
- `200 OK`
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
    "status": "INVITED",
    "sentAt": "2025-06-25T19:40:41.981Z",
    "respondedAt": "2025-06-25T19:40:41.981Z"
  }
]
```
---
### `PATCH api/invitations/{invitationId/respond`
**Description**
Respond to an invitation.

**Request**
Specify invitationId and response in path.

**Responses**
- `200 OK`: Returns list of all applications.
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
    "status": "INVITED",
    "sentAt": "2025-06-25T19:40:41.981Z",
    "respondedAt": "2025-06-25T19:40:41.981Z"
  }
]
```
---
### `GET api/invitations/sent`
**Description**
Show all invitations sent by user

**Responses**
- `200 OK`: Returns list of all applications sent by user.
```json
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
    "status": "INVITED",
    "sentAt": "2025-06-25T19:40:41.981Z",
    "respondedAt": "2025-06-25T19:40:41.981Z"
  }
]
```
---
### `GET api/invitations/received`
**Description**
Show all received invitations.

**Responses**
- `200 OK`: Returns list of all applications.
OK

Media type

Controls `Accept` header.

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
    "status": "INVITED",
    "sentAt": "2025-06-25T19:40:41.981Z",
    "respondedAt": "2025-06-25T19:40:41.981Z"
  }
]
```
---
