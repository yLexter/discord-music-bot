export const geral = {
  restartBot: "restartbot",
  stopBot: "stopbot",
  translateLyrics: "trsLyrics",
} as const;

export type GeralKey = keyof typeof geral;
export type GeralValue = (typeof geral)[GeralKey];
