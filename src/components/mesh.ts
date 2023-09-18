import { Types, addComponent, defineComponent } from "bitecs";
import type { ECSWorld } from "../types";

export const meshMap = new Map<number, THREE.Mesh>()
export const Mesh = defineComponent({
    meshId: Types.ui8,
});
export const addMeshComponent = (world: ECSWorld, mesh: THREE.Mesh, eid: number) => {
    meshMap.set(eid, mesh)
    addComponent(world, Mesh, eid)
}

export default Mesh;