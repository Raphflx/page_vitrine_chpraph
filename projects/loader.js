// loader.js — Charge les projets depuis projects/*/data.json
//
// IMPORTANT : fetch() ne fonctionne pas sur file://
// Utilise un serveur local (ex. Live Server dans VS Code) pour voir les projets.
//
// Pour ajouter un projet :
//   1. Créer un dossier  projects/mon-projet/
//   2. Y placer          projects/mon-projet/data.json
//   3. Ajouter le slug   'mon-projet'  dans le tableau PROJECT_SLUGS ci-dessous

const PROJECT_SLUGS = [
  // 'exemple-vlan',
  // 'script-dhcp',
];

// Cartes de démonstration affichées si aucun projet n'est configuré
const DEMO_CARDS = [
  {
    title: 'Infrastructure VLAN',
    description: 'Segmentation réseau multi-site avec routage inter-VLAN et STP.',
    tags: ['Cisco', 'VLAN', 'STP'],
    gradient: 'linear-gradient(135deg, #1a0533 0%, #5b21b6 100%)',
  },
  {
    title: 'Script DHCP Python',
    description: 'Automatisation de la gestion des baux DHCP.',
    tags: ['Python', 'DHCP'],
    gradient: 'linear-gradient(135deg, #0a0a14 0%, #3730a3 100%)',
  },
  {
    title: 'Labo GNS3',
    description: 'Topologie OSPF multi-aire.',
    tags: ['GNS3', 'OSPF'],
    gradient: 'linear-gradient(135deg, #1c0a06 0%, #92400e 100%)',
  },
  {
    title: 'Monitoring réseau',
    description: 'Tableau de bord Grafana avec alertes SNMP et seuils personnalisés.',
    tags: ['Grafana', 'SNMP', 'Linux'],
    gradient: 'linear-gradient(135deg, #060d1a 0%, #1e3a5f 100%)',
  },
  {
    title: 'VPN Site-à-Site',
    description: 'Tunnel IPsec entre deux agences avec routage dynamique.',
    tags: ['IPsec', 'VPN', 'Cisco'],
    gradient: 'linear-gradient(135deg, #0d0a1a 0%, #4c1d95 100%)',
  },
];

function buildCard(p, isDemo = false) {
  const card = document.createElement('article');
  card.className = 'project-card' + (isDemo ? '' : ' reveal');

  const imageHTML = p.image
    ? `<figure class="project-card-image">
         <img src="${p.image}" alt="${p.title}" loading="lazy" width="400" height="225">
       </figure>`
    : `<figure class="project-card-image" style="background:${p.gradient || 'var(--surface)'}"></figure>`;

  const tagsHTML = p.tags?.length
    ? `<ul class="project-tags" role="list">
         ${p.tags.map(t => `<li class="tag">${t}</li>`).join('')}
       </ul>`
    : '';

  const linkHTML = p.link
    ? `<a href="${p.link}" class="project-card-link" target="_blank" rel="noopener noreferrer"
          aria-label="Voir ${p.title} sur GitHub">Voir le projet →</a>`
    : '';

  card.innerHTML = `
    ${imageHTML}
    <div class="project-card-body">
      <h3 class="project-card-title">${p.title}</h3>
      <p class="project-card-description">${p.description}</p>
      ${tagsHTML}
      ${linkHTML}
    </div>`;

  return card;
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (PROJECT_SLUGS.length === 0) {
    DEMO_CARDS.forEach(p => grid.appendChild(buildCard(p, true)));
    return;
  }

  const results = await Promise.allSettled(
    PROJECT_SLUGS.map(slug =>
      fetch(`projects/${slug}/data.json`).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
    )
  );

  results.forEach(result => {
    if (result.status === 'rejected') return;
    grid.appendChild(buildCard(result.value));
  });

  // Déclenche le scroll reveal sur les nouvelles cartes
  if (typeof revealObserver !== 'undefined') {
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
