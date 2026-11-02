# Technical Architecture — Initial Baseline

**Status:** Lightweight architecture for the homepage prototype. Not a final production architecture.

## 1. Repository baseline

- Repository: `atiyehassarpour/Curator`
- Default branch: `main`
- Feature branch: `feat/bilingual-homepage-and-docs`
- Initial delivery: static, dependency-free HTML/CSS/JavaScript homepage.
- No build system, framework, database, or server is introduced in this milestone.

## 2. Current file structure

```
.
├── index.html
├── styles.css
├── app.js
├── README.md
└── docs/
    ├── 01-project-brief.md
    ├── 02-product-requirements.md
    ├── 03-workflows-and-roadmap.md
    └── 04-technical-architecture.md
```

## 3. Frontend behavior

- Semantic HTML provides the page structure.
- CSS custom properties centralize the visual palette and typography.
- Responsive breakpoints adapt layout for tablet and mobile.
- JavaScript provides language switching, RTL/LTR updates, metadata updates, mobile navigation, and dynamic copyright year.
- No application state is persisted and no personal data is collected.

## 4. Proposed future content architecture (not implemented)

The eventual platform may require content entities such as:
- User and role
- Person and professional role
- Organization (with distinct gallery and museum types)
- Article/research contribution
- Language-specific content/translation
- Exhibition/project
- Opportunity/event
- Media asset and rights/credit record
- Editorial review and revision history

These are conceptual entities only. No schema, migration, database, API, authentication, or storage bucket has been created.

## 5. Future technical decisions requiring approval

The exact framework, database, object storage, authentication provider, hosting, email delivery, backup strategy, and monitoring provider must be selected after reviewing the owner's original technical architecture document and verifying current free-tier limits.

No paid resource may be provisioned without explicit approval. Free tiers can change; verify terms, quotas, data residency, exportability, and inactivity policies before selection.

## 6. Security and privacy baseline

- Never commit secrets, access tokens, credentials, or private user data.
- Validate and sanitize all future user-submitted content on the server.
- Enforce authorization on the server, not only in the interface.
- Apply least privilege and secure session handling.
- Establish retention, deletion, consent, and backup policies before collecting personal data.
- Validate upload type, size, storage permissions, malware risk, and image rights before enabling uploads.

## 7. Quality assurance

Before production:
- Test the four required language/device combinations.
- Check semantic structure, keyboard operation, focus visibility, contrast, and responsive overflow.
- Run HTML/CSS/JavaScript validation and cross-browser testing.
- Add automated tests and CI only after selecting the production stack.
- Review external font loading and provide sensible system-font fallbacks.

## 8. Known limitations

- Google Fonts currently load from an external provider; offline/system fallback fonts are defined.
- The hero and focus illustrations are abstract CSS compositions, not artwork reproductions.
- The contact email is placeholder content and must be confirmed.
- There is no backend, persistence, analytics, account system, or deployment configuration.
- Original technical architecture requirements must be reconciled before the next engineering milestone.