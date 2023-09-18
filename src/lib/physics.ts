// @ts-ignore
import Ammo from 'ammo.js'
import type { BufferGeometry } from 'three';

export const initPhysicsWorld = () => {
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver();

  const physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    overlappingPairCache,
    solver,
    collisionConfiguration
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
  return physicsWorld
}

export const createMeshBody = (
  physicsWorld: any,
  geometry: BufferGeometry,
  mass: number,
  position?: { x: number, y: number, z: number },
) => {
  let vertices = geometry.attributes.position.array;
  let shape = new Ammo.btConvexHullShape();

  for (let i = 0; i < vertices.length; i += 3) {
    let vertex = new Ammo.btVector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    shape.addPoint(vertex);
  }

  // Create a dynamic rigid body using the created shape with mass, friction, and restitution
  let localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  // Set shape's initial position
  transform.setOrigin(
    position
      ? new Ammo.btVector3(position.x, position.y, position.z)
      : new Ammo.btVector3(0, 0, 0)
  );
  let motionState = new Ammo.btDefaultMotionState(transform);
  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  // Add the body to the physics world
  physicsWorld.addRigidBody(body);
  return body
}
