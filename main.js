/* ============================================================
   main.js — Portfolio Interactivity
   ============================================================ */

// ── TAB MANAGEMENT ────────────────────────────────────────────

const openTabs = ['about.py'];
let activeTab = 'about.py';

const fileLanguageMap = {
  'about.py':           'Python',
  'experience.json':    'JSON',
  'skills.ts':          'TypeScript',
  'projects.jsx':       'JavaScript JSX',
  'education.md':       'Markdown',
  'contact.sh':         'Shell Script',
  'terminal':           'bash',
  'publications.bib':   'BibTeX',
  'certifications.yml': 'YAML',
  'honors.toml':        'TOML',
  'volunteering.md':    'Markdown',
};

const fileIconMap = {
  'about.py':           { icon: '🐍', cls: 'py' },
  'experience.json':    { icon: '{ }', cls: 'json' },
  'skills.ts':          { icon: 'TS', cls: 'ts' },
  'projects.jsx':       { icon: '⚛', cls: 'jsx' },
  'education.md':       { icon: '#', cls: 'md' },
  'contact.sh':         { icon: '$', cls: 'sh' },
  'terminal':           { icon: '>_', cls: 'term' },
  'publications.bib':   { icon: '📄', cls: 'bib' },
  'certifications.yml': { icon: '✓', cls: 'yml' },
  'honors.toml':        { icon: '🏆', cls: 'toml' },
  'volunteering.md':    { icon: '#', cls: 'md' },
};

function switchTab(filename) {
  if (!openTabs.includes(filename)) {
    openTabs.push(filename);
    addTab(filename);
  }
  setActiveTab(filename);
}

function setActiveTab(filename) {
  activeTab = filename;

  // Update tab visuals
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === filename);
  });

  // Update file items
  document.querySelectorAll('.file-item').forEach(f => {
    f.classList.toggle('active', f.dataset.file === filename);
  });

  // Update panels
  document.querySelectorAll('.code-panel').forEach(p => {
    p.classList.toggle('active', p.id === 'panel-' + filename);
  });

  // Update status bar language
  const statusFile = document.getElementById('statusFile');
  if (statusFile) statusFile.textContent = fileLanguageMap[filename] || 'Plain Text';

  // Update line numbers for active panel
  updateLineNumbers(filename);
}

function addTab(filename) {
  const tabBar = document.getElementById('tabBar');
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.tab = filename;
  tab.onclick = () => switchTab(filename);

  const info = fileIconMap[filename] || { icon: '📄', cls: '' };
  tab.innerHTML = `
    <span class="tab-icon ${info.cls}">${info.icon}</span>${filename}
    <span class="tab-close" onclick="closeTab(event, '${filename}')">×</span>
  `;
  tabBar.appendChild(tab);
}

function closeTab(e, filename) {
  e.stopPropagation();
  const idx = openTabs.indexOf(filename);
  if (idx === -1) return;
  openTabs.splice(idx, 1);

  const tab = document.querySelector(`.tab[data-tab="${filename}"]`);
  if (tab) tab.remove();

  if (activeTab === filename) {
    if (openTabs.length === 0) {
      showWelcome();
    } else {
      const next = openTabs[Math.max(0, idx - 1)];
      if (next) setActiveTab(next);
    }
  }
}

// ── WELCOME PANEL ──────────────────────────────────────────────

function showWelcome() {
  activeTab = null;

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));

  const welcome = document.getElementById('panel-welcome');
  if (welcome) welcome.classList.add('active');

  const statusFile = document.getElementById('statusFile');
  if (statusFile) statusFile.textContent = 'Welcome';
}

// ── ACCOUNTS POPOVER ──────────────────────────────────────────

function toggleAccounts(e) {
  if (e) e.stopPropagation();
  const popover = document.getElementById('accountsPopover');
  if (!popover) return;
  popover.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const popover = document.getElementById('accountsPopover');
  const trigger = document.getElementById('accountsTrigger');
  if (!popover || !popover.classList.contains('open')) return;
  if (popover.contains(e.target) || (trigger && trigger.contains(e.target))) return;
  popover.classList.remove('open');
});

