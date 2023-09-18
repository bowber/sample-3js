import {
	defineSystem,
	defineQuery,
} from 'bitecs'
import Mesh, { meshMap } from '../components/mesh'
import RigidBody, { rigidBodyMap } from '../components/rigid-body'
import type { ECSWorld } from '../types'
// @ts-ignore
import Ammo from 'ammo.js'


export default function createRendererSystem() {

	const query = defineQuery([Mesh, RigidBody])

	return defineSystem((world: ECSWorld) => {
		
		const entities = query(world)

		for (let i = 0; i < entities.length; ++i) {
			const id = entities[i]

			const mesh = meshMap.get(id)
			if (!mesh) {
				console.error(`Mesh not found for entity ${id}. Skipping.`)
				continue
			}

			const body = rigidBodyMap.get(id)
			if (!body) {
				console.error(`RigidBody not found for entity ${id}. Skipping.`)
				continue
			}

			const transform = new Ammo.btTransform();
			body.getMotionState().getWorldTransform(transform);
			const origin = transform.getOrigin();
			mesh.position.x = origin.x();
			mesh.position.y = origin.y();
			mesh.position.z = origin.z();
			const rotation = transform.getRotation();
			mesh.quaternion.x = rotation.x();
			mesh.quaternion.y = rotation.y();
			mesh.quaternion.z = rotation.z();
			mesh.quaternion.w = rotation.w();

		}
		return world
	})
}