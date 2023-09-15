import * as THREE from "three";
import * as CANNON from 'cannon';
import { mousePosition } from './input';

const INITIAL_POSITION = JSON.parse(import.meta.env.VITE_INITIAL_POSITION) as [number, number, number];
const DISTANCE = 200

let lastPosition = new THREE.Vector3(...INITIAL_POSITION);
let direction = new THREE.Vector3(0, 0, 1);
export function cameraFollowObject(object: THREE.Object3D, body: CANNON.Body, camera: THREE.Camera) {

  const newPosition = new THREE.Vector3(body.position.x, body.position.y, body.position.z)
  direction = lastPosition.clone().sub(newPosition)
  if (direction.length() < 0.1) {
    return
  }
  direction.y = 0;
  direction.normalize();
  const targetPosition = object.position.clone().add(direction.multiplyScalar(DISTANCE))
  targetPosition.y += 100;

  camera.position.copy(targetPosition);
  camera.lookAt(object.position);
  lastPosition = newPosition;
}