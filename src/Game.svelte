<script lang="ts">
  import { onMount } from "svelte";
  import { addComponent, addEntity, createWorld, pipe } from "bitecs";
  import * as THREE from "three";
  import { timeSystem } from "./systems/time";
  import type { ECSWorld } from "./types";
  // @ts-ignore
  import Ammo from "ammo.js";
  import createRendererSystem from "./systems/renderer";
  import { addMeshComponent } from "./components/mesh";
  import { addRigidBodyComponent } from "./components/rigid-body";
  import { createMeshBody, initPhysicsWorld } from "./lib/physics";
  import createPhysicsSystem from "./systems/physics";
  import Player from "./components/player";
  import createPlayerControlSystem from "./systems/player-control";
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  let frame: number;
  onMount(() => {
    // Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.2,
      2000
    );
    camera.position.z = 250;
    const controls = new OrbitControls( camera, renderer.domElement );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cube render
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    geometry.attributes.position;
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Ground
    const groundGeometry = new THREE.BoxGeometry(200, 5, 200);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    // const edgeGeometry = new THREE.EdgesGeometry(groundGeometry);
    // const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    // const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    scene.add(ground);
    // scene.add(edges);

    const physicsWorld = initPhysicsWorld();
    const cubeBody = createMeshBody(physicsWorld, geometry, 1);
    const groundBody = createMeshBody(physicsWorld, groundGeometry, 0, {
      x: 0,
      y: -56,
      z: 0,
    });
    physicsWorld.addRigidBody(groundBody);
    physicsWorld.addRigidBody(cubeBody);

    // ECS
    // Setup world
    const world = createWorld<ECSWorld>();
    world.time = { delta: 0, elapsed: 0, then: performance.now() };
    addEntity(world);

    // Systems
    const pipeline = pipe(
      timeSystem,
      createPhysicsSystem(physicsWorld),
      createPlayerControlSystem(),
      createRendererSystem()
    );

    // Entities
    const groundEid = addEntity(world);
    addMeshComponent(world, ground, groundEid);
    addRigidBodyComponent(world, groundBody, groundEid);

    const cubeEid = addEntity(world);
    addMeshComponent(world, cube, cubeEid);
    addRigidBodyComponent(world, cubeBody, cubeEid);
    addComponent(world, Player, cubeEid);

    // Render loop
    function animate() {
      pipeline(world);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    console.log("Game started");
    // Cleanup
    return () => {
      location.reload();
    };
  });
</script>
