export const pagination = {
  rewindToBeginning: "rewindpp",
  goBack: "goback",
  advance: "advance",
  advanceToEnd: "advancepp",
} as const;

export type PaginationKey = keyof typeof pagination;
export type PaginationValue = (typeof pagination)[PaginationKey];
