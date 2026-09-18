export const COMMANDS = {
  START: "/start",
  BALANCE: "/balance",
  REPORT: "/report",
  MONTHLY: "/monthly",
  YEARLY: "/yearly",
  UNDO: "/undo",
  LANGUAGE: "/language",
} as const;

export type CommandName = keyof typeof COMMANDS;
