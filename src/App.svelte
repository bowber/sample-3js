<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { handleControl } from "./lib/input";
  let canvas: HTMLCanvasElement; // declare a variable for the canvas
  let mesh: THREE.Mesh;
  onMount(() => {
    // Create the renderer, scene, camera, light and mesh.
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 1000;

    const scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(0, 10, 0);
    scene.add(light);

    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(100, 100, 100);
    scene.add(mesh);

    // Load the 3D model
    const loader = new GLTFLoader();

    loader.load(
      "/models/map/sea_keep_lonely_watcher/scene.gltf",
      function (gltf) {
        console.log(gltf);
        scene.add(gltf.scene);
      },
      undefined, // This is where you can track progress while loading.
      function (error) {
        console.error(error);
      }
    );

    // Create an animation loop.
    let previousTime = 0;
    const animation: XRFrameRequestCallback = (time: number) => {
      const deltaTime = time - previousTime;
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
      handleControl(mesh, deltaTime / 1000);
      renderer.render(scene, camera);
    };

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
  });
</script>

<main>
  <canvas bind:this={canvas} id="main-canvas" />
  <!-- bind canvas DOM element to Svelte variable -->
</main>
