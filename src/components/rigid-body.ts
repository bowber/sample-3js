import { Types, addComponent, defineComponent } from "bitecs";
import type { ECSWorld } from "../types";

export const rigidBodyMap = new Map<number, any>()
export const RigidBody = defineComponent({
    bodyId: Types.ui8,
});
export const addRigidBodyComponent = (world: ECSWorld, body: any, eid: number) => {
    rigidBodyMap.set(eid, body)
    addComponent(world, RigidBody, eid)
}
export default RigidBody;