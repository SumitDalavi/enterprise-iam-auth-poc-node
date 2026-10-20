# Decisions

## ADR-001: Deprecation of Node.js Implementation
**Date:** 2026-08-29  
**Status:** Accepted

**Context:**  
Maintaining two identical PoCs for IAM in both Python and Node.js splits focus.

**Decision:**  
We are standardizing on the **Python (FastAPI)** implementation as the canonical version for this portfolio because FastAPI's built-in OAuth2 integrations and automatic Swagger documentation provide a better demonstration of enterprise auth patterns with less boilerplate.

**Consequences:**  
- ✅ Less maintenance overhead.
- ✅ Python repository will receive all future enhancements (like OIDC federation).
- ⚠️ Node.js repository marked as deprecated.

## ADR-002: Progressive Credential Loading (PCL) Architecture
- **Context:** Production hardening required live backends (PostgreSQL, Redis, OpenAI, Anthropic), but removing mocks would break CI pipelines and create high developer onboarding friction.
- **Decision:** Implement Progressive Credential Loading. Keep in-memory and local mock heuristics as the default safe baseline, while wrapping external integrations in auto-promoting factory adapters triggered by environment variables.
- **Consequences:** 
  - *Pros:* 100% CI pass rate without requiring external secrets; zero setup friction for new contributors; progressive upgrade to production clusters.
  - *Cons:* Adds lightweight factory abstraction layers and runtime credential detection logic.
