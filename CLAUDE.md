# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for a Networking & Telecommunications student. Vanilla HTML/CSS/JS only — no frameworks, no build step. Open `index.html` directly in a browser to run it.

## Architecture

Single-page site. Key files once created:
- `index.html` — the only HTML page; all sections live here
- `assets/css/themes.css` — CSS custom properties for every color (both themes)
- `assets/css/style.css` — layout and component styles that consume `themes.css` variables
- `assets/js/main.js` — page logic (scroll, animations, etc.)
- `assets/js/theme.js` — dark/light toggle; writes `data-theme` on `<html>`
- `projects/loader.js` — fetches `data.json` from each `projects/*/` subfolder and injects project cards into the DOM

Theme switching is CSS-only at runtime: `[data-theme="dark"]` selectors in `themes.css` override the default light-mode variables. No JS class toggling.

## Adding a project

Create `projects/<slug>/data.json`:
```json
{
  "title": "Nom du projet",
  "description": "Description courte",
  "tags": ["VLAN", "Cisco", "Python"],
  "link": "https://github.com/...",
  "image": "assets/img/projects/<slug>.webp"
}
```
`projects/loader.js` discovers and loads these automatically.

## Code rules

- HTML must be semantic: `<section>`, `<article>`, `<nav>`, `<main>`
- Mobile-first responsive; breakpoints: 480 px / 768 px / 1200 px
- `data-theme` on `<html>` controls the active theme; default is light
- All images need `alt` text; focus states must be visible
- `const`/`let` only — no `var`
- 2-space indentation
- Images in `.webp` format
- All color values through CSS variables in `themes.css`, never hard-coded

## Validation

- HTML: https://validator.w3.org/
- Accessibility: https://wave.webaim.org/
