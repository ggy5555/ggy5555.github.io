# NEURO ARCHIVE — Scientific Editorial Design System

Version: 2.0 (UI/UX renewal) · Status: working design system
Scope: first-semester neuroscience learning archive ONLY.

## Design intent

This is an educational, interactive neuroscience archive, not a landing-page template.
The direction combines academic editorial hierarchy with the site's existing lavender
identity. Content is primary. Decoration earns its place by helping explain a brain
structure, show progress, or distinguish an actual research status.

### Principles

1. Preserve all existing learning text, quizzes, research data, URLs, and storage schemas.
2. Use a strong title and readable linear text instead of a decorative card for every section.
3. Prefer scientific diagrams and meaningful figures over arbitrary gradient blobs and icons.
4. One primary action per task; secondary actions should be visibly secondary.
5. Convey correctness, progress, and research status using text and shape as well as color.
6. Ship accessible keyboard, touch and reduced-motion experiences in light and dark mode.

## Architecture and CSS order

Existing stylesheets remain authoritative for original structure and interaction geometry:

    base.css → layout.css → components.css → (content.css or brainmap.css) →
    theme.css?v=20260914-3 → editorial.css?v=20261112-1

The final stylesheet intentionally overrides presentation. It MUST NOT change:
the percentage sizes/positions of the five brain regions, data-* attributes,
JS selectors, localStorage keys, quiz question structures, or page routes.
It is separated from theme.css to facilitate review and rollback. A future
consolidation should be a separate tested change, not part of the renewal.

## Tokens (light)

| Token | Value | Application |
| --- | --- | --- |
| --ea-paper | #FAF9FC | Page background |
| --ea-surface | #FFFFFF | Article surface |
| --ea-quiet | #F4F0FA | Supporting regions |
| --ea-ink | #26243A | Main text |
| --ea-secondary | #59566D | Secondary text |
| --ea-accent | #6253A5 | Controls and active highlights |
| --ea-accent-strong | #54468F | Body links and primary buttons |
| --ea-line | #E6E1ED | Dividers and outlines |
| --ea-focus | #8270C8 | Keyboard focus |
| --radius-sm / md / lg | .45rem / .75rem / 1rem | Components |

Dark variants are defined under :root[data-theme="dark"] in editorial.css.
Do not assume that a pastel text color has sufficient contrast on white.
Use the strong accent token for small link text and primary controls.
All semantic progress/status colors must be verified in both themes.

## Typography

- Korean/English body and interface: Noto Sans KR → platform/system sans fallbacks.
- Major editorial title: Noto Serif KR → Nanum Myeongjo → Georgia → serif.
- Serif used only for page headings and article-level H2, not forms or dense tables.
- Body: 16px, line-height ~1.75–1.85; readable copy <= 76ch when practical.
- Page H1: responsive ~36–58px; home title can be larger.
- Article H2: ~23–32px; H3: ~19px; metadata: ~12–14px.
- Font delivery: use font-display: swap through Google Fonts CSS; request only
  needed weights. Check Korean font fallback and performance before release.
- Open-source Noto fonts are distributed under the SIL Open Font License.
  No proprietary font binaries are added to this repository.

## Spacing and layout

- Rhythm: 8px increments with 4px for microspacing.
- Desktop content max: 1180px; readable article area: 1050px outer container,
  paragraphs limited to around 76ch.
- Desktop section padding: 52–92px; mobile: 32–52px.
- Mobile side gutters: 16px; desktop: 24px minimum.
- Content grids vary by purpose: editorial index, progress dashboard, chronological
  journal, and single-column article. Do not repeat a generic 3-card grid everywhere.

## Component rules

| Component | Rule |
| --- | --- |
| Primary button | Solid accessible purple, min-height 44px |
| Secondary button | Surface with border, no oversized shadow |
| Text action | Underline or explicit action wording |
| Input / Select | Visible field border, strong focus indicator |
| Card | Only for grouping distinct interactive or summary content |
| Table | Column headings; horizontal scrolling on narrow widths |
| Callout | Semantic left rule and concise supporting text |
| Quiz answers | State text + distinct boundaries; preserve explanations |
| Progress | Numeric completion and progress bar + live status feedback |
| Research journal | Date, stage/status, title, actual work, next action |
| Brain map | Preserve lobe geometry; labels and auxiliary accessible links |

## State, interactions, accessibility

- Hover must never be the only way to access information.
- Keyboard focus must have visible outline at least 3px on controls.
- Touch controls should target 44×44px where feasible; the auxiliary brain index
  provides a larger target where lobe shapes become small.
- Mobile brain interaction remains first-tap information / second-tap navigation.
- Navigation TOC uses aria-current="location" for the currently read section.
- Keep existing skip link, aria-live quiz/progress updates and confirmation dialog.
- Respect prefers-reduced-motion. Avoid parallax and long entrance transitions.
- Check contrast to WCAG AA: normal text >= 4.5:1 and large text >= 3:1.
  Browser-level and assistive-technology audits are part of release verification.

## Page patterns

- Home: one clear brain map CTA; editorial index for three content roles,
  numeric learning dashboard, linear learning routes, chronological recent records.
- Learning: intro + table of contents + bounded explanatory article sections,
  definitions and tables with readable rhythm.
- Atlas: preserve five brain-lobe links and JS; restyle selection/tooltip;
  add visible textual quick links with larger touch targets.
- Quiz: question, options, explanation, result have clear hierarchy and status.
- Research: chronology and source-stage clarity; local editor keeps JSON import,
  export and copy, and stores records in the existing browser schema.

## Immutable contracts

Local storage keys:
- neuro-archive-theme
- neuroArchive.learningProgress.v1
- neuroArchive.quizProgress.v1
- neuroArchive.quizSession.v1
- neuroArchive.records.v1

Data:
- data/quiz-questions.json
- data/search-index.json
- data/research-records.json
- data/references.json

URLs including *.html#anchor must remain stable, including legacy redirect pages.
The local storage keys and data file schemas are not part of this redesign.

## Reference synthesis (not copied assets)

- Quanta Magazine: editorial headline hierarchy and science-led illustrations.
- Our World in Data: dense but navigable text, search and structured information.
- BrainFacts 3D Brain: discoverable anatomy-to-explanation interaction.
- getdesign.md, Dribbble, 21st.dev, Recent and Noonnu: design exploration only.
No visual assets from another publisher are copied.

## Verification

Static: node scripts/validate-site.mjs, links/anchors, data integrity, source scan.
Browser: home (desktop/mobile), contents/TOC, brain map hover/focus/touch,
quiz answer and reload, progress completion and persistence, search,
record editor save/edit/export/import, keyboard tab order, light/dark,
reduced motion. CI validates the static command on PRs.
Comparative screenshots should be captured at 1440×900 and 390×844 on a
browser capable of executing the site; source review alone is not a visual test.
