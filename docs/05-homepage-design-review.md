# Homepage Design Review and Refinement Log

**Working direction:** Global Art Intelligence  
**Implementation surface:** Native HTML, CSS, and JavaScript in this repository (Figma is not required).  
**Branch:** `design/homepage-editorial-refinement`  
**Scope:** Homepage only. Existing section structure and the four language/device review states are preserved.

## 1. Baseline reviewed

The existing homepage already provided:
- Persian RTL and English LTR copy in shared markup.
- A responsive hero, about section, three focus areas, editorial statement, participation section, and footer.
- A CSS-only abstract visual system.
- A mobile navigation control and language toggle.
- Basic reduced-motion and skip-link support.

The current milestone documentation explicitly excludes internal pages, directories, authentication, CMS/editorial dashboards, database integration, and deployment. This refinement does not add those features.

## 2. Changes made

### Visual direction
- Refined the palette toward a warmer editorial paper tone with restrained rust, slate-blue, and muted ochre accents.
- Added Cormorant Garamond as an expressive display face while retaining Vazirmatn for Persian and DM Sans for interface text.
- Increased typographic hierarchy and whitespace in the hero and major editorial sections.
- Refined the hero composition and focus-card proportions without replacing the existing visual concept.
- Added subtle hover/focus treatments and clearer interaction states.

### Responsive behavior
- Preserved the existing responsive breakpoints and layouts.
- Tuned hero scale, section spacing, artwork proportions, and card heights for tablet and narrow mobile screens.
- Kept the four review states as combinations of language and viewport rather than duplicating the page into four separate implementations.

### Language and interaction
- Language can be selected through `?lang=fa` or `?lang=en`.
- The selected language is remembered in local storage where available.
- Switching language continues to update document language, text direction, page title, and description.
- Mobile navigation closes after selecting a section, pressing Escape, or clicking outside it.

### Accessibility
- Added a consistent visible keyboard-focus treatment.
- Preserved skip navigation, semantic sections, button state attributes, and reduced-motion support.
- Kept the mobile navigation state synchronized with `aria-expanded`.

## 3. Four-state review matrix

| State | Implementation route | Review focus |
|---|---|---|
| Persian desktop | `/?lang=fa` at desktop width | RTL alignment, Persian typography, hero balance |
| Persian mobile | `/?lang=fa` at 390px and 320px widths | Menu, stacking, touch targets, overflow |
| English desktop | `/?lang=en` at desktop width | LTR rhythm, display typography, navigation |
| English mobile | `/?lang=en` at 390px and 320px widths | LTR mobile navigation, wrapping, overflow |

## 4. Validation status

- [x] Source review of the existing homepage and project scope.
- [x] HTML/CSS/JavaScript refinement committed on a dedicated branch.
- [x] Language query parameter and persistence logic implemented.
- [x] Keyboard escape and outside-click menu closing implemented.
- [ ] Browser-rendered visual QA at the four viewport/language combinations.
- [x] Added dependency-free Node regression tests for anchor integrity, bilingual content, navigation behavior, responsive breakpoints, and reduced-motion support.
- [x] Added a GitHub Actions workflow to run the regression tests on pull requests and relevant pushes.
- [ ] Browser-rendered visual QA and a full automated accessibility audit remain pending.
- [ ] Owner approval of final copy, identity assets, and contact details.

**Important:** The current working environment did not provide a browser-rendering or screenshot QA session. The implementation has been updated, but no claim is made that pixel-level visual QA has been completed.

## 5. Open owner decisions

- Confirm the final public name, logo, domain, and identity assets.
- Approve the final Persian and English copy.
- Replace or remove the placeholder contact email before public launch.
- Approve image sourcing and credits if the abstract CSS visuals are later replaced with actual artworks.
- Confirm that the original approved source documents remain aligned with this homepage milestone.

## 6. Cost and scope

No paid service, cloud resource, database, hosting, or deployment has been created or activated. The refinement uses the repository's existing static HTML/CSS/JavaScript approach.


## 7. Approved scope extension — Research and Journal

Following explicit product-owner approval, the next frontend milestone adds two internal editorial sections:
- `research.html`: research purpose, dossier placement, study pathways, and research principles.
- `journal.html`: journal masthead, featured essay placement, editorial formats, and publishing standards.

Both pages share the homepage's bilingual navigation and visual system. Their featured titles and descriptive copy are clearly marked as structural placeholders; they do not represent published research, articles, or verified facts. No CMS, submission form, user account, database, or publishing workflow has been implemented.

The detailed page rationale, responsive behavior, content model boundaries, and open decisions are recorded in `docs/07-research-journal-design.md`.
