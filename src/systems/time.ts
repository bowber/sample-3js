import type { ECSWorld } from "../Game.svelte";

export const timeSystem = (world: ECSWorld) => {
  const { time } = world;
  const now = performance.now();
  const delta = now - time.then;
  time.delta = delta;
  time.elapsed += delta;
  time.then = now;
  return world;
};