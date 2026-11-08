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

## Offline editorial validation

Before an editor manually transfers a downloaded JSON file into the network data source, run the local structural validator from the repository root:

```powershell
npm run validate:intake -- .\\path\\to\\casg-curator-draft.json
```

The validator checks the intake format/version, bilingual curator name, required contributor declaration, draft-only statuses, null review date, HTTPS source URLs, source references, and optional public contact fields. It does not edit the file, import records, approve a person, or publish anything. A successful result means only that the package is structurally ready for human editorial review.

Recommended editorial checklist:
- Confirm the curator's identity using independent institutional, exhibition-catalogue, gallery, museum, or reputable publication sources.
- Check spelling and transliteration in both languages; do not infer a preferred English spelling.
- Verify every factual claim and its date against the cited source.
- Assess whether biography, public contact details, photographs, and third-party materials are necessary and appropriate to publish.
- Add exhibitions, institutions, artists, projects, and publications only when the relationship itself is supported by a source.
- Record reviewer identity internally, review date, and any correction history in the editorial process; never fabricate approval metadata.
- Keep uncertain claims out of the public record and request clarification where needed.
- Only after approval, integrate the record and its sources into the network JSON in a reviewed change, with all required publication fields completed.

## Later backend decision

If remote submissions, contributor accounts, editorial queues, or persistent drafts become necessary, first approve a separate architecture and privacy/security review. A CMS, database, authentication provider, deployment, or paid/free-tier cloud resource is not part of this implementation.

## Local editorial dashboard

Open `editorial-dashboard.html` directly in a browser on the editor's device. Choose one or more downloaded intake JSON files. The dashboard reads each file with the browser File API; it does not upload, persist, or modify the selected files.

The dashboard provides:
- structural checks aligned with intake schema version 1;
- a local list of selected cases and their submitted profile/source details;
- a human editorial checklist and optional notes held only in page memory;
- an exportable `casg-editorial-review` JSON report containing the unchanged intake package and a separate review record.

The internal outcome choices are limited to `in_review`, `revision_requested`, and `ready_for_editorial_decision`. The last option is not an approval. The dashboard has no publish action and cannot change the intake record to an approved or published state. Reloading or closing the page clears the in-memory review notes and checklist; export the review report if it needs to be retained. Final editorial approval and any public data integration remain a separate, accountable human process.
