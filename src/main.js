import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BikeData } from "./data";

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  const HtmlPoints = [];

  // <div class="point">
  // <h1 class="marker">1</h1>
  // <h1 class="heading">The Wheels</h1>
  // <p class="label">Pressure-relief gel cushioning.</p>
  // </div>

  const scene = new THREE.Scene();

  const contentBox = document.createElement("div");
  contentBox.classList.add("point-content");

  contentBox.innerHTML = `
    <h2 class="heading"></h2>
    <p class="label"></p>
  `;

  main.appendChild(contentBox);

  BikeData.forEach((B, i) => {
    const { heading, label, name } = B;

    const pointCon = document.createElement("div");
    pointCon.classList.add("point", "point-" + (i + 1));

    pointCon.dataset.visible = "false"; // 🔥 important

    if (name == "Seat_Bicycle_0") {
      pointCon.classList.add("visible");
      pointCon.dataset.visible = "true";
    }

    pointCon.innerHTML = `
    <h1 class="marker">${i + 1}</h1>
  `;

    // 🔥 HOVER LOGIC
    pointCon.addEventListener("mouseenter", () => {
      if (pointCon.dataset.visible !== "true") return;

      // update content
      contentBox.querySelector(".heading").textContent =
        `${(i + 1).toString().padStart(1, "0")} ${heading}`;
      contentBox.querySelector(".label").textContent = label;

      contentBox.style.opacity = 1;

      // position to right of point
      const pointConRect = pointCon.getBoundingClientRect();
      const contentBoxRect = contentBox.getBoundingClientRect();

      let x = pointConRect.right + 10;
      let y = pointConRect.top;
      if (Math.abs(x - innerWidth) < contentBoxRect.width) {
        x -= contentBoxRect.width + 50;
      }

      if (Math.abs(y - innerHeight) < contentBoxRect.height) {
        y -= contentBoxRect.height + 10;
        x = contentBoxRect.width / 2 + 50;
      }

      contentBox.style.transform = `
      translate(${x}px, ${y}px)
    `;
    });

    pointCon.addEventListener("mouseleave", () => {
      contentBox.style.opacity = 0;
    });

    HtmlPoints.push({
      ...B,
      container: pointCon,
    });

    main.appendChild(pointCon);
  });

  // --- 1. Scene Setup ---
  const canvas = document.querySelector("canvas.canvas-container");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // Set to null so the HTML/CSS background shows behind the model
  scene.background = null;

  // --- 2. Camera Setup ---
  const camera = new THREE.PerspectiveCamera(
    45,
    innerWidth / innerHeight,
    0.1,
    100,
  );
  camera.position.set(2, -0.1, -0.04); // Adjust based on how large your model is

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

  const loaderEl = document.querySelector(".loader");
  const bar = document.querySelector(".loader-bar");
  const text = document.querySelector(".loader-text");

  const LoadManager = new THREE.LoadingManager();

  LoadManager.onProgress = (url, loaded, total) => {
    const progress = Math.floor((loaded / total) * 100);

    bar.style.width = progress + "%";
    text.textContent = progress + "%";
  };

  LoadManager.onLoad = () => {
    bar.style.width = 100 + "%";

    setTimeout(() => {
      loaderEl.style.opacity = 0;
      loaderEl.style.pointerEvents = "none";

      setTimeout(() => {
        loaderEl.style.display = "none";
      }, 400);
    }, 500);
  };

  // --- 5. Model Loading ---
  const loader = new GLTFLoader(LoadManager);
  let bikeModel;

  // IMPORTANT: Replace with the actual path to your GLTF/GLB file
  loader.load(
    "/models/bycycle.glb",
    function (gltf) {
      bikeModel = gltf.scene;

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

  const raycaster = new THREE.Raycaster();

  // --- 6. Controls (Optional but recommended for hero sections) ---
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.enableZoom = false; // Prevents page scrolling from zooming the model
  // controls.enablePan = false;  // Keeps the model centered
  const mouse = new THREE.Vector2();
  // --- 7. Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // raycaster.setFromCamera()

    // --------------------------------------------------------
    // YOUR INTERACTIVITY GOES HERE
    // (e.g., Raycaster updates, HTML hotspot positioning logic)
    // --------------------------------------------------------

    if (bikeModel) {
      HtmlPoints.forEach((P, i) => {
        const point = P.point;
        const wordPos = point.clone();
        const ndc = wordPos.clone().project(camera);
        raycaster.setFromCamera(ndc, camera);

        // no need to check the whole scene as there is only bike model there
        const intersects = raycaster.intersectObject(bikeModel, true);
        const TX = (ndc.x * innerWidth) / 2;
        const TY = (-ndc.y * innerHeight) / 2;
        P.container.style.transform = `translate(-50%,-50%) translate(${TX}px, ${TY}px)`;

        const show =
          intersects.length === 0 ||
          intersects[0].distance >= camera.position.distanceTo(wordPos);

        P.container.classList.toggle("visible", show);
        P.container.dataset.visible = show;
      });
    }

    renderer.render(scene, camera);
  }
  animate();

  // --- 8. Handle Window Resize ---
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  window.addEventListener("click", (e) => {
    return;
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / innerHeight - 0.5) * 2;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    console.log("New Intersect");
    if (intersects.length) {
      intersects.forEach((item) => {
        if (item.object.name !== "ChainExtender_Bicycle_0") return;
        console.log(item.object.name);
        console.log(item.point);
      });
    }
  });
});
