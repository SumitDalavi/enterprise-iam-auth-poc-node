# Changelog

## [v0.1.0] — 2026-10-18
### Added
- Automated DevSecOps release pipeline triggering on `v*.*.*` git tags.
- Container image build targeting GitHub Container Registry (`ghcr.io`).
- Trivy vulnerability scanning step with vulnerability reporting.
- Anchore Syft SPDX-JSON SBOM artifact generation.
- Automated GitHub Release publication with attached `sbom.spdx.json`.


## [2026-08-29] — Phase 2 Evidence
### Changed
- **DEPRECATED** this repository in favor of `enterprise-iam-auth-poc-python`.
- Standardized documentation (`runbook.md`, `decisions.md`, `ARCHITECTURE.md`).
- Added maturity badge (Deprecated) and mock boundaries to `README.md`.
