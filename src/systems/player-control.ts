import {
  defineSystem,
  defineQuery,
} from 'bitecs'
import type { ECSWorld } from '../types'
import Player from '../components/player';
import RigidBody, { rigidBodyMap } from '../components/rigid-body';
// @ts-ignore
import Ammo from 'ammo.js';
import input from '../lib/input';

export default function createPlayerControlSystem() {
  const query = defineQuery([Player, RigidBody])

  return defineSystem((world: ECSWorld) => {
    const entities = query(world)

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i]

      const body = rigidBodyMap.get(id)
      if (!body) {
        console.error(`RigidBody not found for entity ${id}. Skipping.`)
        continue
      }
      // Convert input to velocity addition
      const velocity = new Ammo.btVector3(0, 0, 0)
      if (input.get("enter")) {
        // Reset position not velocity
        body.setWorldTransform(new Ammo.btTransform())

      }
      if (input.get("w")) {
        velocity.setZ(-1)
      }
      if (input.get("a")) {
        velocity.setX(-1)
      }
      if (input.get("s")) {
        velocity.setZ(1)
      }
      if (input.get("d")) {
        velocity.setX(1)
      }
      if (velocity.length() != 0) {
        velocity.normalize()
        velocity.op_mul(world.time.delta * 0.05)
      }

      if (input.get(" ")) {
        velocity.setY(3)
      }
      const currentVelocity = body.getLinearVelocity()
      const newVelocity = new Ammo.btVector3(
        currentVelocity.x() + velocity.x(),
        currentVelocity.y() + velocity.y(),
        currentVelocity.z() + velocity.z()
      );
      body.setLinearVelocity(newVelocity)
      body.activate()

      // Clean up
      Ammo.destroy(velocity)
      Ammo.destroy(currentVelocity)
      Ammo.destroy(newVelocity)
    }
    return world
  })
}