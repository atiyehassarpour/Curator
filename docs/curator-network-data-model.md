# Curator network data model

## Purpose

The website is a curator-first reference. The curator profile is the central node; exhibitions, galleries, museums, artists, projects, and publications provide verified context around a curator's practice.

The current implementation is a static, bilingual frontend. The JSON file at `data/curator-network.json` is a versioned content source, not a database or CMS. No external service or cloud resource is required.

## Collections

The root object uses `schemaVersion: 1` and contains:

- `curators`
- `exhibitions`
- `galleries`
- `museums`
- `artists`
- `projects`
- `publications`
- `sources`
- `relationships`

Each entity record must have a stable unique `id`, `status: "published"`, `reviewStatus: "approved"`, a `reviewedAt` date, and at least one `sourceIds` reference to a published source with a title and HTTPS URL. The frontend enforces all of these requirements before rendering. Draft, submitted, under-review, rejected, unreviewed, and placeholder records are not public.

Bilingual content fields use objects such as `{ "fa": "...", "en": "..." }`. Common fields include `name` or `title`, `summary`, `description`, `city`, `country`, and `sourceIds`. Curator records may also include `biography`, `approach`, `practiceTypes`, `fields`, and `locationGroup`.

## Relationship records

Relationships are explicit many-to-many edges:

- `id`: stable relationship identifier
- `status`: publish state; only published edges between published records appear
- `fromType`, `fromId`: source entity
- `toType`, `toId`: target entity
- `relationType`: controlled relationship vocabulary
- `role`: optional bilingual role or contextual note
- `sourceIds`: references supporting the relationship

Initial relationship vocabulary includes `curated`, `hosted`, `participated`, `collaborated`, `authored`, `documented`, and `associated`. The edge direction is stored as entered; profile pages display either incoming or outgoing connections.

Typical graph paths include:

- Curator → curated → Exhibition
- Exhibition → hosted → Gallery or Museum
- Exhibition → participated → Artist
- Curator → collaborated → Project or Institution
- Curator → authored → Publication

These are relationship patterns, not claims about real people or events. No sample personal or institutional records are seeded.

## Sources and publication integrity

A source record should include a stable `id`, bilingual `title`, `url`, publisher or archive information, publication/access dates where available, and status. Published records must cite source IDs. Relationship claims must also have `status: "published"` and at least one `sourceIds` reference to a published source with a title and HTTPS URL; the frontend hides unsupported or unreviewed edges.

External links are rendered only when they use HTTPS. Editorial review and source verification are prerequisites for publication. Image credits, usage rights, consent, and the last-reviewed date should be stored with the relevant record before images or personal information are published.

## Frontend behavior

- `network.js` loads and validates the JSON structure and provides shared relationship helpers.
- `curators.js` renders only published curator records and filters them by query, practice type, and location.
- `profile.js` renders a curator profile and groups linked exhibitions, galleries, museums, artists, projects, and publications.
- `entity.js` renders an entity detail page and its connections, including backlinks to related curator profiles.
- `entity.html?type=<entity-type>&id=<record-id>` is the reusable route for non-curator records.
- `curator-profile-template.html?id=<curator-id>` is the reusable curator profile route.

## Future migration

If the content volume later requires a CMS or database, retain the same entity IDs, collection semantics, relationship edges, source references, bilingual fields, and publication states. A backend migration is a separate product decision and must not be initiated without explicit approval.

## Extended curator profile fields

The curator profile template can render the following optional, bilingual fields when present and verified:

- `portrait`: object with `url` (HTTPS), bilingual `alt`, and bilingual `credit`. The image is omitted when the URL is not HTTPS. Image rights and permission must be confirmed editorially before publication.
- `roles`: array of objects with bilingual `title`, `organization` or `institution`, `description` or `role`, and optional `startDate` / `endDate`.
- `education`: array of objects with bilingual `degree`, `institution`, `description`, and optional dates.
- `researchInterests`: array of bilingual labels (or use the existing `fields` array).
- `website`, `instagram`, `orcid`: optional HTTPS public links. Only safe HTTPS URLs are rendered.

All fields are optional. An empty section displays a clear empty state; it must never be populated with invented or inferred credentials.

## Curator-centered relationship traversal

The curator profile displays direct, verified links to exhibitions, projects, publications, artists, galleries, and museums. It also follows one documented relationship step from each curator-linked exhibition to its host gallery/museum and participating artists. These indirect connections are labeled with the exhibition through which they are documented.

Every edge must itself be published, source-backed, and connect verified published records. The traversal is intentionally limited to one hop beyond curator-linked exhibitions to avoid presenting unrelated network connections as the curator's own work. Duplicate entities are shown once. Non-curator entity pages retain their reciprocal links back to the curator profile.

The profile remains a static frontend backed by `data/curator-network.json`; no CMS, database, account system, or external service is introduced.
