---
name: nextjs-fullstack
description: Implement and maintain the Contemporary Art Study Group using the approved TypeScript and Next.js architecture. Use for frontend/backend implementation, APIs, components, performance, and technical reviews.
---

# Next.js Full-Stack Engineering

## Architecture constraints
- Follow approved architecture documents and repository decisions; do not silently replace the stack.
- Preferred baseline: Next.js App Router, React, TypeScript, PostgreSQL, modular-monolith boundaries, and documented API contracts.
- Keep business logic out of presentation components. Use typed boundaries and explicit validation.
- Separate public content access from privileged editorial/admin operations.
- Keep environment-specific values in environment variables; commit only safe .env.example placeholders.
- Never commit credentials, tokens, private keys, database URLs, personal data, or production exports.

## Workflow
1. Inspect repository state and project instructions.
2. Confirm scope and acceptance criteria.
3. Implement the smallest coherent change.
4. Add/update tests and documentation.
5. Run lint, typecheck, tests, and production build when available.
6. Summarize changed files, commands, results, risks, and follow-up work.

Prefer server components by default; use client components only when interaction requires them. Validate inputs at trust boundaries. Handle errors explicitly. Optimize images/fonts. Keep dependencies minimal and explain additions.

The current milestone is homepage only. Do not build directories, CMS, authentication, admin panels, or other internal pages until explicitly approved. Never deploy or provision infrastructure without explicit approval.
