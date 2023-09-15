<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { handleControl } from "./lib/input";
  import { cameraFollowObject } from "./lib/camera";
  import * as PHYSICS from "./lib/physics";

  let canvas: HTMLCanvasElement; // declare a variable for the canvas
  let mesh: THREE.Mesh;

  const INITIAL_POSITION = JSON.parse(
    import.meta.env.VITE_INITIAL_POSITION
  ) as [number, number, number];

  onMount(async () => {
    // Create the renderer, scene, camera, light and mesh.
    PHYSICS.init_world();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 200, 1000);

    const scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(-300, 600, 100);
    scene.add(light);

    const geometry = new THREE.SphereGeometry(10);
    const material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    PHYSICS.add_body(mesh);
    function setMaterialProperties(node: THREE.Object3D) {
    if (node instanceof THREE.Mesh) {
        if (node.material) {
            let mat = node.material as THREE.Material;
            mat.side = THREE.DoubleSide;
            // mat.transparent = true;
            mat.depthTest = true;
            mat.depthWrite = true;
        }
    }
}
    // Load the 3D model
    const loader = new GLTFLoader();

    const map = await loader.loadAsync(
      "/models/map/sea_keep_lonely_watcher/scene.gltf"
    );
    console.log(map.scene)
    map.scene.traverse(setMaterialProperties);
    scene.add(map.scene);

    // Add physics
    (mesh.userData.body as CANNON.Body).position.set(...INITIAL_POSITION);
    PHYSICS.add_map_colliders(map.scene as any)
    console.log("Done loading map");

    // Create an animation loop.
    let previousTime = 0;
    const animation: XRFrameRequestCallback = (time: number) => {
      const deltaTime = time - previousTime;

      PHYSICS.update_physics(deltaTime);
      PHYSICS.update_body(mesh);
      cameraFollowObject(mesh, mesh.userData.body, camera);
      // PHYSICS.update_map_colliders(map.scene as any)
      handleControl(mesh.userData.body, camera, deltaTime);


      previousTime = time;
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
