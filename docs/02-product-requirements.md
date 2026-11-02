# Product Requirements — Homepage Milestone

**Status:** Initial implementation baseline; confirm against approved source PRD before production launch.

## 1. Goal

Communicate the identity and purpose of the Contemporary Art Study Group and invite relevant audiences to engage, in Persian and English.

## 2. In-scope homepage sections

1. **Global header:** bilingual wordmark, primary in-page navigation, language switch.
2. **Hero:** concise positioning statement and editorial visual.
3. **About:** explain the group's independent, research-led identity.
4. **Areas of focus:** research and writing; documentation and archive; dialogue and exchange.
5. **Editorial statement:** communicate the value of plural perspectives.
6. **Participation/contact:** invite researchers, writers, and art practitioners to get in touch.
7. **Footer:** project identity and copyright year.

## 3. Language behavior

- Persian is the initial language, with `lang=fa` and `dir=rtl`.
- English is available from the language control, with `lang=en` and `dir=ltr`.
- The language switch updates visible copy, page direction, document language, title, and description.
- Text is stored as language-specific strings in the markup for this static milestone. A future content-management layer must support independent Persian and English editorial records.

## 4. Responsive behavior

- Desktop: editorial two-column hero and multi-column focus cards.
- Tablet: stacked hero with responsive focus grid.
- Mobile: compact header with collapsible navigation, single-column content, touch-friendly controls.
- No horizontal overflow at narrow viewport widths.

## 5. Accessibility requirements

- Semantic landmarks and heading hierarchy.
- Skip link to main content.
- Keyboard-operable language and menu controls.
- State exposed through `aria-expanded` and `aria-pressed`.
- Descriptive document metadata and reduced-motion accommodation.
- Decorative shapes are CSS and must not be mistaken for actual artworks.

## 6. Out of scope

- User registration, authentication, and user profiles.
- Article or project submission forms.
- Editorial review workflow or admin dashboard.
- Curator, artist, gallery, museum, exhibition, or opportunity directories.
- Search, filtering, tagging, and public APIs.
- Database integration, file storage, analytics, payments, and deployment.
- Any real publication or claim about a real artist, gallery, museum, or exhibition.

## 7. Content and launch blockers

- The contact email in the prototype is explicitly a placeholder and must be replaced or removed.
- All editorial copy and terminology require owner/editorial review.
- Final identity assets, imagery, rights, and credits must be supplied/approved before launch.
- The original project PRD must be checked before treating this baseline as final.

## 8. Acceptance checklist

- [ ] Persian desktop reviewed.
- [ ] Persian mobile reviewed.
- [ ] English desktop reviewed.
- [ ] English mobile reviewed.
- [ ] Language switch correctly changes direction and document metadata.
- [ ] Mobile navigation opens, closes, and closes after anchor selection.
- [ ] Keyboard focus and reduced-motion behavior checked.
- [ ] Contact placeholder replaced or removed before public launch.
- [ ] Content and visual identity approved by owner.