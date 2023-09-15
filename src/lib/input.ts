import * as THREE from "three";
import * as CANNON from 'cannon';

const INITIAL_POSITION = JSON.parse(import.meta.env.VITE_INITIAL_POSITION) as [number, number, number];
const JUMP_SPEED = JSON.parse(import.meta.env.VITE_JUMP_SPEED) as number;
let keysPressed = {
  a: false,
  d: false,
  w: false,
  s: false
} as Record<string, boolean>;

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  keysPressed[key] = true;
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  keysPressed[key] = false;
});

export let mousePosition = {
  x: 0,
  y: 0
};
window.addEventListener('mousemove', (event) => {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
});

const rotateLeftQuaternion = new CANNON.Quaternion()
rotateLeftQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 3);
const rotateRightQuaternion = new CANNON.Quaternion()
rotateRightQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 3);
export function handleControl(body: CANNON.Body, camera: THREE.Camera, deltaTime: number) {
  const speed = import.meta.env.VITE_MOVING_SPEED as number;
  let forwardDirection = body.position.clone().vsub(new CANNON.Vec3(camera.position.x, camera.position.y, camera.position.y))
  forwardDirection.y = 0;
  if (forwardDirection.almostEquals(new CANNON.Vec3(0, 0, 0), 0.1)) {
    forwardDirection = new CANNON.Vec3(0, 0, 1);
  }
  forwardDirection.normalize();
  forwardDirection.mult(speed * deltaTime);
  const leftDirection = rotateLeftQuaternion.vmult(forwardDirection);
  const rightDirection = rotateRightQuaternion.vmult(forwardDirection);
  const backwardDirection = forwardDirection.clone().scale(-1);

  if (keysPressed['a']) {
    body.velocity.x += leftDirection.x;
    body.velocity.z += leftDirection.z;
    console.log("a", leftDirection);
  }
  if (keysPressed['d']) {
    body.velocity.x += rightDirection.x;
    body.velocity.z += rightDirection.z;
    console.log("d", rightDirection);
  }
  if (keysPressed['w']) {
    body.velocity.x += forwardDirection.x;
    body.velocity.z += forwardDirection.z;
    console.log("w", forwardDirection);
  }
  if (keysPressed['s']) {
    body.velocity.x += backwardDirection.x;
    body.velocity.z += backwardDirection.z;
    console.log("s", backwardDirection);
  }
  if (keysPressed['enter']) {
    body.position.set(...INITIAL_POSITION);
    body.velocity.set(0, 0, 0);
  }
  if (keysPressed[' ']) {
    body.velocity.y = JUMP_SPEED;
  }
}


