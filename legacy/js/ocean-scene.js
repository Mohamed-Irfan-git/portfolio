const canvas = document.querySelector('#ocean-canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let width = 0;
let height = 0;
let pixelRatio = 1;
let depth = 0;
let velocity = 0;
let pointerX = 0;
let pointerY = 0;
let frame = 0;
let stopFallback = () => {};

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function startCanvasFallback() {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context || reducedMotion) return () => {};
  resizeCanvas();
  const amount = Math.min(105, Math.max(48, Math.round(width * height / 18000)));
  const particles = Array.from({ length: amount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.4 + Math.random() * 1.2,
    opacity: 0.13 + Math.random() * 0.35,
    drift: 0.08 + Math.random() * 0.27,
    phase: Math.random() * Math.PI * 2,
  }));
  let active = true;
  let tick = 0;

  const draw = () => {
    if (!active) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    tick += 0.008 + Math.min(Math.abs(velocity), 1) * 0.009;
    particles.forEach((particle) => {
      particle.y -= particle.drift * (1 + Math.abs(velocity) * 0.65);
      if (particle.y < -4) { particle.y = height + 4; particle.x = Math.random() * width; }
      const sway = Math.sin(tick + particle.phase) * 4;
      context.beginPath();
      context.fillStyle = `rgba(123, 231, 232, ${particle.opacity})`;
      context.arc(particle.x + sway + pointerX * 12, particle.y + pointerY * 8, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);
  return () => { active = false; cancelAnimationFrame(frame); };
}

async function startThreeScene() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  resizeCanvas();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x020b1a, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06283d, 0.012);
  const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 150);
  camera.position.set(0, 0, 14);

  const ambient = new THREE.HemisphereLight(0x86dfe3, 0x031323, 1.05);
  scene.add(ambient);
  const keyLight = new THREE.PointLight(0x56e0e9, 1.2, 90, 2);
  keyLight.position.set(8, 12, 3);
  scene.add(keyLight);

  const particleCount = width < 720 ? 150 : 340;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(0x56e0e9);
  const violet = new THREE.Color(0x8b7cff);
  for (let i = 0; i < particleCount; i += 1) {
    const offset = i * 3;
    positions[offset] = (Math.random() - 0.5) * 68;
    positions[offset + 1] = Math.random() * 78 - 68;
    positions[offset + 2] = -5 - Math.random() * 45;
    const color = Math.random() > 0.83 ? violet : baseColor;
    colors[offset] = color.r;
    colors[offset + 1] = color.g;
    colors[offset + 2] = color.b;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMaterial = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.52, depthWrite: false, sizeAttenuation: true });
  scene.add(new THREE.Points(particleGeometry, particleMaterial));

  const vegetation = new THREE.Group();
  const coralGeometry = new THREE.ConeGeometry(0.3, 2.4, 6, 2);
  const coralMaterial = new THREE.MeshStandardMaterial({ color: 0x137f87, emissive: 0x062c3b, roughness: 0.78, flatShading: true, transparent: true, opacity: 0.66 });
  for (let i = 0; i < 21; i += 1) {
    const depthLayer = i < 12 ? -20 : -54;
    const cone = new THREE.Mesh(coralGeometry, coralMaterial);
    cone.position.set((Math.random() - 0.5) * 52, depthLayer + Math.random() * 7, -13 - Math.random() * 12);
    cone.scale.setScalar(0.38 + Math.random() * 1.2);
    cone.rotation.z = (Math.random() - 0.5) * 0.55;
    vegetation.add(cone);
  }
  scene.add(vegetation);

  const jellies = [];
  function addJellyfish(x, y, z, scale) {
    const group = new THREE.Group();
    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(0.68, 12, 9, 0, Math.PI * 2, 0, Math.PI * 0.57),
      new THREE.MeshStandardMaterial({ color: 0x7fe9e9, emissive: 0x168b9b, emissiveIntensity: 0.7, transparent: true, opacity: 0.45, roughness: 0.22, metalness: 0.08, side: THREE.DoubleSide }),
    );
    bell.scale.y = 0.76;
    group.add(bell);
    const tendrilMaterial = new THREE.LineBasicMaterial({ color: 0x8b7cff, transparent: true, opacity: 0.48 });
    for (let i = 0; i < 5; i += 1) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3((i - 2) * 0.16, -0.14, 0),
        new THREE.Vector3((i - 2) * 0.21, -0.65, 0.03),
        new THREE.Vector3((i - 2) * 0.3 + 0.12, -1.25, -0.05),
      ]);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(8)), tendrilMaterial);
      group.add(line);
    }
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    group.userData.baseY = y;
    scene.add(group);
    jellies.push(group);
  }
  addJellyfish(-10, -27, -24, 1.3);
  addJellyfish(13, -44, -28, 0.88);
  addJellyfish(-3, -61, -34, 1.1);

  const clock = new THREE.Clock();
  let active = true;
  let resizeObserver;
  let renderFrame = 0;
  const draw = () => {
    if (!active) return;
    const elapsed = clock.getElapsedTime();
    const depthY = -depth * 66;
    camera.position.x += (pointerX * 1.8 - camera.position.x) * 0.025;
    camera.position.y += (depthY + pointerY * 0.9 - camera.position.y) * 0.045;
    camera.lookAt(pointerX * 0.4, camera.position.y - 3, -20);
    jellies.forEach((jelly, index) => {
      jelly.position.y = jelly.userData.baseY + Math.sin(elapsed * 0.42 + index * 1.8) * 0.42;
      jelly.rotation.z = Math.sin(elapsed * 0.28 + index) * 0.045;
    });
    particleMaterial.opacity = 0.42 + Math.min(Math.abs(velocity), 1) * 0.16;
    renderer.render(scene, camera);
    renderFrame = requestAnimationFrame(draw);
  };
  draw();

  const onResize = () => {
    resizeCanvas();
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize, { passive: true });
  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(document.body);
  return () => {
    active = false;
    cancelAnimationFrame(renderFrame);
    window.removeEventListener('resize', onResize);
    resizeObserver?.disconnect();
    particleGeometry.dispose();
    particleMaterial.dispose();
    coralGeometry.dispose();
    coralMaterial.dispose();
    renderer.dispose();
  };
}

function bindEnvironmentInput() {
  window.addEventListener('pointermove', (event) => {
    pointerX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
    pointerY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
  }, { passive: true });
  window.addEventListener('ocean:progress', (event) => {
    depth = Math.max(0, Math.min(1, event.detail?.progress ?? 0));
    velocity = Math.max(-1, Math.min(1, (event.detail?.velocity ?? 0) / 1500));
  });
}

export async function initializeOceanScene() {
  if (!canvas) return;
  bindEnvironmentInput();
  if (reducedMotion) {
    resizeCanvas();
    return;
  }
  stopFallback = startCanvasFallback();
  const slowConnection = navigator.connection?.saveData || ['slow-2g', '2g'].includes(navigator.connection?.effectiveType);
  if (slowConnection) return;
  try {
    const stopThree = await startThreeScene();
    stopFallback();
    stopFallback = stopThree;
  } catch {
    // The CSS scenes and 2D canvas atmosphere remain available when WebGL or its CDN is unavailable.
  }
  window.addEventListener('pagehide', () => stopFallback(), { once: true });
}
