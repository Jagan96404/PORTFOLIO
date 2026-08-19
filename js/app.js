/* ==========================================================================
   APP MAIN CONTROLLER (Cursor, Interactions, Projects, Form & Notifications)
   ========================================================================== */

class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('custom-cursor');
    this.dot = document.getElementById('cursor-dot');
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;

    if (!this.cursor || !this.dot) return;

    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
      this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    this.render();
    this.initHoverEvents();
  }

  render() {
    this.x += (this.targetX - this.x) * 0.18;
    this.y += (this.targetY - this.y) * 0.18;
    if (this.cursor) {
      this.cursor.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(() => this.render());
  }

  setMode(mode) {
    if (!this.cursor) return;
    this.cursor.className = '';
    if (mode && mode !== 'ring') {
      this.cursor.classList.add(mode);
    }
  }

  resetMode() {
    if (!this.cursor) return;
    this.cursor.className = '';
  }

  initHoverEvents() {
    const interactables = 'button, a, input, textarea, .project-card, .timeline-node, .service-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactables)) {
        if (this.cursor) this.cursor.classList.add('hovering');
        if (window.soundEngine) window.soundEngine.playHover();
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactables)) {
        if (this.cursor) this.cursor.classList.remove('hovering');
      }
    });
  }
}

// Toast Notification Manager
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  if (window.soundEngine) window.soundEngine.playSuccess();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// 3D Card Tilt Matrix & Projects Interaction
const PROJECT_DETAILS = {
  'BrewVerse': {
    title: 'BrewVerse — Premium Coffee Experience',
    desc: 'A luxury-focused digital coffee web application designed around modern frontend engineering. Features an interactive glassmorphic UI, AI-inspired Coffee Sommelier, live shopping cart, table reservation system, dark/light mode toggle, and persistent client-side state.',
    tech: ['HTML5 / CSS3', 'JavaScript (ESNext)', 'Glassmorphism UI', 'Client Storage', 'AI Sommelier Logic'],
    code: `// BrewVerse - AI Sommelier Recommendation Logic\nfunction recommendBrew(flavorPreference, roastLevel) {\n  const menu = fetchCoffeeDatabase();\n  return menu.filter(item => \n    item.notes.includes(flavorPreference) && \n    item.roast === roastLevel\n  );\n}`
  },
  'Network Traffic Analyzer': {
    title: 'Network Traffic Analyzer & Live Cyber Dashboard',
    desc: 'A cybersecurity-focused Python application providing real-time network traffic visibility and telemetry. Uses Scapy for packet analysis, multi-threaded packet capturing, security alert triggering, and live metric visualization.',
    tech: ['Python 3', 'Scapy', 'Multi-Threading', 'Network Telemetry', 'Security Monitoring'],
    code: `# Scapy Live Packet Inspection Engine\nfrom scapy.all import sniff, IP, TCP\n\ndef packet_callback(packet):\n    if packet.haslayer(IP):\n        src = packet[IP].src\n        dst = packet[IP].dst\n        print(f"[+] Packet: {src} -> {dst} | Protocol: {packet[IP].proto}")\n\nsniff(filter="ip", prn=packet_callback, store=0)`
  },
  'Cybersecurity Projects Suite': {
    title: 'Cybersecurity Projects Suite & Risk Utilities',
    desc: 'Practical security tools exploring core cybersecurity concepts including File Integrity Monitoring (SHA-256 hashing), Password Strength Analyzers, Image Metadata Extraction, Threat Intelligence Collection, and Cyber-Risk Quantification.',
    tech: ['Python Security', 'SHA-256 Hashing', 'Integrity Monitor', 'Risk Analytics', 'CLI Tools'],
    code: `# File Integrity Monitoring Engine\nimport hashlib\n\ndef calculate_file_hash(filepath):\n    sha256 = hashlib.sha256()\n    with open(filepath, 'rb') as f:\n        while chunk := f.read(8192):\n            sha256.update(chunk)\n    return sha256.hexdigest()`
  }
};

function initProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (y / rect.height) * -20;
      const rotY = (x / rect.width) * 20;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    // Click trigger project detail modal with dynamic data
    card.addEventListener('click', () => {
      const cardTitleText = card.querySelector('.project-title')?.textContent || '';
      let matchKey = 'BrewVerse';
      if (cardTitleText.includes('Network')) matchKey = 'Network Traffic Analyzer';
      else if (cardTitleText.includes('Cybersecurity')) matchKey = 'Cybersecurity Projects Suite';

      const data = PROJECT_DETAILS[matchKey] || PROJECT_DETAILS['BrewVerse'];

      const modal = document.getElementById('project-modal');
      const modalTitle = document.getElementById('modal-project-title');
      const modalDesc = document.getElementById('modal-project-desc');
      const modalTech = document.getElementById('modal-tech-stack');
      const modalCode = document.getElementById('modal-code-snippet');

      if (modal && modalTitle) {
        modalTitle.textContent = data.title;
        if (modalDesc) modalDesc.textContent = data.desc;
        if (modalTech) {
          modalTech.innerHTML = data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
        }
        if (modalCode) modalCode.textContent = data.code;

        modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  });

  // Project Category Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      if (window.soundEngine) window.soundEngine.playClick();
    });
  });

  // Close project detail modal
  const modalClose = document.getElementById('project-modal-close');
  const modal = document.getElementById('project-modal');
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('terminal-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name')?.value || 'Guest';
    showToast(`Transmission received from ${name}! Transmitted to jaganjagxn@gmail.com.`, '🚀');
    form.reset();
  });
}

// Global Navigation & Controls Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.customCursor = new CustomCursor();
  initProjectCards();
  initContactForm();

  // Navigation Links
  document.querySelectorAll('.nav-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (window.appRouter && target) {
        window.appRouter.navigateTo(target);
      }
    });
  });

  // Audio Mute Toggle Button
  const muteBtn = document.getElementById('audio-toggle-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.init();
        const isMuted = window.soundEngine.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        showToast(isMuted ? 'Audio muted' : 'Audio synth enabled', isMuted ? '🔇' : '🔊');
      }
    });
  }

  // Theme Accent Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'light' ? '☀️' : '🌙';
      showToast(`Theme switched to ${next} mode`, '✨');
    });
  }
});
