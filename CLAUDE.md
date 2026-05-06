# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for a Networking & Telecommunications student. Vanilla HTML/CSS/JS — no framework, no build step. Open `index.html` directly in a browser to run it.

## Architecture

Single-page site. Key files:
- `index.html` — the only HTML page; all sections live here
- `assets/css/themes.css` — CSS custom properties for every color (both themes)
- `assets/css/style.css` — layout and component styles that consume `themes.css` variables
- `assets/js/main.js` — all JavaScript interactions (theme toggle, nav menu, animations…)

No framework. No build step. No dependencies.

## Theme switching

Theme is controlled via a `data-theme` attribute on `<body>`, toggled by JavaScript. The chosen theme is persisted in `localStorage` so it survives page reloads.

```html
<!-- In index.html -->
<button id="theme-toggle" aria-label="Basculer le thème clair / sombre">...</button>
```

```js
// In assets/js/main.js
const toggle = document.getElementById('theme-toggle');
const stored = localStorage.getItem('theme') ?? 'light';
document.body.dataset.theme = stored;

toggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
});
```

```css
/* In themes.css */
:root, [data-theme="light"] { /* light mode variables */ }
[data-theme="dark"] { /* dark mode variables */ }
```

To avoid a flash of wrong theme (FOUC), add an inline `<script>` in `<head>` — **before** any CSS — that reads `localStorage` and sets `data-theme` immediately:

```html
<head>
  <script>
    document.documentElement.dataset.theme = localStorage.getItem('theme') ?? 'light';
  </script>
  <!-- stylesheets here -->
</head>
```

## Mobile nav menu

Controlled via JS by toggling a CSS class:

```js
const burger = document.getElementById('burger');
const nav = document.getElementById('main-nav');
burger.addEventListener('click', () => nav.classList.toggle('is-open'));
```

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

Prefer `IntersectionObserver` for scroll-driven entrance animations — better browser support than `animation-timeline: view()` and easier to control.

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('is-visible');
      observer.unobserve(el.target); // animate once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: none;
  }
}
```

## Code rules

- HTML must be semantic: `<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- Mobile-first responsive; breakpoints: 480 px / 768 px / 1200 px
- All images need `alt` text; focus states must be visible
- 2-space indentation
- Images in `.webp` format
- All color values through CSS variables in `themes.css`, never hard-coded
- JS files go in `assets/js/` — one file per concern, loaded with `defer`
- No JS frameworks, no bundler — plain ES modules if needed

## Interaction patterns

| Feature | Approach |
|---|---|
| Dark/light toggle | JS `data-theme` on `<body>` + `localStorage` |
| Mobile nav menu | JS `.classList.toggle('is-open')` |
| Accordion / FAQ | `<details>` / `<summary>` (CSS-native, no JS needed) |
| Tabs | JS + `aria-selected` for accessibility |
| Tooltips | CSS `:hover` / `:focus-visible` + `::after` pseudo-element |
| Smooth scroll | `scroll-behavior: smooth` on `html` |
| Scroll animations | `IntersectionObserver` |

## Validation

- HTML: https://validator.w3.org/
- Accessibility: https://wave.webaim.org/
- CSS: https://jigsaw.w3.org/css-validator/
