# NEURO ARCHIVE — UI/UX Renewal Verification

Date: 2026-11-12 (Asia/Seoul)
Base branch: main (192bfd9a2c93f4b513b632769aab145c988c249b)
Feature branch: design/neuro-archive-editorial
Review: https://github.com/ggy5555/ggy5555.github.io/pull/1
CI evidence: https://github.com/ggy5555/ggy5555.github.io/actions/runs/43181386663

## Automated results — PASS

GitHub Actions job: validate; completed successfully on commit
e39953bea3ad7a9c7c848d638a5102a51ac1b52a.

- node scripts/validate-site.mjs — PASS
  - Required files: 35
  - HTML routes, internal links and anchors: 24 pages
  - Search index entries: 80
  - Quiz items: 45
  - Provided PDF reference entries: 8
  - Existing editorial prose constraints: PASS
- node scripts/validate-editorial.mjs — PASS
  - All theme-bearing pages link editorial.css
  - Design tokens, dark mode and reduced motion present
  - Brain quick links and TOC indication present
  - Protected localStorage key constants preserved
- Playwright/Chromium — 16/16 PASS; desktop and mobile runs.
  - 1440×900 desktop, 390×844 mobile.
  - Home brain-map CTA and live search.
  - Brainmap hover or first-touch details, five quick links, navigation.
  - Learning progress save/reload under original storage key.
  - Quiz answer feedback and resumed session after reload.
  - Record editor create/edit, JSON download, JSON import and persistence.
  - Theme switching, reload persistence, skip-link keyboard focus.
  - Horizontal overflow smoke test on six representative routes.
  - Before-and-after visual screenshots (each project profile).

## Before / After change inventory

| Area | Before (main) | After (feature branch) |
| --- | --- | --- |
| Home | Multiple pastel gradients, uniform promotional cards | Restrained paper surface, one brainmap focus, editorial lists and journal rows |
| Typography | Nunito-heavy headings, Noto Sans body | Noto Serif KR for major reading titles; Noto Sans KR for interface and body |
| Learning pages | Each section treated as a large elevated card | Article rhythm, fewer containers, bounded paragraphs, quieter borders |
| Navigation | TOC has anchors without reading-location styling | Existing anchors preserved; current reading section marked by aria-current |
| Brainmap | Five interactive lobes with tooltip/mobile description | Same lobes/JS; stronger focus/selection and five larger text links |
| Quiz & progress | Pastel feedback and highly rounded progress UI | Semantic answer labels, clear border distinctions, quiet progress styling |
| Research archive | Uniform grid cards | Date/stage/status-focused journal rows |
| Record editor | Inline-styled preview and grid cards | Tokenized preview, chronological record rows, same import/export logic |
| Dark mode | Decorative dark lavender gradient | Ink/quiet/surface tokens, improved semantic states |

The six representative pages were captured before (main) and after
(feature branch), for both desktop and mobile sizes: 6 × 2 × 2 = 24 PNGs.
Artifact: neuro-archive-visual-qa on the CI run above.
To view/download: open the GitHub Actions run and find the Artifacts section.

**Screenshot capture is automated, but aesthetic review of each PNG has not been
asserted as complete.** Browser automation verifies rendering and operation,
not editorial judgment.

## Protected behavior verified by review and tests

- Existing page URLs and fragment IDs: preserved.
- Existing learning material and research source JSON: unchanged.
- atlas click/focus/touch behavior: no changes to brainmap.js.
- search indexing: no changes to search.js or search-index.json.
- quiz behavior and question bank: no changes to quiz.js or quiz-questions.json.
- progress storage: no changes to progress.js.
- record storage and import/export: no changes to record-editor.js.
- theme storage: original key preserved in site.js.
- Production deployment: pages.yml still deploys main only.

## Manual release review remaining

Automated checks do not replace these final PR review tasks:
- Review all before/after PNGs for line breaks, visual density and typography.
- Check Windows/Android/Safari font loading and device-specific touch targets.
- Full keyboard/screen-reader walkthrough, zoom 200%, color contrast audit.
- Evaluate each nonrepresentative learning page and the 404/legacy redirects.
- Confirm production-like performance on a slow connection.

The draft PR must not be merged into main without explicit user approval.

## 2026-11-12 local typography revision

- Replaced previous Noto Serif KR / Noto Sans KR pairing with **SUITE Variable (display)** and **SUIT Variable (body)**.
- Added two locally hosted WOFF2 font assets, with original upstream SIL Open Font License 1.1 text and attribution.
- Removed the remote Google Fonts import from theme.css; the new typography layer loads from this repository.
- Added a browser test for actual font loading, family selection, binary validity, and zero Google Font requests.
- CI executes the existing static regression suite and all browser tests; live-site typography should be visually reviewed on a real device after merge.
