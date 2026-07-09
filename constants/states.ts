import { SessionState, TransactionType } from "@/generated/prisma/client";

export const SESSION_STATES = SessionState;
export const TRANSACTION_TYPES = TransactionType;

export const STATE_FLOW = [
  SessionState.IDLE,
  SessionState.WAITING_AMOUNT,
  SessionState.WAITING_TYPE,
  SessionState.WAITING_CATEGORY,
  SessionState.WAITING_DESCRIPTION,
] as const;
