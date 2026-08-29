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
