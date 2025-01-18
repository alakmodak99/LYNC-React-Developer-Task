import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const INITIAL_FILE_SYSTEM = {
  root: {
    id: "root",
    name: "Root",
    type: "folder",
    children: {},
    parent: null,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  },
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
