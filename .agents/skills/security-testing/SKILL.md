---
name: security-testing
description: Review security, privacy, authorization, accessibility, and test coverage for the Contemporary Art Study Group. Use for threat modeling, code review, security checks, and release readiness.
---

# Security & Testing

## Security baseline
- Enforce authentication and authorization on the server/API, not only in the UI.
- Apply least privilege and role-based access control to editorial/admin actions.
- Validate and sanitize untrusted input; protect against injection, XSS, CSRF, broken access control, and unsafe uploads.
- Use secure session and cookie settings appropriate to deployment.
- Keep secrets out of source control, logs, screenshots, and issue descriptions.
- Avoid collecting analytics or personal data without a clear purpose and appropriate consent.
- Separate essential cookies from optional analytics/tracking.
- Consider applicable privacy obligations, including GDPR where in scope; do not claim legal compliance without qualified review.

## Testing workflow
- Inspect actual code and test setup before proposing commands.
- Add tests for business-critical behavior and permission boundaries.
- Test Persian/English and responsive states as part of UI QA.
- Include negative tests: unauthorized access, invalid input, missing content, and failure states.
- Run existing checks and report exact results; never claim tests passed if they were not run.

## Release gate
Document known vulnerabilities, unresolved risks, dependency changes, backup/restore status, and rollback approach. Do not deploy, expose admin routes, or provision external services without explicit approval.
