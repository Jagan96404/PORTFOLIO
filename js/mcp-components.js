/* ==========================================================================
   21ST.DEV MCP COMPONENT REGISTRY & VIEWER
   ========================================================================== */

const MCP_REGISTRY = [
  {
    id: 'MagicNavbar',
    name: 'MagicNavbar / FloatingDock',
    section: 'Global Navigation',
    package: '@21st-dev/magic-navbar',
    command: 'npx 21st add magic-navbar',
    desc: 'Glassmorphism floating navigation bar with magnetic hover damping and active indicator glow.',
    snippet: `import { FloatingDock } from "@/components/21st/floating-dock";\n<FloatingDock items={navLinks} />`
  },
  {
    id: 'HeroGeometric',
    name: 'HeroGeometric & ShaderCanvas',
    section: 'Hero / About',
    package: '@21st-dev/hero-geometric',
    command: 'npx 21st add hero-geometric',
    desc: 'Real-time mouse-reactive WebGL GLSL displacement shader canvas.',
    snippet: `import { ShaderCanvas } from "@/components/21st/shader-canvas";\n<ShaderCanvas geometry="torus" glowColor="#00f0ff" />`
  },
  {
    id: 'TiltCard3D',
    name: 'TiltCard3D & DistortionGallery',
    section: 'Projects Showcase',
    package: '@21st-dev/tilt-card-3d',
    command: 'npx 21st add tilt-card-3d',
    desc: 'GPU-accelerated 3D hover matrix transform card with WebGL image distortion modal.',
    snippet: `import { TiltCard } from "@/components/21st/tilt-card";\n<TiltCard maxTilt={15} glareOpacity={0.4}>{projectData}</TiltCard>`
  },
  {
    id: 'ConstellationGraph',
    name: 'ConstellationGraph3D',
    section: 'Skills / Data Viz',
    package: '@21st-dev/constellation-graph',
    command: 'npx 21st add constellation-graph',
    desc: 'Interactive 3D physics node network connected by illuminated data laser lines.',
    snippet: `import { ConstellationGraph } from "@/components/21st/constellation";\n<ConstellationGraph nodes={skillsList} onSelectNode={handleNodeClick} />`
  },
  {
    id: 'TerminalContactForm',
    name: 'TerminalForm & MagneticCTA',
    section: 'Contact Terminal',
    package: '@21st-dev/terminal-contact',
    command: 'npx 21st add terminal-contact',
    desc: 'CLI inspired terminal contact portal with real-time JSON input preview and sound synthesis.',
    snippet: `import { TerminalForm } from "@/components/21st/terminal-form";\n<TerminalForm onSubmit={sendMsg} theme="cyberpunk" />`
  }
];

function initMCPRegistryViewer() {
  const modal = document.getElementById('mcp-modal-overlay');
  const closeBtn = document.getElementById('mcp-modal-close');
  const contentArea = document.getElementById('mcp-modal-body');
  const mcpBadgeBtns = document.querySelectorAll('.mcp-badge-btn');

  if (!modal || !contentArea) return;

  function renderRegistry() {
    contentArea.innerHTML = `
      <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: #fff; margin-bottom: 8px;">21st.dev MCP Component Registry</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Components utilized & recommended across each section of this portfolio:</p>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${MCP_REGISTRY.map(item => `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-muted); border-radius: var(--radius-md); padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-family: var(--font-display); color: var(--accent-cyan); font-size: 1.2rem;">${item.name}</h3>
              <span style="font-family: var(--font-code); font-size: 0.75rem; background: rgba(138, 43, 226, 0.2); border: 1px solid var(--accent-purple); color: #fff; padding: 4px 10px; border-radius: 999px;">${item.section}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 12px;">${item.desc}</p>
            <div style="background: #050711; border: 1px solid #1a2238; border-radius: 6px; padding: 12px; font-family: var(--font-code); font-size: 0.8rem; color: var(--accent-gold); margin-bottom: 10px;">
              $ ${item.command}
            </div>
            <pre style="background: #080a14; border: 1px solid var(--border-muted); border-radius: 6px; padding: 12px; font-family: var(--font-code); font-size: 0.78rem; color: var(--text-main); overflow-x: auto;"><code>${item.snippet}</code></pre>
          </div>
        `).join('')}
      </div>
    `;
  }

  mcpBadgeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderRegistry();
      modal.classList.add('active');
      if (window.soundEngine) window.soundEngine.playClick();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMCPRegistryViewer();
});
