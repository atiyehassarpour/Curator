# Automated Browser and Visual QA

The project includes Playwright checks for the homepage, Research, and Journal in Persian (RTL) and English (LTR).

## Run on Windows

From the repository root in PowerShell:

```powershell
npm install
npx playwright install chromium
npm run test:visual
```

Playwright starts the included Node static server automatically at `http://127.0.0.1:8000` and stops it after the run. No Python installation, database, deployment, cloud service, or paid account is required. Node.js and npm are required.

## What is checked

- All three pages load in both languages.
- The document language and text direction match the selected language.
- Browser runtime errors are collected and cause the test to fail.
- No horizontal page overflow at desktop (1440px), mobile (390px), or narrow mobile (320px).
- The mobile navigation opens and closes with Escape when the menu control is present.
- Full-page screenshots are saved for each page/language combination at desktop and mobile sizes.

## Screenshot output

Screenshots and Playwright diagnostics are written under `test-results/`. Each screenshot is named with its page, language, and viewport, for example `research-fa-mobile.png`.

## GitHub Actions

The project quality workflow installs Chromium, runs the existing Node regression tests, then runs the browser suite. It uploads screenshots, traces, and the HTML report as the `site-visual-qa` artifact, retained for 14 days. Open the successful or failed workflow run in GitHub Actions and download that artifact to inspect the rendered pages.

The screenshots are captured automatically; they are not yet compared against approved reference images. This milestone verifies rendering, direction, runtime stability, responsive overflow, and basic mobile navigation. A full WCAG audit and human editorial/design approval remain separate review steps.
