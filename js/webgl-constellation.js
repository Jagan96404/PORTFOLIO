/* ==========================================================================
   WEBGL SKILL CONSTELLATION NETWORK (Interactive Holographic Skill Graph)
   ========================================================================== */

const SKILLS_DATA = [
  { id: 'fullstack', name: 'Full-Stack Web', category: 'Web Engineering', level: 94, icon: '🌐', color: '#00f0ff', desc: 'Building responsive, interactive web applications and digital experiences with clean client/server logic.' },
  { id: 'python', name: 'Python Engineering', category: 'Utilities & Cyber', level: 92, icon: '🐍', color: '#00f5d4', desc: 'Developing automation tools, Scapy network analyzers, data-processing utilities, and rapid prototypes.' },
  { id: 'java', name: 'Java & Desktop', category: 'Core Language', level: 88, icon: '☕', color: '#ffb703', desc: 'Building desktop applications, database-driven software systems, and GUI applications with Java Swing.' },
  { id: 'cyber', name: 'Cybersecurity', category: 'Security & Risk', level: 90, icon: '🛡️', color: '#ff007f', desc: 'Network security, packet analysis, file integrity monitoring, password strength analysis, and threat detection.' },
  { id: 'datascience', name: 'Data Science & ML', category: 'Data & AI', level: 85, icon: '📊', color: '#8a2be2', desc: 'Data preprocessing, exploratory data analysis, machine learning concepts, and intelligent data systems.' },
  { id: 'sql', name: 'SQL & Databases', category: 'Data Management', level: 89, icon: '🗄️', color: '#3a86ef', desc: 'Experience with relational database design, SQL querying, SQLite integration, and application data management.' },
  { id: 'uiux', name: 'Frontend & UI/UX', category: 'Design Systems', level: 91, icon: '🎨', color: '#ff0055', desc: 'Crafting responsive user interfaces, glassmorphic visual designs, micro-animations, and user-focused layouts.' },
  { id: 'tools', name: 'Git & Developer Tools', category: 'Workflow & Tools', level: 93, icon: '🔧', desc: 'Proficiency with Git version control, GitHub collaboration, VS Code, REST APIs, and command-line interfaces.' }
];

