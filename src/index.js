import {
  Scene,
  Color,
  PerspectiveCamera,
  BoxBufferGeometry,
  Mesh,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  TextureLoader,
  sRGBEncoding,
  MeshBasicMaterial,
  CylinderGeometry,
  RepeatWrapping,
  GammaEncoding
} from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { getGPUTier } from "detect-gpu";

const gpu = getGPUTier();
console.log(gpu);

let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;

let myColor = "ffffff";
let shape = "square";

let colorsBox1 = document.querySelector(".red");
colorsBox1.onclick = function (ev) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  // mesh.materials.dispose();
  mesh = undefined;
  myColor = ev.target.classList[1];
  createMeshes();
};

let colorsBox2 = document.querySelector(".blue");
colorsBox2.onclick = function (ev) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  // mesh.materials.dispose();
  mesh = undefined;
  myColor = ev.target.classList[1];
  createMeshes();
};

let colorsBox3 = document.querySelector(".yellow");
colorsBox3.onclick = function (ev) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  // mesh.materials.dispose();
  mesh = undefined;
  myColor = ev.target.classList[1];
  createMeshes();
};

let shape1 = document.querySelector(".square");
shape1.onclick = function (ev) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  // mesh.materials.dispose();
  mesh = undefined;
  shape = "square";
  console.log(shape);

  createMeshes();
};

let shape2 = document.querySelector(".hexagon");
shape2.onclick = function (ev) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  // mesh.materials.dispose();
  mesh = undefined;
  shape = "hexagon";
  console.log(shape);

  createMeshes();
};

let shape3 = document.querySelector(".triangle");
shape3.onclick = function (ev) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  // mesh.materials.dispose();
  mesh = undefined;
  shape = "triangle";
  console.log(shape);

  createMeshes();
};

function init() {
  container = document.querySelector("#scene-container");

  // Creating the scene
  scene = new Scene();
  scene.background = new Color("skyblue");

  createCamera();
  createLights();
  createMeshes();
  createControls();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;
  camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-2, 2, 10);
}

function createLights() {
  const mainLight = new DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
  scene.add(mainLight, hemisphereLight);
}

function createMeshes() {
  console.log(shape);

  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("./src/white.jpeg");
  const texture2 = textureLoader.load("./src/white-side-3.jpg");
  texture.encoding = sRGBEncoding;
  texture.anisotropy = 16;
  texture2.encoding = sRGBEncoding;
  texture2.anisotropy = 16;
  if (shape === "hexagon") {
    texture2.wrapS = RepeatWrapping;
    texture2.wrapT = RepeatWrapping;
    texture2.repeat.set(2, 1);
  }

  // const geometry = new BoxBufferGeometry(2, 0.1, 2);
  const geometry =
    shape === "hexagon"
      ? new CylinderGeometry(2, 2, 0.4, 6)
      : shape === "square"
      ? new BoxBufferGeometry(3, 0.4, 3)
      : new CylinderGeometry(2, 2, 0.5, 3);
  const materials =
    // hexagon
    shape === "hexagon" || shape === "triangle"
      ? [
          new MeshBasicMaterial({ map: texture2, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture, color: `#${myColor}` })
        ]
      : [
          new MeshBasicMaterial({ map: texture2, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture2, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture2, color: `#${myColor}` }),
          new MeshBasicMaterial({ map: texture2, color: `#${myColor}` })
        ];

  // const material = new MeshStandardMaterial({ map: texture });
  mesh = new Mesh(geometry, materials);
  scene.add(mesh);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  // renderer.outputOutput = true;
  renderer.outputEncoding = GammaEncoding;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new OrbitControls(camera, container);
}

function update() {
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  // mesh.rotation.z += 0.01;
}

function render() {
  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);
