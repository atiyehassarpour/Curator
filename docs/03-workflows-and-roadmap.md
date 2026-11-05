# Platform Workflows and Roadmap

**Status:** The homepage, Research landing page, and Journal landing page are approved and implemented as the current frontend milestone. Editorial workflows below remain proposed and are not operational.

## 1. Editorial content lifecycle (proposed)

`Draft → Submitted → Under Review → Revision Requested / Resubmitted → Approved → Scheduled → Published`

1. An author prepares an article or research contribution.
2. The author submits it with title, abstract, body, language, contributor details, references, image credits, and rights declarations.
3. Editorial staff review completeness, relevance, originality, accuracy, attribution, and permissions.
4. The editor may request revisions, approve, or reject with an explanation.
5. Approved content is scheduled/published by an authorized editor.
6. Corrections and updates are recorded to preserve editorial accountability.

## 2. Bilingual publishing workflow (proposed)

- Persian and English content have separate editable records and review states.
- A translation may be linked to a source-language article, but neither version is published automatically when the other changes.
- Each language receives its own editorial review, metadata, title, summary, and publication status.
- Missing translation is clearly represented; no machine-generated translation is silently published.

## 3. People and organization records (proposed)

- Curator, artist, researcher, writer, gallery, museum, and other organization types must remain distinct.
- A person may have multiple roles; roles should not be confused with separate person records.
- Galleries and museums are separate, equal organization categories.
- Public profiles and organization pages require editorial verification before publication.

## 4. Exhibition and project documentation (proposed)

- Exhibition/project records may reference artists, curators, galleries, museums, venues, dates, locations, and related publications.
- Relationships should be explicit and traceable rather than embedded only in free text.
- Dates and locations must distinguish confirmed facts from unknown or approximate data.
- Images require source, rights, and credit metadata.

## 5. Opportunity and event workflow (proposed)

- Opportunities/events are submitted or researched.
- Editorial staff verify source, eligibility, deadline, geography, and organizer.
- Expired or withdrawn items are clearly marked and not presented as current.
- Publication includes source attribution and last-verified date.

## 6. Roles (proposed; final permissions need approval)

- **Visitor:** reads public content.
- **Contributor:** submits and tracks own contributions.
- **Editor:** reviews submissions and edits content.
- **Administrator:** manages accounts, permissions, taxonomy, and system configuration.

Least-privilege access should apply. No role or permission system is implemented in the current static frontend.

## 7. Roadmap

### Milestone 1 — Public editorial frontend (current)
Bilingual responsive homepage, Research landing page, Journal landing page, global navigation, language persistence, and documentation.

### Milestone 2 — Editorial content model
Confirm article/research types, author identity, metadata, source and image-rights records, language relationships, and publication states.

### Milestone 3 — Public knowledge sections
Implement approved article and research detail pages, followed by verified people, gallery, museum, exhibition, and project records.

### Milestone 4 — Contributor and editorial workspace
Only after workflow, moderation, security, and privacy requirements are approved, implement registration, submission tracking, editorial review, and admin tools.

### Milestone 5 — Discovery and integrations
Add search, filters, events/opportunities, and integrations after validating operational needs and hosting costs.

## 8. Approval and cost rules

The roadmap is a planning proposal, not authorization to implement every later milestone. Obtain explicit product-owner approval before moving beyond the current homepage, Research, and Journal scope. Do not provision paid services, create cloud resources, deploy, or incur recurring costs without explicit approval.