// ── LINE NUMBERS ──────────────────────────────────────────────

function updateLineNumbers(filename) {
  const panel = document.getElementById('panel-' + filename);
  if (!panel) return;

  const lnContainer = panel.querySelector('.line-numbers');
  const codeArea = panel.querySelector('.code-area');
  if (!lnContainer || !codeArea) return;

  const lineHeight = 1.6 * 13; // matches your CSS (font-size 13px, line-height 1.6)

  const lineCount = Math.ceil(codeArea.scrollHeight / lineHeight);

  lnContainer.innerHTML = Array.from({ length: lineCount }, (_, i) =>
    `<div>${i + 1}</div>`
  ).join('');
}

// ── SIDEBAR TOGGLE ────────────────────────────────────────────

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

function toggleFolder(el) {
  const icon = el.querySelector('.folder-icon');
  const files = el.nextElementSibling;
  const isOpen = el.classList.toggle('open');
  icon.textContent = isOpen ? '▾' : '▸';
  if (files) files.style.display = isOpen ? 'block' : 'none';
}

function openTerminalIcon() {
  switchTab('terminal');
}

// ── SIDEBAR VIEW SWITCHING (Explorer / Search / Source Control) ─

let currentSidebarView = 'explorer';

function setSidebarView(view) {
  const sidebar = document.getElementById('sidebar');
  const isCollapsed = sidebar.classList.contains('collapsed');

  // Clicking the icon for the view that's already open collapses the sidebar
  if (!isCollapsed && currentSidebarView === view) {
    sidebar.classList.add('collapsed');
    document.querySelectorAll('.activity-icon[data-view]').forEach(icon => {
      icon.classList.toggle('active', icon.dataset.view === view);
    });
    return;
  }

  // Otherwise, open the sidebar (if needed) and switch to the requested view
  sidebar.classList.remove('collapsed');
  currentSidebarView = view;

  document.querySelectorAll('.activity-icon[data-view]').forEach(icon => {
    icon.classList.toggle('active', icon.dataset.view === view);
  });

  document.querySelectorAll('.sidebar-view').forEach(v => {
    v.classList.toggle('active', v.id === 'view-' + view);
  });

  if (view === 'search') {
    const input = document.getElementById('searchInput');
    if (input) {
      setTimeout(() => input.focus(), 50);
      if (!input.value) renderSearchResults(''); // show all sections by default
    }
  }

  if (view === 'scm') {
    renderExtensionProjects();
  }
  if (view === 'extensions') {
    // extensions view is static HTML, nothing to render
  }
}

// ── SEARCH ──────────────────────────────────────────────────────

