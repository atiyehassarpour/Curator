---
name: github-project-management
description: Manage the Contemporary Art Study Group repository safely using branches, focused commits, documentation, code review, and pull requests. Use for GitHub workflows, issue planning, and repository maintenance.
---

# GitHub Project Management

## Safety rules
- Inspect repository, default branch, current files, and working tree before changing anything.
- Preserve existing work and history. Never force-push, rewrite history, delete files, or overwrite content without explicit approval.
- Work on a dedicated feature branch; do not commit directly to the default branch unless explicitly requested.
- Never commit secrets, credentials, personal data, generated build output, or local environment files.
- Do not merge a pull request unless the user explicitly asks.
- Keep changes focused and explain material file changes.

## Workflow
1. Read README, project instructions, relevant docs, and current implementation.
2. Confirm the task fits the approved product milestone.
3. Create a descriptive branch from the current default branch.
4. Make small, reviewable changes with meaningful commit messages.
5. Update documentation and tests alongside code changes.
6. Open a pull request with scope, rationale, testing, screenshots where relevant, and known limitations.
7. Report the PR URL and state clearly that it has not been merged.

The current approved milestone is the homepage in four states only. Expansion to internal pages, directories, editorial CMS, authentication, admin, or infrastructure requires explicit product-owner approval.
