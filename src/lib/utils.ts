import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CareTask } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTaskDue(task: CareTask): boolean {
    const lastCompletedDate = new Date(task.lastCompleted);
    const dueDate = new Date(lastCompletedDate.setDate(lastCompletedDate.getDate() + task.frequencyDays));
    return new Date() >= dueDate;
}
