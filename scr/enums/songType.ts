export const songType = {
  track: "track",
  playlist: "playlist",
} as const;

export type SongType = (typeof songType)[keyof typeof songType];
