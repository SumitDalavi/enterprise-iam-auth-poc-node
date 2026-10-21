# Enterprise IAM & Auth Service PoC (Node.js) 🔐

[![CI Pipeline](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/SumitDalavi/enterprise-iam-auth-poc-node?color=0969da&label=release&logo=github)](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/releases)
[![Release Workflow](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/actions/workflows/release.yml/badge.svg)](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/actions/workflows/release.yml)
[![GHCR Container](https://img.shields.io/badge/ghcr.io-v0.2.0-blue?logo=docker&logoColor=white)](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/pkgs/container/enterprise-iam-auth-poc-node)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![SBOM](https://img.shields.io/badge/SBOM-SPDX%202.3-blueviolet?logo=spdx)](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/releases/tag/v0.2.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> 🛑 **Note:** This Node.js implementation serves as a reference POC; the canonical active version of this architecture is the [Python Implementation](https://github.com/SumitDalavi/enterprise-iam-auth-poc-python).

> **⚡ Progressive Execution:** SSO endpoints support zero-config simulated OAuth2/OIDC flows out-of-the-box, with fully functional JWT, RBAC, and bcrypt password hashing.

> **🔗 See also:** [Python implementation](https://github.com/SumitDalavi/enterprise-iam-auth-poc-python) of the same IAM service — demonstrating polyglot capability across Node.js and Python ecosystems.

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

## Mock Boundaries (Honest Scope)

| What | Status | Details |
|---|---|---|
| JWT & RBAC | **Real** | jsonwebtoken and bcrypt validate real tokens and passwords. |
| DB Storage | **Real** | SQLite (via Prisma) is used for storage. |
| External IdP | **Mocked** | SSO endpoints simulate OAuth2/OIDC without contacting real IdPs. |

## 🚀 Progressive Credential Loading & Execution Tiers

This project implements **Progressive Credential Loading (PCL)**, allowing it to run immediately out-of-the-box without external dependencies while seamlessly upgrading as credentials are provided.

### Tier 1: Zero-Config Mock Mode (Default)
Ideal for CI, testing, and rapid local evaluation.
- **Execution:** Run with default configuration (`cp .env.example .env`). Zero API keys, databases, or cloud credentials required.
- **Fallback Behavior:** In-memory caches, deterministic offline heuristics, mock vector embeddings, and local mock storage are automatically used.
- **Health Verification:** Endpoints report `{"mode": "mock"}` for unconfigured dependencies.

### Tier 2: Local Development with Live Services
Connect specific external services while keeping others mocked.
- **Execution:** Provide credentials in `.env` for the services you want active (e.g., `JWT_SECRET, DATABASE_URL, REDIS_URL`).
- **Progressive Upgrade:** The runtime inspects environment variables on boot and dynamically promotes only configured modules to live mode.
- **Safe Fallback:** Any missing credentials automatically remain on mock fallbacks with no crashes or missing service errors.

### Tier 3: Production Hardened
Enterprise deployment with production-grade backends, security scans, and container distributions.
- **OCI Container Image:** Pre-built, multi-arch image on GitHub Container Registry:
  ```bash
  docker pull ghcr.io/sumitdalavi/enterprise-iam-auth-poc-node:v0.2.0
  ```
- **Production Orchestration:** Mount secrets via Kubernetes Secrets or cloud secret managers with atomic config reload support.
- **Release Verification:** Checksums and SPDX SBOM available on [GitHub Releases](https://github.com/SumitDalavi/enterprise-iam-auth-poc-node/releases).

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — System diagram and component details
- [Runbook](docs/runbook.md) — Setup, commands, and expected outputs
- [Decisions](docs/decisions.md) — ADRs for IAM choices (and deprecation)
- [Changelog](docs/changelog.md) — Change history
## 📋 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker](https://www.docker.com/) | >= 24.x | Container runtime |
| [Docker Compose](https://docs.docker.com/compose/) | >= 2.x | Multi-container orchestration |
| [curl](https://curl.se/) or [Postman](https://www.postman.com/) | Any | API testing |

*For local dev without Docker: Node.js >= 20.x, npm >= 10.x*

## 🚀 Step-by-Step Setup

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

## 🧪 Usage & Demo â€” Full Auth Flow

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

## ✅ Verification

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

**Sumit Dalavi** — Senior DevSecOps / Platform Engineer
[GitHub](https://github.com/SumitDalavi) | [LinkedIn](https://in.linkedin.com/in/sumit-dalavi-762838129)

---

*Built with a focus on robust patterns, not toy demos.*

## 📁 Project Structure

For a detailed breakdown of the codebase and technical design decisions, please refer to the [Architecture Documentation](docs/ARCHITECTURE.md).

## 📖 Overview

This is the Node.js counterpart to the Python IAM PoC. It utilizes Domain-Driven Design (DDD) to separate concerns such as core security, authentication, and Role-Based Access Control (RBAC) in a strictly typed TypeScript environment.

## ✨ Enterprise Features

- **TypeScript**: Full type safety for requests, responses, and internal services.
- **Prisma ORM**: Modern database access with auto-generated types (using SQLite for this PoC).
- **JWT (JSON Web Tokens)**: Secure token generation via `jsonwebtoken`.
- **RBAC Middleware**: Express middleware extracting claims and enforcing roles.
- **Password Security**: `bcryptjs` password hashing.
- **SSO Simulation**: Mock federated login flows.

## Release & Security Verification

The project includes an automated DevSecOps release pipeline (`.github/workflows/release.yml`) triggered on semantic version tags (`v*.*.*`).

Each release automatically:
1. Executes test suite gates.
2. Builds the container image.
3. Performs vulnerability scanning via Trivy.
4. Generates an SPDX SBOM (`sbom.spdx.json`) using Anchore Syft.
5. Publishes a GitHub Release with attached SBOM.

### Verifying the Release
```bash
# Verify release via GitHub CLI
gh release view v0.2.0 --repo SumitDalavi/enterprise-iam-auth-poc-node

# Download and inspect SBOM
gh release download v0.2.0 --repo SumitDalavi/enterprise-iam-auth-poc-node --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .
```

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — System diagram and component details
- [Runbook](docs/runbook.md) — Setup, commands, and expected outputs
- [Decisions](docs/decisions.md) — ADRs for identity architecture
- [Changelog](docs/changelog.md) — Change history

