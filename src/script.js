import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IncrementWrapStencilOp, TetrahedronGeometry } from "three";
import * as dat from "dat.gui";
import { nextElementSibling } from "domutils";
import vertex from "./shaders/vertexShader.glsl";
import fragment from "./shaders/fragmentShader.glsl";
import iVertex from "./shaders/innerVertex.glsl";
import iFragment from "./shaders/innerFragment.glsl";
/**
 *
 * Debug
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// var context = new AudioContext();
let context;
var vizInit = function () {
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var fileLabel = document.querySelector("label.file");
  console.log(audio);
  document.onload = function (e) {
    console.log(e);
    console.log(audio);
    audio.play();
    init();
  };
  file.onchange = function () {
    fileLabel.classList.add("normal");
    audio.classList.add("active");
    var files = this.files;

    audio.src = URL.createObjectURL(files[0]);
    console.log(audio);
    audio.load();
    audio.play();
    init();
  };

  // const startButton = document.getElementById("startButton");
  // startButton.addEventListener("click", init);
  let gui,
    canvas,
    scene,
    tLoader,
    sphere,
    camera,
    renderer,
    clock,
    plane,
    controls,
    analyser,
    material,
    innerMesh,
    innerMaterial,
    torus;
  // const fftSize = 128;
  // const listener = new THREE.AudioListener();
  // const threeAudio = new THREE.Audio(listener);
  // const file = "/sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3";
  // const mediaElement = new Audio(file);

  // mediaElement.play();

  // threeAudio.setMediaElementSource(mediaElement);
  // const aanalyser = new THREE.AudioAnalyser(threeAudio, fftSize);
  // console.log(aanalyser);
  // let averageFreq = analyser.getAverageFrequency();
  console.log(audio);
  function init() {
    var context = new AudioContext();
    console.log(audio);
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    console.log(analyser);

    /*------------------------------
    Sound 
    ------------------------------*/
    gui = new dat.GUI();

    /*------------------------------
    Allocating the canvas space
    ------------------------------*/
    canvas = document.querySelector("canvas.webgl");

    // Scene
    scene = new THREE.Scene();

    /**
     * Sizes
     */

    /**
     * Loading Textures
     */
    tLoader = new THREE.TextureLoader();
    const doorColorTextures = tLoader.load("/textures/door/color.jpg");

    // const material = new THREE.MeshStandardMaterial();
    /*------------------------------
  materials
  ------------------------------*/
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFreq: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    innerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        uFreq: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: vertex,
      fragmentShader: iFragment,
    });

    /*------------------------------
  meshes
  ------------------------------*/
    sphere = new THREE.Points(
      new THREE.SphereBufferGeometry(1.0, 64, 64),
      material
    );
    sphere.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );

    const innerGeometry = new THREE.SphereBufferGeometry(0.5, 560, 560);
    innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);

    scene.add(sphere, innerMesh);

    /*------------------------------
    Lighting
    ------------------------------*/
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.x = 4;
    scene.add(ambientLight, pointLight);

    // gui.add(material, "metalness").min(0).max(1).step(0.001);
    // gui.add(material, "roughness").min(0).max(1).step(0.001);

    /*------------------------------
    Camera
    ------------------------------*/
    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    /*------------------------------
    Controls
    ------------------------------*/
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /*------------------------------
    Renderer
    ------------------------------*/
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /*------------------------------
    Animation Time
    ------------------------------*/
    clock = new THREE.Clock();

    /*------------------------------
    Sound   
    ------------------------------*/

    tick();
    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // analyser.getFrequencyData();
    // let averageFreq = analyser.getAverageFrequency();

    material.uniforms.uTime.value = clock.getElapsedTime();
    innerMaterial.uniforms.uTime.value = clock.getElapsedTime();
    // material.uniforms.uFreq.value = averageFreq;
    // innerMaterial.uniforms.uFreq.value = averageFreq;
    // Update objects:
    sphere.rotation.x += 0.02;
    innerMesh.rotation.z -= 0.01;
    // Update controls
    controls.update();
    // Update Camera;
    camera.rotation.x = Math.sin(elapsedTime);
    camera.rotation.y = Math.cos(elapsedTime);
    camera.lookAt(new THREE.Vector3());
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
};
window.onload = vizInit();

document.body.addEventListener("touchend", function (ev) {
  context.resume();
});