// Index of every searchable section across the portfolio.
// Each entry maps to a file (tab) so clicking a result opens that file.
const searchIndex = [
  { file: 'about.py',           label: 'About — Summary',            text: 'Researcher and engineer digitalization AI algorithm development Freiburg Germany' },
  { file: 'experience.json',    label: 'Experience — Fraunhofer EMI', text: 'Fraunhofer EMI research assistant master thesis Johnson-Cook C45-N steel evolutionary algorithms' },
  { file: 'experience.json',    label: 'Experience — Hahn-Schickard', text: 'Hahn-Schickard research assistant OpenCV image processing micro-fluidic PyQt' },
  { file: 'experience.json',    label: 'Experience — Capgemini',      text: 'Capgemini Engineering internship full-stack e-commerce login dashboard Java Spring Boot' },
  { file: 'skills.ts',          label: 'Skills — AI / ML',            text: 'AI ML evolutionary algorithms deep learning computer vision image processing ML algorithms LLM APIs' },
  { file: 'skills.ts',          label: 'Skills — Programming Languages', text: 'Python TypeScript JavaScript Java C C++ SQL R Bash programming languages' },
  { file: 'skills.ts',          label: 'Skills — Python Ecosystem',   text: 'NumPy SciPy Pandas OpenCV PyQt Tkinter Matplotlib Seaborn Selenium PyTorch TensorFlow scikit-learn sklearn' },
  { file: 'skills.ts',          label: 'Skills — Web / Full-Stack',   text: 'React Vue.js Node.js HTML5 CSS Bootstrap MySQL REST APIs ArcGIS MQTT' },
  { file: 'skills.ts',          label: 'Skills — Simulation & CAD',   text: 'LS-Dyna Ansys HyperMesh SolidWorks Inventor Fusion 360' },
  { file: 'skills.ts',          label: 'Skills — DevOps & Tools',     text: 'Git GitLab CI Docker Linux Azure AZ-900 Postman' },
  { file: 'projects.jsx',       label: 'Projects — AI Parametrization Framework', text: 'AI parametrization Johnson-Cook material model C45-N steel evolutionary algorithms' },
  { file: 'projects.jsx',       label: 'Projects — Geospatial WebApp',  text: 'real-time geospatial web app React ArcGIS MQTT MySQL Fraunhofer EMI' },
  { file: 'projects.jsx',       label: 'Projects — Micro-Fluidic CV Pipeline', text: 'micro-fluidic computer vision OpenCV digital image correlation Hahn-Schickard' },
  { file: 'projects.jsx',       label: 'Projects — Engineer Desktop GUI Tool', text: 'Tkinter desktop GUI parametrization pipeline engineers' },
  { file: 'projects.jsx',       label: 'Projects — Bumper Materials',   text: 'design analysis bumper alternate materials ULTEM ABS polymers automotive' },
  { file: 'projects.jsx',       label: 'Projects — Retrofitting',       text: 'retrofitting autorickshaw IC engine electric conversion' },
  { file: 'projects.jsx',       label: 'Projects — UI Design',           text: 'efficiency enhancing user interface design application productivity' },
  { file: 'projects.jsx',       label: 'Projects — Campus Network',      text: 'fortified campus network packet tracer security reliability' },
  { file: 'projects.jsx',       label: 'Projects — Campus Cargo Wagon',  text: 'campus cargo companion wagon attachment two-wheelers' },
  { file: 'projects.jsx',       label: 'Projects — BAJA SAE ATV',        text: 'all-terrain vehicle BAJA SAE KCT Garage Team Blitzkrieg' },
  { file: 'projects.jsx',       label: 'Projects — Capgemini E-Commerce',text: 'e-commerce platform Capgemini login system account dashboard' },
  { file: 'education.md',       label: 'Education — M.Sc. Microsystems Engineering', text: 'Albert-Ludwigs-Universität Freiburg microsystems engineering masters' },
  { file: 'education.md',       label: 'Education — B.E. Automotive Engineering',    text: 'Kumaraguru College of Technology automotive engineering bachelor' },
  { file: 'publications.bib',   label: 'Publications',                text: 'analysis alternate material bumpers ULTEM ABS AI-driven parametrization material model C45-N steel publications' },
  { file: 'certifications.yml', label: 'Certifications',              text: 'Programming for Everybody Python 101 data science Python data structures AZ-900 Azure data visualization certifications' },
  { file: 'honors.toml',        label: 'Honors & Awards',             text: 'best outgoing student award general proficiency Mahatma Gandhi scholarship academic proficiency honors' },
  { file: 'volunteering.md',    label: 'Volunteering',                text: 'volunteer DGM German Society Materials Science ICM intercultural mentoring Freiburg SAEINDIA SIA cybersecurity human rights volunteering' },
  { file: 'contact.sh',         label: 'Contact',                     text: 'contact reach out location open to full-time roles research positions collaborations' },
];

