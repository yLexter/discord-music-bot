export const queueComponents = {
  pause: "pause",
  resume: "resume",
  skip: "skip",
  loop: "loop",
  back: "back",
  clear: "clear",
  queue: "queue",
  stop: "stop",
  randomQueue: "rdqueue",
  shuffle: "shuffle",
} as const;

export type QueueComponentKey = keyof typeof queueComponents;
export type QueueComponentValue = (typeof queueComponents)[QueueComponentKey];
