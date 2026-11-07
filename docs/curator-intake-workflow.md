# Curator intake and editorial preparation

## Current static workflow

The public curator directory is powered by `data/curator-network.json`. This remains a static JSON content source; this milestone does not add authentication, a database, CMS, server-side submission, or cloud storage.

The public-facing `contribute.html` form is an **intake-preparation tool only**:
1. A contributor enters bilingual name/profile details and at least one HTTPS source.
2. Browser validation checks required fields and HTTPS URLs.
3. The browser downloads a JSON package containing one curator record and its source record.
4. Both records are marked `draft`; the curator has `reviewStatus: "pending"` and `reviewedAt: null`.
5. The contributor must deliver the downloaded file to the editorial team through a separately agreed channel. The website does not receive it.
6. An editor verifies identity, claims, source quality, rights, and consent; corrects the draft; adds any supported entity relationships; and only then changes status and review metadata.
7. Approved records are manually integrated into `data/curator-network.json` through a reviewed Git change.

## Publication gate

A public record must have:
- a stable unique ID;
- `status: "published"`;
- `reviewStatus: "approved"`;
- a real `reviewedAt` date;
- at least one `sourceIds` reference to a published source with a title and HTTPS URL.

Relationships also require published status, supporting published sources, and verified endpoints. Draft exports are intentionally invisible to the public directory. Never change a status to published merely to make a record appear.

## Data and privacy safeguards

- Do not request sensitive personal data, private addresses, or personal phone numbers.
- Public email and website are optional and should only be included when intentionally designated for professional contact.
- A submitter's declaration is not proof of the subject's consent. Editors must separately assess the appropriateness of publishing personal details, photographs, and rights-managed material.
- The form does not upload, store, or transmit entries. Downloaded files remain under the contributor's control.
- No real curator, exhibition, gallery, museum, artist, publication, or source data is seeded by this implementation.

## Later backend decision

If remote submissions, contributor accounts, editorial queues, or persistent drafts become necessary, first approve a separate architecture and privacy/security review. A CMS, database, authentication provider, deployment, or paid/free-tier cloud resource is not part of this implementation.
