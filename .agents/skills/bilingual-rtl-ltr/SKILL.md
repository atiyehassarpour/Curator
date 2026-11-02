---
name: bilingual-rtl-ltr
description: Build and review genuinely bilingual Persian RTL and English LTR experiences. Use for localization, translation architecture, directionality, typography, layout, and bilingual QA.
---

# Bilingual RTL/LTR

Persian and English are first-class product languages with equal visual and functional quality.

## Implementation rules
- Persian pages use correct RTL document direction and English pages use LTR. Set language and direction at the appropriate document/layout boundary.
- Do not simulate RTL by right-aligning text alone.
- Prefer logical CSS properties (inline-start/end, block-start/end) over hard-coded left/right.
- Isolate mixed-direction content such as URLs, email addresses, Latin names, codes, and identifiers with appropriate bidi handling.
- Use locale-aware date, number, and punctuation formatting.
- Ensure navigation order, icons, breadcrumbs, forms, and responsive composition are directionally correct.

## Translation
- Do not invent translations for official names, artworks, organizations, or specialist terminology.
- Maintain a glossary for recurring curatorial and art-history terms.
- Preserve meaning and tone rather than translating word-for-word.
- Keep translation status independent from source-language publication status.
- Machine translations require human editorial review before publication.

## QA
Test Persian desktop, Persian mobile, English desktop, and English mobile. Include long headings, mixed scripts, numerals, punctuation, forms, keyboard navigation, and text expansion. Report unresolved language or typography limitations.
