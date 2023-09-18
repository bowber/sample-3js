// @ts-ignore
import Ammo from 'ammo.js';
import {
  defineSystem,
  defineQuery,
} from 'bitecs'
import type { ECSWorld } from '../types'
import Player from '../components/player';
import RigidBody, { rigidBodyMap } from '../components/rigid-body';
import input from '../lib/input';
import CameraFollower, { cameraMap } from '../components/camera-follower';
import THREE from 'three';

export default function createCameraFollowSystem() {
  const query = defineQuery([RigidBody, CameraFollower])

  return defineSystem((world: ECSWorld) => {
    const entities = query(world)

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i]

      const body = rigidBodyMap.get(id)
      if (!body) {
        console.error(`RigidBody not found for entity ${id}. Skipping.`)
        continue
      }

      const camera = cameraMap.get(id)
      if (!camera) {
        console.error(`Camera not found for entity ${id}. Skipping.`)
        continue
      }

      // Convert input to velocity addition
      const rotation = new THREE.Quaternion()
      
      if (input.get("a")) {
        rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.1)
      }
      if (input.get("d")) {
        rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.1)        
      }
    }
    return world
  })
}