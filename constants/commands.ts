export const COMMANDS = {
  START: "/start",
  BALANCE: "/balance",
  REPORT: "/report",
  MONTHLY: "/monthly",
  YEARLY: "/yearly",
  UNDO: "/undo",
} as const;

export type CommandName = keyof typeof COMMANDS;
