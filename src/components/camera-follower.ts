import { Types, addComponent, defineComponent } from "bitecs";
import type { ECSWorld } from "../types";

export const cameraMap = new Map<number, THREE.Camera>()
export const CameraFollower = defineComponent({
    camera: Types.ui8,
});
export const addCameraFollowerComponent = (world: ECSWorld, camera: THREE.Camera, eid: number) => {
    cameraMap.set(eid, camera)
    addComponent(world, camera, eid)
}

export default CameraFollower;