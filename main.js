import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { petConfig } from './petConfig.js';

const petType = localStorage.getItem("petType");
const url = petConfig[petType].avatarAssets.modelUrl;

let scene, camera, renderer, controls, clock;
let mixer, actions = {}, currentAction;
let isModelLoaded = false;
const container = document.getElementById('three-container');

function init() {
  scene = new THREE.Scene();

  const textureloader = new THREE.TextureLoader();
  textureloader.load('grass-4642078_1920.png', function(texture) {
    scene.background = texture;
  });

  
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.5, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.8);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  clock = new THREE.Clock();

  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;

      const modelWrapper = new THREE.Group();

      // 🔧 Normalize position and center
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      // 🔧 Scale the model uniformly to fit within a 1 unit box
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxAxis = Math.max(size.x, size.y, size.z);
      const scaleFactor = 1 / maxAxis;
      model.scale.setScalar(scaleFactor);

      modelWrapper.add(model);
      modelWrapper.position.set(0, 0, 0);
      modelWrapper.rotation.set(0, 0, 0);
      scene.add(modelWrapper);

      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip);
      });

      isModelLoaded = true;
      console.log('Loaded animations:', Object.keys(actions));

      let idleAnim = petConfig[petType].avatarAssets.idleAnimation;
      if (actions[idleAnim]) {
        playAnimation(idleAnim);
      }
    },
    undefined,
    (error) => console.error('Error loading model:', error)
  );

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}

export function triggerAnimation(sentiment) {
  if (!isModelLoaded) {
    console.log('Model not loaded yet');
    return;
  }

  const animationMap = petConfig[petType].animationMap;
  const animationName = animationMap[sentiment] || 'Fawn_A_Idle';

  if (actions[animationName]) {
    playAnimation(animationName);
  } else {
    console.warn(`Animation ${animationName} not found`);
    if (actions['Fawn_A_Idle']) playAnimation('Fawn_A_Idle');
  }
}

function playAnimation(name) {
  if (currentAction === actions[name]) return;

  if (currentAction) {
    currentAction.fadeOut(0.5);
  }

  currentAction = actions[name]
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(0.5)
    .play();
}

init();
animate();
