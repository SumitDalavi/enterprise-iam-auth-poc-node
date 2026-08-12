# Enterprise IAM & Auth Service (Node.js PoC) 🔐

A comprehensive Proof of Concept demonstrating an Enterprise-Grade Identity and Access Management (IAM) Service built with **Node.js, Express, TypeScript, and Prisma**.

## 📖 Overview

This is the Node.js counterpart to the Python IAM PoC. It utilizes Domain-Driven Design (DDD) to separate concerns such as core security, authentication, and Role-Based Access Control (RBAC) in a strictly typed TypeScript environment.

## ✨ Enterprise Features

- **TypeScript**: Full type safety for requests, responses, and internal services.
- **Prisma ORM**: Modern database access with auto-generated types (using SQLite for this PoC).
- **JWT (JSON Web Tokens)**: Secure token generation via `jsonwebtoken`.
- **RBAC Middleware**: Express middleware extracting claims and enforcing roles.
- **Password Security**: `bcryptjs` password hashing.
- **SSO Simulation**: Mock federated login flows.

## 🚀 Getting Started

### Local Development (Without Docker)

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Setup the Database**:
   ```bash
   npm run prisma:push
   ```
3. **Run the application**:
   ```bash
   npm run dev
   ```

### Running with Docker

1. **Build and start the container**:
   ```bash
   docker-compose up -d --build
   ```
2. **Access the API**: 
   The service will be running on `http://localhost:8080`.

## 📁 Architecture Details

For a detailed breakdown of the design patterns used, see the [Architecture Documentation](docs/ARCHITECTURE.md).

## 👨‍💻 Author

*Created as a technical showcase for enterprise backend engineering.*
