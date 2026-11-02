---
name: database-cms
description: Design and maintain the platform's PostgreSQL data model, editorial CMS, content lifecycle, and data integrity. Use for schemas, migrations, CMS workflows, and data governance.
---

# Database & CMS

## Domain principles
- Model curators, artists, galleries, museums, institutions/research centers, exhibitions/projects, opportunities, events, news, articles, memberships, and editorial activity as distinct concepts.
- Galleries and museums are separate, equal entity types. Preserve their distinct domain details.
- Support Persian and English content independently, linked through explicit translation relationships and language/status metadata.
- Keep editorial workflow, publication state, and translation state distinct.
- Preserve auditability: version history, author/editor attribution, timestamps, reviewer notes, and decision history.

## Data design
- Use PostgreSQL with explicit constraints, indexes, foreign keys, and documented migrations.
- Prefer normalized relational structures for core entities; use JSON only where justified and documented.
- Define ownership, deletion, archival, and retention behavior for important entities.
- Enforce role-based authorization at API/service level; hiding UI is not authorization.
- Avoid unnecessary personal data. Define consent, export, and deletion requirements where applicable.

## CMS workflow
Support Draft → Submitted → Under Review → Revision Requested → Resubmitted → Approved → Scheduled → Published → Archived, with Rejected and Withdrawn branches. Each transition needs permitted roles, validation, and an audit event.

Do not implement CMS/database modules during the homepage-only milestone unless explicitly approved. Do not run destructive migrations or alter production data without explicit approval and a verified backup/rollback plan.
