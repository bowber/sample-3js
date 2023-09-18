import type { IWorld } from "bitecs";
declare type ECSWorld = IWorld & {
  time: { delta: number; elapsed: number; then: number };
};