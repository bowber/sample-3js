import {
  defineSystem,
} from 'bitecs'
import type { ECSWorld } from '../types'

export default function createPhysicsSystem(physicsWorld: any) {
  return defineSystem((world: ECSWorld) => {
    const { delta } = world.time;
    physicsWorld.stepSimulation(delta, 10);
    return world
  })
}