# Homepage Preview and Review Guide

This is a static HTML/CSS/JavaScript milestone. No build step, package installation, database, or cloud account is required.

## Run locally on Windows

1. Download or clone the repository and open the project folder in PowerShell.
2. Start Python's built-in static server:

```powershell
py -m http.server 8000
```

3. Open the following routes in a browser:

- Persian: `http://localhost:8000/?lang=fa`
- English: `http://localhost:8000/?lang=en`

Stop the server with `Ctrl+C`.

If the `py` command is unavailable but Python is installed, use `python -m http.server 8000`.

## Four-state visual review

Use browser developer tools and review each combination:

| Language | Viewport | Route |
|---|---:|---|
| Persian / RTL | 1440 × 900 | `/?lang=fa` |
| Persian / RTL | 390 × 844 | `/?lang=fa` |
| English / LTR | 1440 × 900 | `/?lang=en` |
| English / LTR | 390 × 844 | `/?lang=en` |

Also check the narrow 320px viewport for accidental horizontal scrolling.

## Interaction checklist

- Switch between Persian and English; verify direction, page title, and text all change.
- Reload each language route and verify the requested language is retained.
- At mobile width, open the menu, follow a section link, press Escape, and click outside the menu.
- Tab through interactive elements and confirm a visible focus indicator.
- Enable reduced motion in the operating system/browser and verify smooth scrolling and transitions are suppressed.
- Check that no horizontal scrollbar appears at 320px width.

## Before public launch

- Replace the placeholder email address in the participation section.
- Approve the final project name, logo, and domain.
- Review all Persian and English copy.
- Confirm image/artwork credits if CSS artwork is replaced with sourced images.

The GitHub Actions workflow runs source-level regression checks and JavaScript syntax checks. It does not replace browser-rendered visual review or a full accessibility audit.
