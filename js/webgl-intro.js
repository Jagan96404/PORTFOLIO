/* ==========================================================================
   WEBGL INTRO 3D SCENE (Three.js Particle System & Geometry Morphing)
   ========================================================================== */

function initIntroScene() {
  const canvas = document.getElementById('webgl-intro-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle System Parameters
  const particleCount = 2200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color('#00f0ff');
  const color2 = new THREE.Color('#ff007f');

  for (let i = 0; i < particleCount; i++) {
    // Generate spherical point cloud
    const radius = 10 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Point Cloud Material
  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleMesh = new THREE.Points(geometry, material);
  scene.add(particleMesh);

  // Central Glowing Polyhedron Wireframe
  const polyGeo = new THREE.IcosahedronGeometry(4, 2);
  const polyMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const polyhedron = new THREE.Mesh(polyGeo, polyMat);
  scene.add(polyhedron);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particleMesh.rotation.y = elapsedTime * 0.08;
    particleMesh.rotation.x = elapsedTime * 0.05;

    polyhedron.rotation.y = -elapsedTime * 0.2;
    polyhedron.rotation.z = elapsedTime * 0.15;

    // Pulse effect
    const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.08;
    polyhedron.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Simulated Loader Progress
  let progress = 0;
  const bar = document.getElementById('loader-bar-fill');
  const percentText = document.getElementById('loader-percent');
  const enterBtn = document.getElementById('btn-enter-exp');

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (percentText) percentText.textContent = 'SYSTEM READY 100%';
      if (bar) bar.style.width = '100%';

      setTimeout(() => {
        const loaderBox = document.getElementById('loader-container');
        if (loaderBox) loaderBox.style.display = 'none';
        if (enterBtn) enterBtn.classList.add('show');
      }, 400);
    } else {
      if (bar) bar.style.width = progress + '%';
      if (percentText) percentText.textContent = `LOADING SYSTEM ... ${progress}%`;
    }
  }, 120);

  // Camera Fly-Through on Enter Click
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.playSuccess();
      }

      // Animate Camera Fly-Through
      let flyStartTime = Date.now();
      const flyDuration = 1200;

      function flyThrough() {
        const elapsed = Date.now() - flyStartTime;
        const p = Math.min(elapsed / flyDuration, 1);
        camera.position.z = 25 - p * 35; // Fly through center

        if (p < 1) {
          requestAnimationFrame(flyThrough);
        } else {
          const introOverlay = document.getElementById('intro-overlay');
          if (introOverlay) introOverlay.classList.add('hidden');
        }
      }

      flyThrough();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.THREE) {
    initIntroScene();
  } else {
    window.addEventListener('load', initIntroScene);
  }
});
