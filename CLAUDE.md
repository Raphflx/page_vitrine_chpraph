# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for a Networking & Telecommunications student. Vanilla HTML/CSS only — no JavaScript whatsoever. Open `index.html` directly in a browser to run it.

## Architecture

Single-page site. Key files:
- `index.html` — the only HTML page; all sections live here
- `assets/css/themes.css` — CSS custom properties for every color (both themes)
- `assets/css/style.css` — layout and component styles that consume `themes.css` variables

No JavaScript files. No build step. No dependencies.

## Theme switching

Theme is controlled entirely with CSS using the `:has()` selector and a hidden checkbox input:

```html
<!-- In index.html, at the very top of <body> -->
<input type="checkbox" id="theme-toggle" class="theme-checkbox" aria-label="Basculer le thème clair / sombre">

<!-- Toggle button anywhere in the page -->
<label for="theme-toggle" class="theme-label" aria-hidden="true">...</label>
```

```css
/* In themes.css */
:root { /* light mode variables */ }

.theme-checkbox:checked ~ * { /* or body when checkbox is sibling */
  /* dark mode variables override */
}
```

The `data-theme` attribute approach from the previous version is **not used** — it required JS. The checkbox trick is pure CSS.

## Adding a project

Add a new `<article class="project-card">` block directly in `index.html` inside `#projectsGrid`. No loader script, no JSON files.

```html
<article class="project-card">
  <figure class="project-card-image">
    <img src="assets/img/projects/<slug>.webp" alt="Description du projet" loading="lazy" width="400" height="225">
  </figure>
  <div class="project-card-body">
    <h3 class="project-card-title">Nom du projet</h3>
    <p class="project-card-description">Description courte.</p>
    <ul class="project-tags" role="list">
      <li class="tag">Tag1</li>
      <li class="tag">Tag2</li>
    </ul>
  </div>
</article>
```

If the project links somewhere, wrap the `<article>` in an `<a>` with `target="_blank" rel="noopener noreferrer"`.

## Animations / scroll effects

No JS scroll observers. Use CSS `@keyframes` with `animation-timeline: view()` (scroll-driven animations) or `animation-delay` with `animation-fill-mode: both` for entrance effects on load. Fallback gracefully for browsers that don't support scroll-driven animations.

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    animation: fade-up 0.5s ease both;
    animation-timeline: view();
    animation-range: entry 0% entry 30%;
  }
}
```

## Code rules

- HTML must be semantic: `<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- Mobile-first responsive; breakpoints: 480 px / 768 px / 1200 px
- **No JavaScript** — every interactive feature must be solved with HTML + CSS only
- All images need `alt` text; focus states must be visible
- 2-space indentation
- Images in `.webp` format
- All color values through CSS variables in `themes.css`, never hard-coded
- Use `<a>` for navigation/links, `<button>` equivalent via `<label>` for toggle controls
- `loading="lazy"` on all images below the fold

## CSS-only interaction patterns

| Feature | CSS approach |
|---|---|
| Dark/light toggle | Hidden `<input type="checkbox">` + `<label>` + `:checked` sibling selector |
| Mobile nav menu | Hidden `<input type="checkbox">` + `:checked ~ nav` |
| Accordion / FAQ | `<details>` / `<summary>` elements |
| Tabs | Hidden radio inputs + `:checked` + adjacent sibling selectors |
| Tooltips | `:hover` / `:focus-visible` + `::after` pseudo-element |
| Smooth scroll | `scroll-behavior: smooth` on `html` |
| Scroll animations | `animation-timeline: view()` (scroll-driven) |

## Validation

- HTML: https://validator.w3.org/
- Accessibility: https://wave.webaim.org/
- CSS: https://jigsaw.w3.org/css-validator/
