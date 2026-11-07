# Research and Journal — Design and Content Specification

**Approved scope:** First internal-section milestone after the homepage.  
**Implementation:** Static bilingual HTML/CSS/JavaScript.  
**Pages:** `research.html`, `journal.html`, shared `sections.css`, shared global navigation/language behavior in `app.js`.

## 1. Design direction

Continue the approved Global Art Intelligence direction:
- Art-journal editorial character with generous whitespace and asymmetric layouts.
- Warm paper background, ink typography, restrained rust, slate-blue, and ochre accents.
- Vazirmatn for Persian, DM Sans for interface text, and Cormorant Garamond for expressive English display typography.
- CSS-only abstract compositions; these are visual devices, not representations of actual artworks.
- Shared site header, language control, navigation, and footer.

## 2. Research page

### User goal
Understand the group's research purpose, identify thematic pathways, and understand the standards expected of research contributions.

### Page hierarchy
1. **Hero:** research positioning and concise explanation of the approach.
2. **Featured dossier placement:** an editorial feature slot demonstrating the future presentation of multi-part research.
3. **Research pathways:** historiography and memory; art and cultural geographies; documentation methods.
4. **Research commitment:** sources, transparent references, image rights, and distinction between evidence and interpretation.
5. **Contribution CTA:** directs visitors to the homepage participation/contact section.

### Content boundary
The featured dossier title and copy are explicitly structural placeholders. No actual research, citations, dates, researchers, or findings are claimed.

## 3. Journal page

### User goal
Understand the journal's editorial identity, expected content formats, and standards for publication.

### Page hierarchy
1. **Journal masthead:** title, editorial positioning, and issue-development label.
2. **Featured essay placement:** a visual preview of a future lead essay.
3. **Editorial formats:** essay; conversation; reading and review.
4. **Editorial standard:** traceable sources, evidence vs interpretation, independent Persian/English review, and image-rights records.
5. **Editorial CTA:** directs visitors to the homepage for project context and contact.

### Content boundary
The lead title and copy are layout placeholders, not a published essay. No author, publication date, issue number, or real article metadata is invented.

## 4. Bilingual and navigation behavior

- Each page is authored with Persian as the default language and supports English through the shared language switch.
- Document direction and language change together.
- Page title and meta description are page-specific in both languages.
- Language selection is retained between pages using local storage; an explicit `?lang=fa` or `?lang=en` query parameter takes precedence.
- Shared navigation links the homepage, Research, and Journal. Active page is exposed using `aria-current="page"`.
- Mixed-direction Latin identifiers and English labels are visually isolated where necessary.

## 5. Responsive and accessibility behavior

- Desktop: asymmetric hero and feature compositions, editorial list rows, and large type.
- Tablet: hero and feature areas stack; content remains spacious.
- Mobile: single-column compositions, compact feature visuals, stacked metadata, and responsive list rows.
- Visible focus, semantic headings, skip link, keyboard-operable navigation, Escape/outside-click close behavior, and reduced-motion styles are preserved.
- All interactive links should lead to a real page or a meaningful section; placeholder content is not represented as a live article link.

## 6. Engineering and validation

- Static implementation requires no new dependencies or backend.
- Regression tests cover unique IDs, in-page anchors, bilingual page metadata, navigation structure, preview labeling, and responsive/reduced-motion CSS.
- GitHub Actions runs JavaScript syntax checks and all Node built-in tests.
- Browser-rendered screenshot QA across Persian/English desktop/mobile and narrow 320px widths remains a manual review task.
- No accessibility-compliance claim is made without browser and assistive-technology testing.

## 7. Open decisions

- Approve final terminology for Research, Journal, dossier, essay, and editorial formats.
- Confirm final page names and URL slugs.
- Approve the actual editorial taxonomy and whether journal issues are organized by theme, date, or both.
- Supply real editorial content, author metadata, references, image assets, and rights/credits before publication.
- Confirm the official contact route; the current homepage email remains a placeholder.
- Reconcile these pages with the owner's original approved source documents before production.

## 8. Cost and scope

No CMS, database, account system, cloud storage, analytics, paid service, deployment, or recurring-cost infrastructure has been added. The pages are static frontend prototypes.
