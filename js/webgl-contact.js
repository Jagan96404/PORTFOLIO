/* ==========================================================================
   WEBGL CONTACT 3D SCENE (Audio-Reactive Particle Sphere)
   ========================================================================== */

function initContactScene() {
  const canvas = document.getElementById('webgl-contact-canvas');
  if (!canvas || !window.THREE) return;

  const parent = canvas.parentElement;
  const width = parent.clientWidth || 400;
  const height = parent.clientHeight || 400;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle Sphere
  const count = 1200;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const c1 = new THREE.Color('#ff007f');
  const c2 = new THREE.Color('#8a2be2');

  for (let i = 0; i < count; i++) {
    const r = 4 + (Math.random() - 0.5) * 0.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const lerped = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = lerped.r;
    colors[i * 3 + 1] = lerped.g;
    colors[i * 3 + 2] = lerped.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const sphere = new THREE.Points(geo, mat);
  scene.add(sphere);

  // Live Time Indicator Clock
  const clockElem = document.getElementById('live-time-display');
  function updateTime() {
    if (clockElem) {
      const now = new Date();
      clockElem.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }
  setInterval(updateTime, 1000);
  updateTime();

  // Render Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.y = elapsedTime * 0.15;
    sphere.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;

    const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
    sphere.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const w = parent.clientWidth || 400;
    const h = parent.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.THREE) {
    initContactScene();
  }
});
