# Contemporary Art Study Group

A bilingual Persian/English digital platform for contemporary art research, documentation, editorial publishing, and professional exchange, with a focus on Iranian contemporary art in an international context.

## Project status

The repository now contains:
- A bilingual responsive homepage.
- A bilingual **Research** landing page for research dossiers, study pathways, and research principles.
- A bilingual **Journal** landing page for editorial formats, featured essays, and publishing standards.

The Research and Journal pages are the first approved internal-section milestone. Their sample feature titles and copy are explicitly structural placeholders, not published research or articles.

## Core principles

- Independent international Contemporary Art Study Group (not an institute or museum).
- Persian and English are first-class product languages with independent editorial versions and review.
- Museums and galleries are separate, equal entity types.
- Editorial quality, research integrity, accessibility, responsive behavior, and maintainable documentation.
- Never invent artists, exhibitions, organizations, sources, image credits, or publication histories.
- Prefer free-tier infrastructure; do not provision paid services or incur costs without explicit approval.

## Local preview

Run from the repository folder:

```powershell
py -m http.server 8000
```

Then open:
- Homepage: `http://localhost:8000/?lang=fa`
- Research: `http://localhost:8000/research.html?lang=fa`
- Journal: `http://localhost:8000/journal.html?lang=fa`

Use `?lang=en` for English. The language selection is also retained between pages in local storage.

## Documentation

Project brief, requirements, workflows, and technical architecture are maintained under `docs/`. Homepage review and preview instructions are in `docs/05-homepage-design-review.md` and `docs/06-homepage-preview-guide.md`. The Research and Journal design and content rules are documented in `docs/07-research-journal-design.md`.
