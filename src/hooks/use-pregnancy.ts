"use client";

import { addWeeks, differenceInCalendarWeeks, formatDistanceStrict } from "date-fns";

export function usePregnancyProgress(lmpDate: string, dueDate?: string) {
  const now = new Date();
  const lmp = new Date(lmpDate);
  const fallbackDueDate = addWeeks(lmp, 40);
  const finalDueDate = dueDate ? new Date(dueDate) : fallbackDueDate;

  const week = Math.max(1, Math.min(42, differenceInCalendarWeeks(now, lmp) + 1));
  const daysToDueDate = formatDistanceStrict(finalDueDate, now, { locale: undefined });

  return {
    week,
    finalDueDate,
    daysToDueDate,
  };
}