function runSearch(query) {
  renderSearchResults(query);
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;

  const q = query.trim().toLowerCase();
  const matches = q
    ? searchIndex.filter(item => item.text.toLowerCase().includes(q) || item.label.toLowerCase().includes(q))
    : searchIndex; // empty query → show every section so the user can browse in

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty">No results found.</div>`;
    return;
  }

  const meta = q
    ? `<div class="search-result-meta">${matches.length} result${matches.length === 1 ? '' : 's'} in ${new Set(matches.map(m => m.file)).size} file${new Set(matches.map(m => m.file)).size === 1 ? '' : 's'}</div>`
    : `<div class="search-result-meta">All sections — type to filter</div>`;

  resultsEl.innerHTML = meta + matches.map(item => {
    const info = fileIconMap[item.file] || { icon: '📄', cls: '' };
    const snippet = q ? highlightMatch(item.text, q) : '';
    return `
      <div class="search-result-item" onclick="goToSearchResult('${item.file}')">
        <div class="search-result-file"><span class="file-color ${info.cls}">${info.icon}</span>${item.label}</div>
        ${snippet ? `<div class="search-result-snippet">${snippet}</div>` : ''}
      </div>
    `;
  }).join('');
}

function highlightMatch(text, q) {
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text.slice(0, 80);
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + q.length + 40);
  const before = (start > 0 ? '…' : '') + text.slice(start, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length, end) + (end < text.length ? '…' : '');
  return `${before}<mark>${match}</mark>${after}`;
}

function goToSearchResult(filename) {
  switchTab(filename);
  setSidebarView('explorer');
}

// ── SOURCE CONTROL — EXTENSION PROJECTS ──────────────────────────

const extensionProjects = [
  { name: 'AI Powered PDF Quiz Generator',          url: 'https://huggingface.co/spaces/muralikrishanth/pdf-quiz' },
  { name: 'Real-Time Signal Processing Platform',    url: 'https://huggingface.co/spaces/muralikrishanth/Signal_Processing' },
  { name: 'Image Caption Generator',                 url: 'https://huggingface.co/spaces/muralikrishanth/Meme_Generator' },
  { name: 'Design & Fabrication of All-Terrain Vehicle', url: 'https://garagekct.wordpress.com/2019/12/12/photogallery/' },
  { name: 'Android App — Personal Health Journal',  url: null },
  { name: 'Android App — Local Event Finder',        url: null },
  { name: 'The Notifier — Telegram Weather & News Bot', url: null },
];

function renderExtensionProjects() {
  const list = document.getElementById('scmList');
  const count = document.getElementById('scmCount');
  if (!list) return;

  count.textContent = extensionProjects.length;

  list.innerHTML = extensionProjects.map(p => `
    <div class="scm-item" onclick="${p.url ? `window.open('${p.url}','_blank')` : ''}">
      <span class="scm-item-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </span>
      <div class="scm-item-body">
        <div class="scm-item-name">${p.name}</div>
        <div class="scm-item-status">${p.url ? 'View extension →' : 'Private repository'}</div>
      </div>
    </div>
  `).join('');
}



// ── SKILLS DYNAMIC ────────────────────────────────────────────

const skillsData = [
  {
    category: 'AI / ML',
    items: ['Evolutionary Algorithms', 'Deep Learning', 'Computer Vision', 'Image Processing', 'Parameter Optimization', 'LLM APIs', 'ML Algorithms'],
    level: 'expert',
  },
  {
    category: 'Programming Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C / C++', 'SQL', 'R', 'Bash'],
    level: 'expert',
  },
  {
    category: 'Python Ecosystem',
    items: ['NumPy', 'SciPy', 'Pandas', 'OpenCV', 'PyQt', 'Tkinter', 'Matplotlib', 'Seaborn', 'Selenium', 'PyTorch', 'TensorFlow', 'scikit-learn'],
    level: 'expert',
  },
  {
    category: 'Web / Full-Stack',
    items: ['React', 'Vue.js', 'Node.js', 'HTML5', 'CSS', 'Bootstrap', 'MySQL', 'REST APIs', 'ArcGIS', 'MQTT'],
    level: 'proficient',
  },
  {
    category: 'Simulation & CAD',
    items: ['LS-Dyna', 'Ansys', 'HyperMesh', 'SolidWorks', 'Inventor', 'Fusion 360'],
    level: 'proficient',
  },
  {
    category: 'DevOps & Tools',
    items: ['Git / GitLab CI', 'Docker', 'Linux', 'Azure (AZ-900)', 'Postman'],
    level: 'proficient',
  },
];

