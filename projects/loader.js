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
    title: 'Socket Jump',
    description: "Jeux fait sur Godot engine dans le cadre d'un projet universitaire",
    tags: ['Jeux', 'GDscript'],
    image: 'assets/img/Socket_Jump.png',
  },
  {
    title: 'F1 Tracker',
    description: 'Suivie en temps réel des courses de F1 incluant toutes les données pertinentes',
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
  const tag = p.link ? 'a' : 'article';
  const card = document.createElement(tag);
  card.className = 'project-card' + (isDemo ? '' : ' reveal');

  if (p.link) {
    card.href = p.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `Voir ${p.title}`);
  }

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

  card.innerHTML = `
    ${imageHTML}
    <div class="project-card-body">
      <h3 class="project-card-title">${p.title}</h3>
      <p class="project-card-description">${p.description}</p>
      ${tagsHTML}
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
