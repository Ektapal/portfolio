import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { GLTFLoader } from "GLTFLoader";

let scene, camera, renderer, character, mixer;

init();
animate();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020c1b);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#webgl"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Load 3D character
  const loader = new GLTFLoader();
  loader.load("models/character.glb", (gltf) => {
    character = gltf.scene;
    character.scale.set(0.5, 0.5, 0.5);
    character.position.y = -1;
    scene.add(character);

    // Animation mixer
    mixer = new THREE.AnimationMixer(character);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  });

  // Window resize handler
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (mixer) mixer.update(0.0167);
  renderer.render(scene, camera);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(e.target.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Parallax effect
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
  const y = (e.clientY / window.innerHeight - 0.5) * 0.5;

  if (character) {
    character.rotation.y = x;
    character.rotation.x = y;
  }
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document
  .querySelectorAll(".project-card")
  .forEach((el) => observer.observe(el));