function renderSkills() {
  const grid = document.getElementById('skillGrid');
  if (!grid) return;

  grid.innerHTML = skillsData.map(s => `
    <div class="skill-card">
      <div class="skill-card-header">
        <span class="skill-cat">${s.category}</span>
        <span class="skill-level ${s.level}">${s.level}</span>
      </div>
      <div class="skill-tags">
        ${s.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ── PROJECTS DYNAMIC ──────────────────────────────────────────

const projectsData = [
  {
    name: 'AI Parametrization Framework',
    type: 'ai',
    typeLabel: 'AI / Optimization',
    desc: 'AI-driven calibration of the Johnson-Cook material model for C45-N steel. Evolutionary Algorithms automated the full parameter optimization pipeline — normally a weeks-long manual process.',
    stack: ['Python', 'NumPy', 'SciPy', 'LS-Dyna', 'Ansys', 'Linux'],
    metric: '90%+ reduction in manual calibration effort, 20 iterations to convergence',
  },
  {
    name: 'Real-Time Geospatial WebApp',
    type: 'web',
    typeLabel: 'Web / GIS',
    desc: 'Live geospatial monitoring platform for Fraunhofer EMI. Built with React, ArcGIS Pro, and MQTT for real-time data ingestion and visualization. Full-stack MySQL interface for multi-department data access.',
    stack: ['React', 'ArcGIS Pro', 'MQTT', 'MySQL', 'TypeScript', 'Vue.js'],
    metric: '70% reduction in data retrieval complexity',
  },
  {
    name: 'Micro-Fluidic CV Pipeline',
    type: 'cv',
    typeLabel: 'Computer Vision',
    desc: 'Custom 2D image processing system for micro-fluidic analysis at Hahn-Schickard. Implemented Digital Image Correlation (DIC), edge detection, and automated pressure measurement.',
    stack: ['Python', 'OpenCV', 'NumPy', 'SciPy', 'PyQt', 'Matplotlib'],
    metric: '85% accuracy improvement, 99% noise-free data',
  },
  {
    name: 'Engineer Desktop GUI Tool',
    type: 'tools',
    typeLabel: 'Desktop Tools',
    desc: 'Tkinter-based desktop GUI wrapping the full AI parametrization pipeline. Non-coding engineers can run complex simulation + optimization workflows with zero terminal knowledge.',
    stack: ['Python', 'Tkinter', 'Selenium', 'Linux', 'JSON'],
    metric: 'Adopted by engineering team, zero code knowledge required',
  },
  {
    name: 'ATV — BAJA',
    type: 'tools',
    typeLabel: 'Hardware / Mechanical',
    desc: 'Full design, engineering and fabrication of an All-Terrain Vehicle for BAJA SAE 2020. Led all technical documentation and was core team member (Team Blitzkrieg, KCT).',
    stack: ['SolidWorks', 'Inventor', 'FEA', 'CAD/CAM', 'Automotive Engineering'],
    metric: 'Competition-ready vehicle from concept to build',
  },
  {
    name: 'E-Commerce Platform — Capgemini',
    type: 'web',
    typeLabel: 'Full-Stack',
    desc: 'Enterprise e-commerce application built as part of a 6-person team at Capgemini. Owned the login system and account dashboard modules end-to-end.',
    stack: ['Java', 'Spring Boot', 'MySQL', 'React.js', 'REST API'],
    metric: 'Delivered in agile sprints, enterprise-ready',
  },
  {
    name: 'Design and Analysis of Bumper with Alternate Materials',
    type: 'tools',
    typeLabel: 'Hardware / Mechanical',
    desc: 'Extensive research identified ULTEM and ABS polymers as promising materials for automotive bumper fascia. Rigorous testing validated their durability, impact resistance, and cost-effectiveness — a step toward sustainable automotive solutions.',
    stack: ['FEA', 'Material Science', 'CAD', 'Automotive Engineering'],
    metric: 'Validated durability, impact resistance & cost-effectiveness',
  },
  {
    name: 'Retrofitting — IC to Electric Autorickshaw Conversion',
    type: 'tools',
    typeLabel: 'Hardware / Mechanical',
    desc: 'Completed the conversion of an autorickshaw from an internal combustion (IC) engine to electric through retrofitting. Conducted a feasibility survey, then modified the mechanics and electrical systems for a seamless transition to electric power.',
    stack: ['Retrofitting', 'Electrical Systems', 'Automotive Engineering'],
    metric: 'Seamless IC-to-electric conversion, optimized performance & sustainability',
  },
  {
    name: 'Efficiency-Enhancing User Interface Design for Application',
    type: 'tools',
    typeLabel: 'UI / Productivity',
    desc: 'A productivity-focused user interface developed to streamline operations within the application, optimizing the productivity chain. Enables intuitive navigation and efficient task management.',
    stack: ['UI/UX Design', 'Workflow Optimization'],
    metric: 'Enhanced productivity across the operational chain',
  },
  {
    name: 'Fortified Campus Network: Security & Reliability',
    type: 'tools',
    typeLabel: 'Networking',
    desc: 'Constructed a sustainable campus network system using essential protocols via Packet Tracer, ensuring reliable data transmission and seamless connectivity across campus. Configurations tested and optimized via simulation.',
    stack: ['Cisco Packet Tracer', 'Networking', 'Protocols'],
    metric: 'Robust network infrastructure for campus-wide connectivity',
  },
  {
    name: 'Campus Cargo Companion: Wagon Attachment for Two-Wheelers',
    type: 'tools',
    typeLabel: 'Hardware / Mechanical',
    desc: 'A wagon meticulously dimensioned and seamlessly attachable to a two-wheeler, facilitating efficient load transportation within campus premises. Engineered for optimal balance, stability, and transit safety.',
    stack: ['CAD', 'Mechanical Design'],
    metric: 'Practical, campus-wide load transportation solution',
  },
];

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = projectsData.map(p => `
    <div class="project-card">
      <div class="proj-header">
        <div class="proj-name">${p.name}</div>
        <span class="proj-type ${p.type}">${p.typeLabel}</span>
      </div>
      <div class="proj-desc">${p.desc}</div>
      <div class="proj-stack">
        ${p.stack.map(t => `<span class="proj-tag">${t}</span>`).join('')}
      </div>
      ${p.metric ? `<div class="proj-metric">${p.metric}</div>` : ''}
    </div>
  `).join('');
}

// ── TERMINAL TYPING ANIMATION ─────────────────────────────────

function animateTerminal() {
  const lines = document.querySelectorAll('.term-line, .term-output, .term-git');
  lines.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 120 + 200);
  });
}

// ── INIT ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderProjects();

  // Init line numbers for default tab
  setTimeout(() => updateLineNumbers('about.py'), 50);

  // Animate panels on tab switch
  document.querySelectorAll('.file-item, .tab').forEach(el => {
    el.addEventListener('click', () => {
      const filename = el.dataset.file || el.dataset.tab;
      if (filename === 'terminal') {
        setTimeout(animateTerminal, 100);
      }
      setTimeout(() => updateLineNumbers(filename), 50);
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '1') { e.preventDefault(); switchTab('about.py'); }
    if ((e.ctrlKey || e.metaKey) && e.key === '2') { e.preventDefault(); switchTab('experience.json'); }
    if ((e.ctrlKey || e.metaKey) && e.key === '3') { e.preventDefault(); switchTab('skills.ts'); }
    if ((e.ctrlKey || e.metaKey) && e.key === '4') { e.preventDefault(); switchTab('projects.jsx'); }
    if ((e.ctrlKey || e.metaKey) && e.key === '5') { e.preventDefault(); switchTab('education.md'); }
  });

  // Status bar line/col tracker (cosmetic)
  const statusEl = document.querySelector('.status-right .status-item:last-of-type');
});