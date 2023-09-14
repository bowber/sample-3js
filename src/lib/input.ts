import * as THREE from "three";

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

export function handleControl(object: THREE.Object3D, deltaTime: number) {
  const speed = 1;  // You can adjust speed as needed
  console.log(object.position)
  if (keysPressed['a']) {
    object.position.x -= speed * deltaTime;
  }
  if (keysPressed['d']) {
    object.position.x += speed * deltaTime;
  }
  if (keysPressed['w']) {
    object.position.z -= speed * deltaTime;
  }
  if (keysPressed['s']) {
    object.position.z += speed * deltaTime;
  }

}