function initConstellationScene() {
  const canvas = document.getElementById('webgl-constellation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  let width = canvas.width = parent.clientWidth || 600;
  let height = canvas.height = parent.clientHeight || 500;

  // Internal state
  let nodes = [];
  let selectedNode = null;
  let activeHoverNode = null;
  let draggedNode = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Laser beam energy pulses
  const pulses = [];
  for (let i = 0; i < 12; i++) {
    pulses.push({
      n1Idx: Math.floor(Math.random() * SKILLS_DATA.length),
      n2Idx: Math.floor(Math.random() * SKILLS_DATA.length),
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.008
    });
  }

  function setupNodes() {
    const w = canvas.width || parent.clientWidth || 600;
    const h = canvas.height || parent.clientHeight || 500;
    const radius = Math.min(w, h) * 0.32;

    nodes = SKILLS_DATA.map((skill, index) => {
      const angle = (index / SKILLS_DATA.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...skill,
        x: w / 2 + Math.cos(angle) * radius,
        y: h / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 26,
        pulse: Math.random() * Math.PI * 2
      };
    });

    selectedNode = nodes[0];
    updateInspector(selectedNode);
  }

  setupNodes();

  // Resize Handler
  function resizeCanvas() {
    const w = parent.clientWidth || 600;
    const h = parent.clientHeight || 500;
    if (w <= 0 || h <= 0) return;

    const oldW = canvas.width || w;
    const oldH = canvas.height || h;

    canvas.width = w;
    canvas.height = h;

    // Rescale node positions to fit new size
    if (nodes.length > 0) {
      nodes.forEach(node => {
        if (oldW > 0 && oldH > 0 && oldW !== w) {
          node.x = (node.x / oldW) * w;
          node.y = (node.y / oldH) * h;
        } else {
          const radius = Math.min(w, h) * 0.32;
          const idx = nodes.indexOf(node);
          const angle = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
          node.x = w / 2 + Math.cos(angle) * radius;
          node.y = h / 2 + Math.sin(angle) * radius;
        }
      });
    }
  }

  window.addEventListener('resize', resizeCanvas);

  // Mouse & Touch Interactivity
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const pos = getMousePos(e);
    if (draggedNode) {
      draggedNode.x = pos.x - dragOffsetX;
      draggedNode.y = pos.y - dragOffsetY;
      return;
    }

    activeHoverNode = null;
    nodes.forEach(node => {
      const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
      if (dist < node.radius + 8) {
        activeHoverNode = node;
      }
    });

    if (activeHoverNode) {
      canvas.style.cursor = 'pointer';
      if (window.customCursor) window.customCursor.setMode('laser');
    } else {
      canvas.style.cursor = 'default';
      if (window.customCursor) window.customCursor.resetMode();
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(e);
    nodes.forEach(node => {
      const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
      if (dist < node.radius + 8) {
        draggedNode = node;
        dragOffsetX = pos.x - node.x;
        dragOffsetY = pos.y - node.y;
        selectedNode = node;
        updateInspector(selectedNode);
        if (window.soundEngine) window.soundEngine.playSuccess();
      }
    });
  });

  window.addEventListener('mouseup', () => {
    draggedNode = null;
  });

  // Render Loop
  let rotationAngle = 0;

  function draw() {
    const w = canvas.width;
    const h = canvas.height;

    // Safety check: if canvas size was 0 during init, adjust now
    if ((w <= 50 || h <= 50) && parent.clientWidth > 50) {
      resizeCanvas();
    }

    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;

    // 1. Draw Background Holographic Grid & Orbit Rings
    rotationAngle += 0.003;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;

    // Concentric orbit guide circles
    const maxR = Math.min(w, h) * 0.35;
    [maxR * 0.4, maxR * 0.75, maxR].forEach(r => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshair axis lines
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX - maxR * 1.1, centerY);
    ctx.lineTo(centerX + maxR * 1.1, centerY);
    ctx.moveTo(centerX, centerY - maxR * 1.1);
    ctx.lineTo(centerX, centerY + maxR * 1.1);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. Central Fusion Energy Core
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18 + Math.sin(rotationAngle * 3) * 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
    ctx.restore();

    // Core Rotating Ring
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    // Connect nodes to central core
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 3. Draw Laser Network Lines between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

        if (dist < maxR * 1.6) {
          const alpha = (1 - dist / (maxR * 1.6)) * 0.45;
          const isConnectedToSelected = (n1 === selectedNode || n2 === selectedNode);

          ctx.strokeStyle = isConnectedToSelected
            ? `rgba(0, 240, 255, ${alpha + 0.3})`
            : `rgba(138, 43, 226, ${alpha})`;
          ctx.lineWidth = isConnectedToSelected ? 2 : 1;

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // 4. Draw Traveling Laser Energy Pulses
    pulses.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
        p.n1Idx = Math.floor(Math.random() * nodes.length);
        p.n2Idx = (p.n1Idx + 1 + Math.floor(Math.random() * (nodes.length - 1))) % nodes.length;
      }

      const n1 = nodes[p.n1Idx];
      const n2 = nodes[p.n2Idx];
      if (n1 && n2) {
        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }
    });

    // 5. Physics & Node Rendering
    nodes.forEach(node => {
      if (node !== draggedNode) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.03;

        // Soft boundary bounce inside canvas padding
        const pad = 45;
        if (node.x < pad || node.x > w - pad) node.vx *= -1;
        if (node.y < pad || node.y > h - pad) node.vy *= -1;
      }

      const isSelected = node === selectedNode;
      const isHovered = node === activeHoverNode;

      // Outer Pulsing Glow Aura
      ctx.save();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 6 + Math.sin(node.pulse) * 3, 0, Math.PI * 2);
      ctx.fillStyle = isSelected
        ? `${node.color}33`
        : isHovered
          ? 'rgba(255, 0, 127, 0.25)'
          : 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.restore();

      // Node Body Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#0b1329' : '#070914';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? node.color : isHovered ? '#ff007f' : 'rgba(255, 255, 255, 0.25)';
      ctx.shadowColor = isSelected ? node.color : 'transparent';
      ctx.shadowBlur = isSelected ? 15 : 0;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Circular Proficiency Arc
      ctx.save();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 3, -Math.PI / 2, -Math.PI / 2 + (node.level / 100) * Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Node Icon & Name Label
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.icon, node.x, node.y - 2);

      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
      ctx.fillText(node.name, node.x, node.y + node.radius + 14);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function updateInspector(node) {
  const icon = document.getElementById('inspector-icon');
  const title = document.getElementById('inspector-title');
  const category = document.getElementById('inspector-category');
  const desc = document.getElementById('inspector-desc');
  const bar = document.getElementById('inspector-level-bar');
  const percentText = document.getElementById('inspector-level-percent');

  if (icon) icon.textContent = node.icon;
  if (title) title.textContent = node.name;
  if (category) category.textContent = `// ${node.category.toUpperCase()}`;
  if (desc) desc.textContent = node.desc;
  if (bar) {
    bar.style.width = node.level + '%';
    bar.style.background = `linear-gradient(90deg, ${node.color || '#00f0ff'}, var(--accent-magenta))`;
  }
  if (percentText) {
    percentText.textContent = node.level + '% PROFICIENCY';
    percentText.style.color = node.color || 'var(--accent-cyan)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initConstellationScene();
});
