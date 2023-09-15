import * as CANNON from 'cannon';
import * as THREE from 'three';
let world: CANNON.World;

export function init_world() {
  world = new CANNON.World();
  world.gravity.set(0, -10, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
}

export function add_body(mesh: THREE.Mesh) {
  const shape = new CANNON.Sphere(mesh.geometry.boundingSphere?.radius ?? 10);
  const body = new CANNON.Body({ mass: 1 });
  body.position.copy(mesh.position as any);
  body.addShape(shape);
  body.fixedRotation = true;
  body.linearDamping = 0.9;
  world.addBody(body);
  mesh.userData.body = body;

}

export function add_map_colliders(group: THREE.Group) {

  group.traverse( object => {
    if (object instanceof THREE.Mesh) {
      const mesh = object;
      const geometry = mesh.geometry;

      // Step 1: Convert Three.js BufferGeometry to Cannon.js Trimesh
      const vertices = geometry.attributes.position.array;
      const indices = Array.from({ length: vertices.length / 3}, (_, i) => i); 

      const cannonTrimesh = new CANNON.Trimesh(vertices as any, indices);

      // Step 2: Create the Cannon.js Body
      const body = new CANNON.Body({ mass: 0 });  // assuming the map is static
      body.addShape(cannonTrimesh);

      // Step 3: Set the position and orientation of the body to match Three.js mesh
      body.position.copy(mesh.position as any);
      body.quaternion.copy(mesh.quaternion as any);
      world.addBody(body);
      // Step 4: Put the physics body in the user data of the mesh
      mesh.userData.collider = body;
    }
  });
}

export function add_ground() {
}

export function update_physics(deltaTime: number) {
  world.step(deltaTime/1000);
}

export function update_body(mesh: THREE.Mesh) {
  mesh.position.copy(mesh.userData.body.position);
  mesh.quaternion.copy(mesh.userData.body.quaternion);
}

export function update_map_colliders(group: THREE.Group) {
  group.traverse( object => {
    if (object instanceof THREE.Mesh) {
      const mesh = object;
      mesh.position.copy(mesh.userData.collider.position);
      mesh.quaternion.copy(mesh.userData.collider.quaternion);
    }
  });
}
