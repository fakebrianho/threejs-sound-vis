import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  AdditiveBlending,
  IncrementWrapStencilOp,
  TetrahedronGeometry,
} from "three";
import * as dat from "dat.gui";
import { nextElementSibling } from "domutils";
import vertex from "./shaders/vertexShader.glsl";
import fragment from "./shaders/fragmentShader.glsl";
import iVertex from "./shaders/innerVertex.glsl";
import iFragment from "./shaders/innerFragment.glsl";
import v2 from "./shaders/fluffyVertex.glsl";
import f2 from "./shaders/fluffyFragment.glsl";
import v3 from "./shaders/testVert.glsl";
import f3 from "./shaders/testFrag.glsl";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// var context = new AudioContext();
let context;
let analyser;
let splitArray = [];
var vizInit = function () {
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var fileLabel = document.querySelector("label.file");
  let dataArray;
  let bufferTime;
  console.log(audio.volume);
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
    material,
    innerMesh,
    innerMaterial;

  function init() {
    var context = new AudioContext();
    console.log(audio);
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    //48000
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    bufferTime = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(bufferTime);

    /*------------------------------
    Sound 
    ------------------------------*/
    gui = new dat.GUI();

    /*------------------------------
    Allocating the canvas space
    ------------------------------*/
    canvas = document.querySelector("canvas.webgl");

    /*------------------------------
    Set up 
    ------------------------------*/
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
    Materials
    ------------------------------*/
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFreq: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.001,
      depthWrite: false,
    });
    innerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        uFreq: { value: 0.0 },
        uAmp: { value: 0.0 },
        uLowF: { value: 0.0 },
        uMidF: { value: 0.0 },
        uHighF: { value: 0.0 },
        resolution: { value: new THREE.Vector2() },
      },
      wireframe: true,
      // vertexShader: vertex,
      // fragmentShader: iFragment,
      // vertexShader: v2,
      // fragmentShader: f2,
      vertexShader: v3,
      fragmentShader: f3,
    });

    /*------------------------------
    Meshes
    ------------------------------*/
    sphere = new THREE.Points(
      new THREE.SphereBufferGeometry(0.75, 164, 164),
      material
    );
    sphere.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );

    const innerGeometry = new THREE.SphereBufferGeometry(1.0, 64, 64);
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
  function tick() {
    analyser.getByteFrequencyData(dataArray);
    analyser.getByteTimeDomainData(bufferTime);
    for (let i = 0; i < dataArray.length; i++) {
      let freqToHerz = i * (48000 / 512);
      if (freqToHerz <= 500) {
        let lower = mapper(dataArray[i], 0, 256, 0, 1.0);
        innerMaterial.uniforms.uLowF.value = lower;
      } else if (500 < freqToHerz <= 2000) {
        let middle = mapper(dataArray[i], 0, 256, 0, 1.0);
        console.log(dataArray[i]);
        console.log(middle);
        innerMaterial.uniforms.uMidF.value = middle;
      } else if (2000 < freqToHerz <= 10000) {
        let upper = mapper(dataArray[i], 0, 256, 0, 1.0);
        innerMaterial.uniforms.uHighF.value = upper;
      }
    }
    let averageAmplitude = getRMS(bufferTime);
    let averageFreq = getAverageFrequency(dataArray);
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = clock.getElapsedTime();
    innerMaterial.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uFreq.value = averageFreq;
    innerMaterial.uniforms.uFreq.value = averageFreq;
    innerMaterial.uniforms.uAmp.value = averageAmplitude;

    /*------------------------------
    Move the objects:
    ------------------------------*/
    sphere.rotation.x += 0.02;
    innerMesh.rotation.z -= 0.01;
    /*------------------------------
    Update Controls
    ------------------------------*/
    controls.update();
    /*------------------------------
    Update Camera Movement
    ------------------------------*/
    camera.rotation.x = Math.sin(elapsedTime);
    camera.rotation.y = Math.cos(elapsedTime);
    camera.lookAt(new THREE.Vector3());
    /*------------------------------
    Render everything!
    ------------------------------*/
    renderer.render(scene, camera);

    /*------------------------------
    Animation frames
    ------------------------------*/
    window.requestAnimationFrame(tick);
  }
};
window.onload = vizInit();

function getAverageFrequency(dataArray) {
  let value = 0;
  const data = dataArray;

  for (let i = 0; i < data.length; i++) {
    value += data[i];
  }

  return value / data.length;
}

function getRMS(bufferTime) {
  let bTime = bufferTime;
  var rms = 0;
  for (let i = 0; i < bTime.length; i++) {
    rms += bTime[i] * bTime[i];
  }
  rms /= bTime.length;
  rms = Math.sqrt(rms);
  return rms;
}

function mapper(value, x1, y1, x2, y2) {
  return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
}
// const map = (value, x1, y1, x2, y2) =>
//   ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
