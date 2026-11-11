# Contemporary Art Study Group

A bilingual Persian/English digital platform for contemporary art research, documentation, editorial publishing, and professional exchange, with a focus on Iranian contemporary art in an international context.

## Project status

The repository contains:
- A bilingual responsive homepage.
- Bilingual Research and Journal landing pages.
- A curator-first directory, reusable profile and entity pages, and a sourced relationship model.
- A static curator-intake preparation form that exports draft JSON locally in the browser; it does not submit or publish data.
- A bilingual online-dialogue request form. It keeps a local text-file fallback until the optional Cloudflare Worker email endpoint is deployed and its public URL is configured.

## Core principles

- Curators are the central directory entity; exhibitions, galleries, museums, artists, projects, and publications provide linked context.
- Persian and English are first-class product languages with independent editorial review.
- Never invent people, exhibitions, organizations, sources, image credits, or publication histories.
- Public records require editorial approval and published HTTPS sources.
- Prefer free-tier infrastructure; do not provision services or incur costs without explicit approval.
- Never commit notification destinations, API keys, phone numbers, or other private contact information.

## Local preview

Run from the repository folder:

```powershell
py -m http.server 8000
```

Open `http://localhost:8000/?lang=fa`, `curators.html?lang=fa`, or `contribute.html?lang=fa`. Use `?lang=en` for English.

## Curator data workflow

The directory reads `data/curator-network.json`. The form at `contribute.html` creates a downloadable draft package only. It does not upload, store, or publish submissions. Editors verify the package and integrate approved records manually. Run `npm run validate:intake -- <draft.json>` for structural checks before human review; validation never approves or publishes. See `docs/curator-intake-workflow.md` and `docs/curator-network-data-model.md`.

## Online dialogue notifications

The Cloudflare Worker and Resend integration is prepared but not deployed. The public homepage form continues to prepare a local text file until `meta[name="casg-dialogue-api"]` is configured with the deployed Worker URL. No SMS is configured. Follow `docs/online-dialogue-notifications.md` for setup and security notes.

## Browser visual QA

Install dependencies and Chromium, then run `npm test` and `npm run test:visual`. Screenshots and reports are saved under `test-results/`.
