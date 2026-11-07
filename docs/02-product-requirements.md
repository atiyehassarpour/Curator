# Product Requirements — Curator-led Contemporary Art Platform

**Product priority:** Curators are the primary subject and central discovery experience. Galleries, museums, exhibitions, research, and journal content exist to add context to curators' practices and professional networks.

## 1. Product goal

Build a bilingual Persian/English reference platform for discovering curators, understanding their intellectual approaches and professional histories, and tracing relationships between curators, exhibitions, artists, galleries, museums, and publications. The initial editorial focus is Iranian curators in an international context.

## 2. Information architecture and priority

1. **Curators (primary):** searchable directory and individual profiles.
2. **Exhibitions:** past, current, and upcoming exhibitions, linked to curators and participating artists.
3. **Galleries and Museums:** distinct, equally important institution types connected to curator profiles and exhibitions.
4. **Research and Journal:** essays, interviews, critical writing, and contextual research about curatorial practice and contemporary art.

## 3. Curator directory and profile requirements

- Bilingual searchable directory; filters may include practice type, geography, and research interests.
- Individual profile includes verified biography, education/professional roles where relevant, curatorial approach, research interests, selected exhibitions, projects, collaborations, publications, interviews, and approved external links.
- Exhibition records should link back to curator profiles and institution records.
- Each factual claim must be supported by a traceable source; record last-reviewed date and image credits/rights.
- Respect privacy, consent, attribution, and correction requests. Do not publish sensitive personal data or unverified claims.
- Never invent curator names, biographies, exhibitions, roles, dates, institutions, sources, or image credits. Empty states and structural templates must be clearly labeled.

## 4. Current implementation milestone

- Bilingual Curators directory page with search/filter interface scaffold and verified-content empty state.
- Individual curator profile page template, with clearly labeled structural placeholders.
- Homepage positioning and navigation updated to make Curators the primary entry point.
- Research and Journal remain contextual supporting sections.
- Search/filter controls are frontend scaffolding only until verified profile records are added; no backend or database is included.

## 5. Language behavior

- Persian uses `lang=fa` and `dir=rtl`; English uses `lang=en` and `dir=ltr`.
- Language switching updates page copy, direction, document language, page-specific title, metadata, and placeholders.
- Language preference persists between pages; explicit `?lang=fa` or `?lang=en` overrides stored preference.
- Persian and English versions require independent editorial review.

## 6. Responsive and accessibility requirements

- Responsive desktop, tablet, and mobile layouts with no horizontal overflow.
- Semantic landmarks, skip link, keyboard-operable navigation, visible focus, accessible labels, live result announcements, and reduced-motion support.
- Search inputs and filters must have explicit labels and localized placeholders.

## 7. Not implemented

- Verified live curator records, exhibition records, institution directories, CMS, database, authentication, contributor accounts, submission/review dashboard, file storage, analytics, public API, payments, and deployment.
- No paid services or cloud resources may be provisioned without explicit approval.

## 8. Content and launch blockers

- Curator records must be sourced and reviewed; image rights and consent must be confirmed.
- Contact email, final identity assets, imagery, and credits require owner approval.
- Directory filters must be connected to a validated content source before being represented as a complete live search experience.

## 9. Acceptance checklist

- [ ] Persian and English directory reviewed on desktop and mobile.
- [ ] Profile template reviewed in both languages and directions.
- [ ] Search and filter behavior tested with verified sample records before launch.
- [ ] No invented personal or institutional data.
- [ ] Sources, image rights, consent, and review dates recorded for every published profile.
- [ ] No deployment or paid infrastructure without explicit approval.
