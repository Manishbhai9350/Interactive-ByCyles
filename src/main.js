import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BikeData } from "./data";

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  const HtmlPoints = {};

  // <div class="point">
  // <h1 class="marker">1</h1>
  // <h1 class="heading">The Wheels</h1>
  // <p class="label">Pressure-relief gel cushioning.</p>
  // </div>

  let counter = 1;

  for (const item in BikeData) {
    const { heading, label } = BikeData[item];
    const pointCon = document.createElement("div");
    pointCon.classList.add("point", "point-" + counter++);
    pointCon.innerHTML = `
      <h1 class="marker">${counter}</h1>
      <div class="dashed-line"></div>
      <div class="content">
        <h1 class="heading">${heading}</h1>
        <p class="label">${label}</p>
      </div>
    `;
    main.appendChild(pointCon);
  }

  // --- 1. Scene Setup ---
  const canvas = document.querySelector("canvas.canvas-container");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const scene = new THREE.Scene();

  // Set to null so the HTML/CSS background shows behind the model
  scene.background = null;

  // --- 2. Camera Setup ---
  const camera = new THREE.PerspectiveCamera(
    45,
    innerWidth / innerHeight,
    0.1,
    100,
  );
  camera.position.set(-2, 2, 2); // Adjust based on how large your model is

  // --- 3. Renderer Setup ---
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
  });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // --- 4. Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft global light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Main light source
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const ExludePoints = ["Bicycle_Bicycle_0"];
  const Points = [];

  // --- 5. Model Loading ---
  const loader = new GLTFLoader();
  let bikeModel;

  // IMPORTANT: Replace with the actual path to your GLTF/GLB file
  loader.load(
    "/models/bycycle.glb",
    function (gltf) {
      bikeModel = gltf.scene;

      bikeModel.traverse((n) => {
        if (n.isMesh && ExludePoints.indexOf(n.name) == -1) {
          Points.push({
            name: n.name,
            point: n.position,
          });
        }
      });

      // 1. Calculate the bounding box of the model
      const box = new THREE.Box3().setFromObject(bikeModel);

      // 2. Find the exact mathematical center of that box
      const center = box.getCenter(new THREE.Vector3());

      // 3. Subtract that center from the model's position to snap it to (0,0,0)
      bikeModel.position.sub(center);

      // Optional: If you want the bottom of the tires to rest exactly on the "floor"
      // instead of the bike being centered precisely in the middle of the frame:
      /*
      const size = box.getSize(new THREE.Vector3());
      bikeModel.position.y += (size.y / 2); 
      */

      // You may need to tweak these depending on how the model was exported
      // bikeModel.scale.set(1, 1, 1);
      // bikeModel.position.set(0, -1, 0);

      scene.add(bikeModel);
    },
    undefined,
    function (error) {
      console.error("Error loading the 3D model:", error);
    },
  );

  // --- 6. Controls (Optional but recommended for hero sections) ---
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.enableZoom = false; // Prevents page scrolling from zooming the model
  // controls.enablePan = false;  // Keeps the model centered

  // --- 7. Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // --------------------------------------------------------
    // YOUR INTERACTIVITY GOES HERE
    // (e.g., Raycaster updates, HTML hotspot positioning logic)
    // --------------------------------------------------------

    renderer.render(scene, camera);
  }
  animate();

  // --- 8. Handle Window Resize ---
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
});
