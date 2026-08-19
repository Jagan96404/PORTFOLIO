/* ==========================================================================
   WEBGL HERO 3D SCENE (Mouse-Reactive Torus Mesh & Shader Background)
   ========================================================================== */

function initHeroScene() {
  const canvas = document.getElementById('webgl-hero-canvas');
  if (!canvas || !window.THREE) return;

  const parent = canvas.parentElement;
  const width = parent.clientWidth || window.innerWidth;
  const height = parent.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3D Torus Knot Object
  const geometry = new THREE.TorusKnotGeometry(4.5, 1.2, 128, 32);
  
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });

  const torusMesh = new THREE.Mesh(geometry, wireMat);
  torusMesh.position.set(4, 0, -2);
  scene.add(torusMesh);

  // Secondary Glowing Core Sphere
  const coreGeo = new THREE.IcosahedronGeometry(2.5, 3);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xff007f,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.position.copy(torusMesh.position);
  scene.add(coreMesh);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Damped lerp for smooth mouse tilt
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    torusMesh.rotation.x = elapsed * 0.2 + targetY * 2;
    torusMesh.rotation.y = elapsed * 0.25 + targetX * 2;

    coreMesh.rotation.x = -elapsed * 0.3;
    coreMesh.rotation.y = -elapsed * 0.35;

    camera.position.x = targetX * 4;
    camera.position.y = -targetY * 4;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const w = parent.clientWidth || window.innerWidth;
    const h = parent.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.THREE) {
    initHeroScene();
  }
});
