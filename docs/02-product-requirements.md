# Product Requirements — Homepage, Research, and Journal

**Status:** Approved implementation scope for the first public-facing sections; validate copy and content against the owner's source documents before launch.

## 1. Product goal

Communicate the identity of the Contemporary Art Study Group and provide clear entry points into research-led and editorial content in Persian and English.

## 2. Implemented page scope

### Homepage
1. Global header, bilingual wordmark, navigation, and language switch.
2. Hero and project positioning.
3. About and areas of focus.
4. Editorial statement.
5. Participation/contact invitation and footer.

### Research
1. Research-oriented hero and purpose statement.
2. Featured dossier placement, clearly identified as a structural placeholder until editorial content is approved.
3. Research pathways: historiography and memory; art and cultural geographies; documentation methods.
4. Research principles and source/rights expectations.
5. Link to participation/contact information.

### Journal
1. Editorial masthead and journal positioning.
2. Featured essay placement, clearly identified as a layout preview and not a published article.
3. Editorial formats: essays, conversations, and critical readings/reviews.
4. Editorial standards covering sources, evidence vs interpretation, independent bilingual review, and image rights.
5. Link to participation/contact information.

## 3. Language behavior

- Persian uses `lang=fa` and `dir=rtl`; English uses `lang=en` and `dir=ltr`.
- Language switching updates page copy, direction, document language, page-specific title, and description.
- The chosen language is retained between pages through local storage; explicit `?lang=fa` or `?lang=en` overrides the stored preference.
- Persian and English editorial content are separate versions. Translation status and publication approval are independent.

## 4. Responsive behavior

- Desktop uses an editorial grid, asymmetric compositions, and generous whitespace.
- Tablet and mobile layouts are intentionally re-composed, not merely scaled down.
- Navigation collapses into a keyboard-operable menu on narrow screens.
- Content rows, feature areas, and headings reflow without horizontal overflow.

## 5. Accessibility requirements

- Semantic landmarks and heading hierarchy.
- Skip link to main content.
- Keyboard-operable language and menu controls with state exposed through `aria-expanded` and `aria-pressed`.
- Visible focus treatment, readable contrast, and reduced-motion accommodation.
- Decorative CSS compositions are labeled as abstract visuals and must not be mistaken for real artworks.
- Links that represent future editorial content are not presented as working article records.

## 6. Not implemented / out of scope

- User registration, authentication, and profiles.
- Article submission forms and editorial review dashboard.
- Database, CMS, file storage, search backend, public APIs, analytics, payments, and deployment.
- Verified people, gallery, museum, exhibition, opportunity, or event directories.
- Actual published research or journal articles; all feature examples remain placeholders until approved content and sources exist.

## 7. Content and launch blockers

- Contact email remains a placeholder and must be replaced or removed before public launch.
- All Persian and English copy and terminology require owner/editorial review.
- Final identity assets, imagery, rights, and credits must be supplied/approved before launch.
- The original approved project documents must be reconciled before production decisions.

## 8. Acceptance checklist

- [ ] Persian desktop reviewed for homepage, Research, and Journal.
- [ ] Persian mobile reviewed for homepage, Research, and Journal.
- [ ] English desktop reviewed for homepage, Research, and Journal.
- [ ] English mobile reviewed for homepage, Research, and Journal.
- [ ] Language switch changes direction, page title, and page-specific metadata.
- [ ] Language preference persists when navigating between pages.
- [ ] Mobile navigation opens/closes by button, Escape, and outside click.
- [ ] Keyboard focus and reduced-motion behavior checked.
- [ ] Placeholder editorial content and contact details reviewed before launch.
- [ ] Content and visual identity approved by owner.
