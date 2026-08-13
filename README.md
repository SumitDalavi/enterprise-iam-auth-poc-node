# Enterprise IAM & Auth Service PoC (Node.js) 🔐

> A modular Identity and Access Management (IAM) and Single Sign-On (SSO) service built with Node.js, Express, and TypeScript, demonstrating enterprise-grade security patterns.

## The Problem

Most simple apps use basic JWTs and tightly couple their user authentication with their core business logic. In enterprise environments, Identity must be a centralized, secure service capable of handling complex RBAC (Role-Based Access Control), SSO (Single Sign-On), and secure token lifecycles without leaking credentials to downstream microservices.

## The Solution

This PoC separates Identity into a standalone service using Node.js and TypeScript. It provides:
1. **SSO Simulation**: OAuth2/OIDC patterns with authorization codes and token exchanges.
2. **Enterprise RBAC**: Decoupled role and permission management via robust middleware.
3. **Secure Token Issuance**: Short-lived access tokens and secure refresh token handling.

By keeping identity decoupled, downstream services only need to validate the cryptographic signature of the token, allowing the architecture to scale securely.

## Why This Over the Obvious Alternative

While services like Auth0 exist, building a custom IAM in TypeScript demonstrates a deep understanding of token lifecycles, asymmetric cryptography, middleware patterns in Express, and proper separation of concerns. TypeScript enforces strict types for payloads and configurations, making the system significantly more robust than plain JavaScript implementations.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Framework**: Node.js / Express
- **Security**: jsonwebtoken, bcrypt
- **Containerization**: Docker

## Decision Log

| Decision | Rationale |
|----------|-----------|
| TypeScript over JavaScript | Enforces strict typing for JWT payloads, user objects, and API requests, preventing common runtime errors in identity systems. |
| Express Middleware | Provides a clean, composable way to implement authentication checks and RBAC across different routes without duplicating logic. |
| Decoupled RBAC | Roles are mapped to permissions dynamically rather than hardcoding scopes into user records, mimicking enterprise Active Directory/LDAP patterns. |

## 🚀 Getting Started

```bash
docker-compose up -d --build
```
The API will be available at `http://localhost:3000`.

## 📁 Project Structure

For a detailed breakdown of the codebase and technical design decisions, please refer to the [Architecture Documentation](docs/ARCHITECTURE.md).


## ðŸ“‹ Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker](https://www.docker.com/) | >= 24.x | Container runtime |
| [Docker Compose](https://docs.docker.com/compose/) | >= 2.x | Multi-container orchestration |
| [curl](https://curl.se/) or [Postman](https://www.postman.com/) | Any | API testing |

*For local dev without Docker: Node.js >= 20.x, npm >= 10.x*

## ðŸš€ Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/SumitDalavi/enterprise-iam-auth-poc-node.git
cd enterprise-iam-auth-poc-node

# 2. Build and start
docker-compose up -d --build

# 3. Verify it's running
curl http://localhost:8080/health
```

The API is now available at **http://localhost:8080**

## ðŸ§ª Usage & Demo â€” Full Auth Flow

### Step 1: Register a new user
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "SecureP@ss123", "roles": "admin,user"}'
```

### Step 2: Login to get a JWT token
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "SecureP@ss123"}'
# Response: {"access_token": "eyJhbGci...", "token_type": "bearer"}
```

### Step 3: Access a protected endpoint (using the token)
```bash
# Replace <TOKEN> with the access_token from Step 2
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <TOKEN>"

# Access admin-only endpoint (RBAC)
curl http://localhost:8080/api/v1/admin/dashboard \
  -H "Authorization: Bearer <TOKEN>"
```

### Step 4: Test RBAC â€” Create a non-admin user
```bash
# Register a regular user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "UserP@ss123", "roles": "user"}'

# Login as regular user
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "UserP@ss123"}'

# Try to access admin dashboard â€” should be DENIED (403)
curl http://localhost:8080/api/v1/admin/dashboard \
  -H "Authorization: Bearer <USER_TOKEN>"
```

### Step 5: SSO Simulation
```bash
# Initiate SSO login flow
curl http://localhost:8080/api/v1/sso/login/oauth2/github

# Exchange authorization code
curl "http://localhost:8080/api/v1/sso/callback?code=mock_auth_code"
```

## âœ… Verification

| Check | Command | Expected |
|-------|---------|----------|
| Health | `curl http://localhost:8080/health` | `{"status": "ok"}` |
| Register | POST `/api/v1/auth/register` | 201 Created |
| Login | POST `/api/v1/auth/login` | JWT token returned |
| RBAC Allow | GET `/api/v1/admin/dashboard` with admin token | 200 OK |
| RBAC Deny | GET `/api/v1/admin/dashboard` with user token | 403 Forbidden |

```bash
# Stop the service
docker-compose down
```

## 👨‍💻 Author

*Built to demonstrate enterprise Identity and Access Management patterns in a Node.js ecosystem.*
