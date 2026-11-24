# Changelog

## 1.0.0 — 2026-11-24

First independent release of **Dual Tone**, a CSS-only Pi Web theme.

- Two-tone navigation and chat: blue projects and user messages (`#172E47`,
  `#141E2B`, selected `#203D5C`), petrol-green sessions and agent messages
  (`#142522`, `#13221F`, selected `#20372F`).
- Compact, discreet event rows (12px label, 26px minimum height, transparent until
  hover or expansion).
- Selected project-row metadata uses `#AAB6C5` so small text keeps WCAG AA contrast
  on the deep blue selection.
- Namespaced `--dt-*` tokens; the official PI WEB Dark `--pi-*` palette is bundled
  byte-identically so plugins, including OpenSpec, keep their own appearance.
- Independent package and theme identity: npm `pi-web-dual-tone`, plugin `dual-tone`,
  theme `dual-tone`.
- Derived from Dark Contrast `preview/chat-hierarchy` commit `35f3577`; the original
  Dark Contrast package is unchanged.
